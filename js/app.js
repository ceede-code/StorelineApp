import { products } from './itemData.js';
import { addToCart } from './script.js';

const container = document.getElementById('items-container');

function renderProducts(items) {
  if (!container) return;
  container.innerHTML = items.map(item => `
    <div class="item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="item-photo">
      <h4>${item.name}</h4>
      <p class="price">
        <strong>${item.price} ${item.currency}</strong>
        <button class="add-cart" data-id="${item.id}">Add to Cart</button>
      </p>
      <div class="category"><span>${item.category}</span></div>
      <p class="description">${item.description}</p>
    </div>
  `).join('');
  
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      addToCart(parseInt(this.dataset.id));
    });
  });
}

if (container) renderProducts(products);