// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArCt642jPRQzz8dI4CC0d2ONRUBh77TRs",
  authDomain: "triplea-63044.firebaseapp.com",
  projectId: "triplea-63044",
  storageBucket: "triplea-63044.appspot.com",
  messagingSenderId: "558152443944",
  appId: "1:558152443944:web:afc575324e9e75e0de6d1d",
  measurementId: "G-MQ8MNRQ13S"
};

// Initialize Firebase
export const Firebase = initializeApp(firebaseConfig);
export const auth = getAuth(Firebase);
export const firestore = getFirestore(Firebase);