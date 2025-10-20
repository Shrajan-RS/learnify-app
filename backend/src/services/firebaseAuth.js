import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "learnify-mini-proj.firebaseapp.com",
  projectId: "learnify-mini-proj",
  storageBucket: "learnify-mini-proj.firebasestorage.app",
  messagingSenderId: "624261838709",
  appId: "1:624261838709:web:b5a5368f552215274d053c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app || "");

export default auth;
