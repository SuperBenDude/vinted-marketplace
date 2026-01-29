import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDikgR1Ty0ze_6H9VNh9WKVOM8ZCQMxrho",
  authDomain: "vinted-marketplace.firebaseapp.com",
  databaseURL: "https://vinted-marketplace-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vinted-marketplace",
  storageBucket: "vinted-marketplace.firebasestorage.app",
  messagingSenderId: "939665228093",
  appId: "1:939665228093:web:4409f050a51bbd76fec554",
  measurementId: "G-E18G3ZXK3V"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
