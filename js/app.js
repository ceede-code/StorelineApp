import { products } from './itemData.js';

const container = document.getElementById('items-container');

function renderProducts(items) {
  container.innerHTML = items.map(item => `
    <div class="item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="item-photo">
      <h4>${item.name}</h4>
      <p class="price">
        <strong>${item.price} ${item.currency}</strong>
        <button id="cb" class="add-cart">Add to Cart <span class="material-symbols-outlined">Shopping_cart</span></button>
      </p>
      <div class="category">
        <span>${item.category}</span>
      </div>
      <p class="description">${item.description}</p>
    </div>
  `).join('');
}

renderProducts(products);