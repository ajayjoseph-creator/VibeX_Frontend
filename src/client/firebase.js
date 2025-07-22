import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC0zPRZjtYHK1qFSQJduUFO6g4MTI0jP6Q",
  authDomain: "vibex-19415.firebaseapp.com",
  projectId: "vibex-19415",
  storageBucket: "vibex-19415.firebasestorage.app",
  messagingSenderId: "581072208629",
  appId: "1:581072208629:web:2896064f6766ed67223bbc",
  measurementId: "G-K78HZH33BJ"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);