import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "learnify-2262d.firebaseapp.com",
  projectId: "learnify-2262d",
  storageBucket: "learnify-2262d.firebasestorage.app",
  messagingSenderId: "245334377555",
  appId: "1:245334377555:web:9dd3209c88e3b9eba272a6",
};

const app = initializeApp(firebaseConfig);

const googleAuth = getAuth(app);

export { app, googleAuth };
