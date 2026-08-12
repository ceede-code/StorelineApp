import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCPQXnDgc_pmGfARe49R5l5DYvSejaVTH8",
  authDomain: "digital-store-d692c.firebaseapp.com",
  projectId: "digital-store-d692c",
  storageBucket: "digital-store-d692c.firebasestorage.app",
  messagingSenderId: "478647461932",
  appId: "1:478647461932:web:2189ffac12da80622dc989"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // 
export const db = getFirestore(app);