import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyCHdwhkM0-MHWnA3R0UgxgdqsaBgzm-WQM",
//   authDomain: "litemap-8a4c2.firebaseapp.com",
//   projectId: "litemap-8a4c2",
//   storageBucket: "litemap-8a4c2.appspot.com",
//   messagingSenderId: "511397454436",
//   appId: "1:511397454436:web:24b1e7c47399f033ad7571",
//   measurementId: "G-23Y1ERTF4V"
// }

const firebaseConfig = {
  apiKey: "AIzaSyCGeLsH6l7DbHYGpbTgoerULeOnUmFN6Fw",
  authDomain: "bxdx-27200.firebaseapp.com",
  databaseURL: "https://bxdx-27200-default-rtdb.firebaseio.com",
  projectId: "bxdx-27200",
  storageBucket: "bxdx-27200.appspot.com",
  messagingSenderId: "303833726017",
  appId: "1:303833726017:web:194ef16fb348b009a39ac0",
  measurementId: "G-J4E8HY3TYN",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storedb = getFirestore(app);
