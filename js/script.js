import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { products } from "./itemData.js";

export let cart = [];

export { products };
export let currentUser = null;

export function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      cart = [];
    }
    updateCartCount();
  }
}

export function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  if (currentUser) {
    saveUserCart(currentUser.uid);
  }
}

export function updateCartCount() {
  const countElement = document.getElementById('cart-count');
  if (countElement) {
    countElement.textContent = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }
}

export function updateUserUI(user) {
  const userDisplay = document.getElementById('user-display');
  if (userDisplay) {
    if (user) {
      const displayName = user.displayName || user.email.split('@')[0];
      userDisplay.innerHTML = `${displayName} <span class="material-symbols-outlined">account_circle</span>`;
      userDisplay.title = 'Click to log out';
      userDisplay.style.cursor = 'pointer';
    } else {
      userDisplay.innerHTML = `Profile <span class="material-symbols-outlined">account_circle</span>`;
      userDisplay.title = '';
      userDisplay.style.cursor = '';
    }
  }
}

export async function logoutUser() {
  try {

    if (currentUser && cart.length > 0) {
      await saveUserCart(currentUser.uid);
    }

    await signOut(auth);
    cart = [];
    localStorage.removeItem('cart');
    showNotification('Logged out');
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Logout error:', error);
    showNotification('Logout failed: ' + error.message);
  }
}

export function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
  } else {
    console.warn('addToCart: no product found with id', productId);
  }
}

export function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartCount();
}

export function updateQuantity(productId, newQuantity) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = newQuantity;
      saveCart();
      updateCartCount(); 
    }
  }
}

export function calculateTotal() {
  return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
}

export function showNotification(message) {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed; top: 80px; right: 20px; background: #4CAF50;
    color: white; padding: 15px 25px; border-radius: 5px; z-index: 1000;
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    if (notification.parentNode) notification.remove();
  }, 3000);
}

async function loadUserCart(userId) {
  try {
    const docSnap = await getDoc(doc(db, 'carts', userId));
    if (docSnap.exists()) {
      cart = docSnap.data().items || [];
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
    }
  } catch (error) {
    console.error('Error loading user cart:', error);
  }
}

async function saveUserCart(userId) {
  try {
    await setDoc(doc(db, 'carts', userId), {
      items: cart,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving user cart:', error);
  }
}


// ------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  loadCart();

  const userDisplay = document.getElementById('user-display');

  const profileTrigger = userDisplay ? userDisplay.closest('li') : null;
  if (profileTrigger) {
    profileTrigger.style.cursor = 'pointer';
    profileTrigger.addEventListener('click', () => {
      if (currentUser) {
        if (confirm('Log out of your account?')) {
          logoutUser();
        }
      } else {
        window.location.href = 'login.html';
      }
    });
  }

  onAuthStateChanged(auth, user => {
    currentUser = user;
    updateUserUI(user);

    const currentPage = window.location.pathname;
    const isAuthPage = currentPage.includes('login.html') || currentPage.includes('signup.html');


    if (!user && !isAuthPage) {
      window.location.href = 'login.html';
      return;
    }

    if (user) loadUserCart(user.uid);
  });
});