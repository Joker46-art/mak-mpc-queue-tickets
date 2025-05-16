
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyArfPuizcQMreTyLjTsFPf9r4a9NnOmXVI",
  authDomain: "queingdatabase-610fe.firebaseapp.com",
  projectId: "queingdatabase-610fe",
  storageBucket: "queingdatabase-610fe.firebasestorage.app",
  messagingSenderId: "155595989448",
  appId: "1:155595989448:web:67652e4629ad7ca5e120fd",
  measurementId: "G-5M10521QJN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
