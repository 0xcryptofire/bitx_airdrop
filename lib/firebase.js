import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHdwhkM0-MHWnA3R0UgxgdqsaBgzm-WQM",
  authDomain: "litemap-8a4c2.firebaseapp.com",
  projectId: "litemap-8a4c2",
  storageBucket: "litemap-8a4c2.appspot.com",
  messagingSenderId: "511397454436",
  appId: "1:511397454436:web:24b1e7c47399f033ad7571",
  measurementId: "G-23Y1ERTF4V"
}

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storedb = getFirestore(app);
