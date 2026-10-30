importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

// config arrives via ?query on the registration URL (see useNotifications.js)
const q = new URL(self.location.href).searchParams;
firebase.initializeApp({
  apiKey: q.get('apiKey'),
  authDomain: q.get('authDomain'),
  projectId: q.get('projectId'),
  messagingSenderId: q.get('messagingSenderId'),
  appId: q.get('appId'),
});
// notification payloads are shown automatically; click opens webpush.fcmOptions.link
firebase.messaging();
