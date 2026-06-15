import { initializeApp } from "firebase/app";
// 1. Import getFirestore
import { getFirestore } from "firebase/firestore";

// Your real web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-kHZaTmtyT6hMkuWIObyhnU_tTAQbkdo",
  authDomain: "ai-job-tracker-25671.firebaseapp.com",
  projectId: "ai-job-tracker-25671",
  storageBucket: "ai-job-tracker-25671.firebasestorage.app",
  messagingSenderId: "180889017869",
  appId: "1:180889017869:web:0748ffe4d1484aac74bf44",
  measurementId: "G-Z6NYRBCCG2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Initialize Firestore and EXPORT it so Dashboard.jsx can use it
export const db = getFirestore(app);