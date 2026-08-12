import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { showNotification } from './script.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginButton = document.getElementById('login-button');

  if (!loginForm) {
    console.error("login-form element not found!");
    return;
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (loginButton) {
      loginButton.disabled = true;
      loginButton.textContent = 'Logging in...';
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showNotification('Login successful!');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      showNotification('Login failed: ' + error.message);
      if (loginButton) {
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
      }
    }
  });
});