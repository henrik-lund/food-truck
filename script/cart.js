import { cart } from './menu.js';

function switchToCart() {
    document.querySelector('.menu-view').classList.remove('active');
    document.querySelector('.cart-view').classList.add('active');
    renderCart(); 
}

function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = ''; 
    
    cart.forEach((item) => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <div class="item-header">
                <h4 class="item-name">${item.name}</h4>
                <span class="item-price">${item.price} SEK</span>
            </div>
            <div class="quantity-controls">
                <button class="btn-quantity btn-increase" data-id="${item.id}">+</button>
                <span class="quantity-text">${item.quantity} stycken</span>
                <button class="btn-quantity btn-decrease" data-id="${item.id}">-</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
    
        const increaseBtn = cartItemDiv.querySelector('.btn-increase');
        const decreaseBtn = cartItemDiv.querySelector('.btn-decrease');
        
        increaseBtn.addEventListener('click', () => increaseQuantity(item.id));
        decreaseBtn.addEventListener('click', () => decreaseQuantity(item.id));
    });
    
    updateTotal();
}

function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.querySelector('.total-price').textContent = total + ' SEK';
}


function increaseQuantity(itemId) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity += 1;
        renderCart();
    }
}

function decreaseQuantity(itemId) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            // Ta bort från cart om quantity blir 0
            const index = cart.findIndex(cartItem => cartItem.id === itemId);
            cart.splice(index, 1);
        }
        renderCart();
    }
}
document.querySelector('.icon-wrapper').addEventListener('click', switchToCart);

export { switchToCart, renderCart, increaseQuantity, decreaseQuantity };