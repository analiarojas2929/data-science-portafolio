// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiFPlObsWDEMBRmLm6Yaod1QPqnXMBsTw",
  authDomain: "datascience-portafolio.firebaseapp.com",
  projectId: "datascience-portafolio",
  storageBucket: "datascience-portafolio.firebasestorage.app",
  messagingSenderId: "381859808100",
  appId: "1:381859808100:web:adc611f836cedbf3bab071",
  measurementId: "G-P1XHGKQYX1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };