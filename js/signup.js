import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { showNotification } from './script.js';

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');

  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Saving name to Firebase Auth profile
      await updateProfile(userCredential.user, { displayName: name });

      // Saving user details to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: name,
        email: email,
        createdAt: serverTimestamp()
      });

      showNotification(`Welcome, ${name}!`);
      setTimeout(() => window.location.href = 'index.html', 1500);
    } catch (error) {
      showNotification('Signup failed: ' + error.message);
    }
  });
});