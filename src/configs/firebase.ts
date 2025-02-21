// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDSEG9Rn5qzZjxHLmzJpuCwwf3wdreBkyo',
  authDomain: 'nextjs-ecommerce-d7c23.firebaseapp.com',
  projectId: 'nextjs-ecommerce-d7c23',
  storageBucket: 'nextjs-ecommerce-d7c23.firebasestorage.app',
  messagingSenderId: '380571243871',
  appId: '1:380571243871:web:26a94ef37b2bdab2f152ea',
  measurementId: 'G-FN871QDJS2'
}

// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig)

export default fireBaseApp

// const analytics = getAnalytics(app)
