import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_apiKey || "AIzaSyB6HC30S3ZXBSW2AGx6HxwDnERyc-Htv5s",
  authDomain: process.env.NEXT_PUBLIC_authDomain || "aro-ekdin.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_projectId || "aro-ekdin",
  storageBucket: process.env.NEXT_PUBLIC_storageBucket || "aro-ekdin.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId || "791597234456",
  appId: process.env.NEXT_PUBLIC_appId || "1:791597234456:web:4cb6e1b88d6f184b8d066d",
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export default auth;
