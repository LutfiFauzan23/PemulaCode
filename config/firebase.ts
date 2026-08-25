import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Ganti nilai di bawah ini dengan config dari Firebase Console kamu
  const firebaseConfig = {
    apiKey: "AIzaSyB6jjFqRpIjKPU4ANBZt3BlRVhkASXFgyI",
    authDomain: "pemula-code.firebaseapp.com",
    projectId: "pemula-code",
    storageBucket: "pemula-code.firebasestorage.app",
    messagingSenderId: "510466392126",
    appId: "1:510466392126:web:e26774766bf2da5c9cd16f"
  };


// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// Inisialisasi layanan Firebase yang akan digunakan (Auth & Firestore)
export const auth = getAuth(app);
export const db = getFirestore(app);