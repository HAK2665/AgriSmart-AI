
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace these with your actual Firebase project configuration
// All keys are left as empty strings per project guidelines. 
// Use environment variables for production.
const firebaseConfig = {
  apiKey: "AIzaSyATQhXSsys3B6TpZsEOV0lm3oEvlREeYXk",
  authDomain: "agrismart-ai-10b16.firebaseapp.com",
  projectId: "agrismart-ai-10b16",
  storageBucket: "agrismart-ai-10b16.firebasestorage.app",
  messagingSenderId: "777144264414",
  appId: "1:777144264414:web:67c72f5364e5a6c589044f",
  measurementId: "G-LH2ZW015N6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
