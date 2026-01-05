
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace these with your actual Firebase project configuration
// All keys are left as empty strings per project guidelines. 
// Use environment variables for production.
const firebaseConfig = {
  apiKey: "",                           //------------------------------
  authDomain: "",                       //ADD                          |
  projectId: "",                        //FIREBASE                     |
  storageBucket: "",                    //CONFIGURATION                |
  messagingSenderId: "",                //HERE IN                      |
  appId: "",                            //firebaseConfig               |
  measurementId: ""                     //------------------------------
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
