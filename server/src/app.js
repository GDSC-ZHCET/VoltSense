const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");
const { messaging } = require("./firebaseAdmin"); // Import Firebase Admin SDK
require("dotenv").config();

const cors = require("cors");

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Create an Express app
const expressApp = express();
expressApp.use(cors());
expressApp.use(express.json());

const userTokens = {}; // Store user tokens in memory (Use Firestore in production)

// Create an HTTP server
const server = http.createServer(expressApp);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    console.log(`Received raw message: ${message}`);

    try {
      // Parse the message as JSON
      const newData = JSON.parse(message);

      // Add timestamp to the data
      newData.timestamp = new Date().toISOString();

      // Store data in Firestore
      try {
        const docRef = await addDoc(collection(db, "sensorData"), newData);
        console.log("Data stored in Firestore with ID:", docRef.id);
      } catch (error) {
        console.error("Error storing data in Firestore:", error);
      }

      // Broadcast the message to all connected WebSocket clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(newData));
        }
      });
    } catch (error) {
      console.error("Invalid JSON received:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

expressApp.post("/api/save-token", (req, res) => {
  const { userId, token } = req.body;
  userTokens[userId] = token;
  console.log(`Saved FCM token for user ${userId}: ${token}`);
  res.status(200).send({ success: true });
});

// API to get stored tokens
expressApp.get("/api/get-tokens", (req, res) => {
  res.json({ tokens: Object.values(userTokens) });
});

// API to send notifications
expressApp.post("/api/send-notification", async (req, res) => {
  const { tokens, notification } = req.body;

  if (!tokens.length) {
    return res.status(400).send({ error: "No tokens available" });
  }

  const payload = {
    notification: {
      title: notification.title,
      body: notification.body,
    },
    tokens,
  };

  try {
    const response = await messaging.sendEachForMulticast(payload);
    console.log("FCM Notification sent:", response.successCount);
    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error sending FCM notification:", error);
    res.status(500).send({ error: "Failed to send notification" });
  }
});

// // Express API to send notifications
// expressApp.post("/api/send-notification", async (req, res) => {
//   const { tokens, notification } = req.body;

//   try {
//     const response = await admin.messaging().sendEachForMulticast({
//       tokens, // Array of FCM tokens
//       notification: {
//         title: notification.title,
//         body: notification.body,
//       },
//     });

//     if (response.failureCount > 0) {
//       const failedTokens = [];
//       response.responses.forEach((resp, idx) => {
//         if (!resp.success) {
//           failedTokens.push(tokens[idx]);
//         }
//       });
//       console.error("Failed to send notifications to tokens:", failedTokens);
//     }

//     res.status(200).json({ success: true, response });
//   } catch (error) {
//     console.error("Error sending notification:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});
