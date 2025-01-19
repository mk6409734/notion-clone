import { getApps, initializeApp, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1vG6cC2x25Ps4--Ot8Tt7OQuRtPsrflg",
  authDomain: "notion-web-90384.firebaseapp.com",
  projectId: "notion-web-90384",
  storageBucket: "notion-web-90384.firebasestorage.app",
  messagingSenderId: "475329642760",
  appId: "1:475329642760:web:4065561b6c53387901ecbd",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export {db};