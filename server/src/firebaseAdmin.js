// const admin = require("firebase-admin");
// require("dotenv").config();

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Fix newline issue
//     }),
//   });
// }

// const messaging = admin.messaging();

// module.exports = { admin, messaging };

const admin = require("firebase-admin");
const fs = require("fs");
require("dotenv").config(); // Only for local development

const keyPath = "/secrets/FIREBASE_SERVICE_ACCOUNT"; // Secret file in Cloud Run

let serviceAccount;

if (fs.existsSync(keyPath)) {
  // Running in Cloud Run - Read from the mounted secret
  try {
    serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
  } catch (error) {
    console.error("Error reading Firebase secret file:", error);
    process.exit(1); // Stop execution if secret is invalid
  }
} else {
  // Running locally - Use environment variables
  if (!process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error("FIREBASE_PRIVATE_KEY is missing in local environment.");
  }

  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Fix newline issue
  };
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    process.exit(1);
  }
}

const messaging = admin.messaging();

module.exports = { admin, messaging };
