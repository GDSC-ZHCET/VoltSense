// const app = require("./app");
// const dotenv = require("dotenv").config();

// const PORT = process.env.PORT || 3001;

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3001 });

wss.on("connection", (ws) => {
  console.log("ESP32 connected via WebSocket");

  ws.on("message", (message) => {
    console.log("Received:", message);

    // Broadcast data to all connected clients (Dashboard)
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("ESP32 disconnected");
  });
});

console.log("WebSocket Server running on ws://localhost:3001");
