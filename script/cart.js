import { cart } from './menu.js';
import { generateOrderId } from './eta.js';


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
            const index = cart.findIndex(cartItem => cartItem.id === itemId);
            cart.splice(index, 1);
        }
        renderCart();
    }
}
document.querySelector('.icon-wrapper').addEventListener('click', switchToCart);
document.querySelector('.btn-order').addEventListener('click', () => {
    document.querySelector('.cart-view').classList.remove('active');
    document.querySelector('.eta-view').classList.add('active');
    const orderId = generateOrderId();
    document.querySelector('.eta-view .order-id').textContent = orderId;
    const wontons = cart.filter(item => item.type === 'wonton');
    const dips = cart.filter(item => item.type === 'dip');
    const drinks = cart.filter(item => item.type === 'drink');
    let title = '';
    if (wontons.length > 0 && dips.length === 0 && drinks.length === 0) {
        // Endast wontons
        if (wontons.length === 1 && wontons[0].quantity === 1) {
            title = `Din ${wontons[0].name} tillagas!`;
        } else {
            title = 'Dina wontons tillagas!';
        }
    } else if (dips.length > 0 && wontons.length === 0 && drinks.length === 0) {
        // Endast dips
        title = 'Dina dipsåser är klara!';
    } else if (drinks.length > 0 && wontons.length === 0 && dips.length === 0) {
        // Endast drycker
        title = 'Dina drycker är klara!';
    } else {
        // Blandad beställning
        title = 'Din beställning tillagas!';
    }
    
    document.querySelector('.eta-view .eta-title').textContent = title;
});

export { switchToCart, renderCart, increaseQuantity, decreaseQuantity };