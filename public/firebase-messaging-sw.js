// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js')
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js')

const firebaseConfig = {
  apiKey: 'AIzaSyDSEG9Rn5qzZjxHLmzJpuCwwf3wdreBkyo',
  authDomain: 'nextjs-ecommerce-d7c23.firebaseapp.com',
  projectId: 'nextjs-ecommerce-d7c23',
  storageBucket: 'nextjs-ecommerce-d7c23.firebasestorage.app',
  messagingSenderId: '380571243871',
  appId: '1:380571243871:web:26a94ef37b2bdab2f152ea',
  measurementId: 'G-FN871QDJS2'
}
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig)
// eslint-disable-next-line no-undef
const messaging = firebase.messaging()
console.log('firebase messaging', { messaging })

messaging.onBackgroundMessage(payload => {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo.png'
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})
