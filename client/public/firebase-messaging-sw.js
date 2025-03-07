// Import Firebase scripts first
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

let messaging = null; // Declare messaging globally

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "INIT_FIREBASE") {
    const firebaseConfig = event.data.firebaseConfig;

    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log("Received background message:", payload);

      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: "/voltsense.png",
      };

      self.registration.showNotification(
        notificationTitle,
        notificationOptions
      );
    });
  }
});
