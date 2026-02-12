import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrQ0rPUNBTxwYGsT9B6-nx2diqMbSIXv0",
  authDomain: "mytrip-59dbc.firebaseapp.com",
  databaseURL: "https://mytrip-59dbc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mytrip-59dbc",
  storageBucket: "mytrip-59dbc.firebasestorage.app",
  messagingSenderId: "889596162946",
  appId: "1:889596162946:web:fc7f7452938ece4aaa959b",
  measurementId: "G-HBDNVR4RCL"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();