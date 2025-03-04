import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let messaging: Messaging | null = null;
if (typeof window !== "undefined") {
  isSupported()
    .then(async (supported) => {
      if (supported) {
        try {
          const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          );

          console.log("Service Worker registered:", registration);

          // Ensure the service worker is ready before sending the config
          await navigator.serviceWorker.ready;

          // ✅ Send Firebase config to the service worker
          registration.active?.postMessage({
            type: "INIT_FIREBASE",
            firebaseConfig,
          });

          messaging = getMessaging(app);
        } catch (error) {
          console.error("Failed to register service worker:", error);
        }
      } else {
        console.warn("FCM is not supported in this browser.");
      }
    })
    .catch((error) => {
      console.error("Error checking FCM support:", error);
    });
}

export { auth, db, messaging };
