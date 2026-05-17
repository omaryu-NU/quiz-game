import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB6q4xUIoKov51xs-5hKXuih1LmEh0GUIQ",
  authDomain: "quiz-game-63627.firebaseapp.com",
  databaseURL: "https://quiz-game-63627-default-rtdb.firebaseio.com",
  projectId: "quiz-game-63627",
  storageBucket: "quiz-game-63627.firebasestorage.app",
  messagingSenderId: "471417634356",
  appId: "1:471417634356:web:e00a058178cb86bcc7d461"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);