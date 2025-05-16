
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
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

// Enable offline persistence where available
try {
  enableIndexedDbPersistence(db)
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('IndexedDB persistence is only available in one tab at a time');
      } else if (err.code === 'unimplemented') {
        console.warn('Browser does not support IndexedDB persistence');
      }
    });
} catch (e) {
  console.warn('Error enabling offline persistence:', e);
}

export default app;
