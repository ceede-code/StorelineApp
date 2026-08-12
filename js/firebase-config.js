// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPQXnDgc_pmGfARe49R5l5DYvSejaVTH8",
  authDomain: "digital-store-d692c.firebaseapp.com",
  projectId: "digital-store-d692c",
  storageBucket: "digital-store-d692c.firebasestorage.app",
  messagingSenderId: "478647461932",
  appId: "1:478647461932:web:2189ffac12da80622dc989",
  measurementId: "G-BY3WVLFF2E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);