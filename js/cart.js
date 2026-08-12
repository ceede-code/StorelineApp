import { cart, calculateTotal, removeFromCart, updateQuantity, currentUser, showNotification } from './script.js';
import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export function renderCartItems() {
  const cartContainer = document.getElementById('cart-container');
  const emptyCart = document.getElementById('empty-cart');
  const cartSummary = document.getElementById('cart-summary');
  
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = '';
    if (emptyCart) emptyCart.style.display = 'block';
    if (cartSummary) cartSummary.style.display = 'none';
    return;
  }
  
  if (emptyCart) emptyCart.style.display = 'none';
  if (cartSummary) cartSummary.style.display = 'block';
  
  cartContainer.innerHTML = cart.map(item => `
    <div class="item cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="item-photo">
      <h4>${item.name}</h4>
      <p class="price"><strong>${item.price} ${item.currency}</strong></p>
      <div class="quantity-controls">
        <button class="qty-btn dec-btn" data-id="${item.id}" data-qty="${item.quantity - 1}">-</button>
        <span class="quantity">${item.quantity}</span>
        <button class="qty-btn inc-btn" data-id="${item.id}" data-qty="${item.quantity + 1}">+</button>
      </div>
      <p class="item-total">Total: <strong>${item.price * item.quantity} ${item.currency}</strong></p>
      <button class="remove-btn" data-id="${item.id}">Remove</button>
    </div>
  `).join('');

  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      updateQuantity(parseInt(e.target.dataset.id), parseInt(e.target.dataset.qty));
      renderCartItems();
    });
  });

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      removeFromCart(parseInt(e.target.dataset.id));
      renderCartItems();
    });
  });

  document.getElementById('total-items').textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
  document.getElementById('total-price').textContent = `ZAR ${calculateTotal().toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('cart.html')) {
    renderCartItems();
    
    document.getElementById('checkout-btn')?.addEventListener('click', async () => {
      if (cart.length === 0) return showNotification('Your cart is empty!');
      if (!currentUser) return showNotification('Please login to checkout');
      
      try {
        await addDoc(collection(db, 'orders'), {
          userId: currentUser.uid,
          items: cart,
          total: calculateTotal(),
          status: 'pending',
          createdAt: serverTimestamp()
        });
        showNotification('Order placed successfully!');
        setTimeout(() => window.location.href = 'index.html', 2000);
      } catch (err) {
        showNotification('Error placing order: ' + err.message);
      }
    });
  }
});