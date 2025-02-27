const admin = require("firebase-admin");
require("dotenv").config();
const fs = require("fs");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Fix newline issue
      // privateKey: fs.readFileSync(
      //   process.env.FIREBASE_PRIVATE_KEY_FILE,
      //   "utf8"
      // ),
    }),
  });
}

const messaging = admin.messaging();

module.exports = { admin, messaging };
