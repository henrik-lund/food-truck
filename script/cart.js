import { cart } from './menu.js';
import { switchView } from './views.js';
import { apiKey, tenantId } from './api.js'; 

const iconWrapper = document.querySelector('.icon-wrapper');
const cartIcon = document.querySelector('.cart-icon');
const btnOrder = document.querySelector('.btn-order');
let lastOrderId = null;
function switchToCart() {
    switchView('menu-view', 'cart-view');
    renderCart(); 
}
function switchToMenu() {
    switchView('cart-view', 'menu-view');
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
        
    increaseBtn.addEventListener('click', () => updateQuantity(item.id, 1));
    decreaseBtn.addEventListener('click', () => updateQuantity(item.id, -1));
    });
    updateTotal();
}
function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.querySelector('.total-price').textContent = total + ' SEK';
}
function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    if (item.quantity <= 0) {
        cart.splice(cart.indexOf(item), 1);
    }
    renderCart();
}
function getOrderTitle(mainDishes, dips, drinks) {
    if (mainDishes.length > 0 && dips.length === 0 && drinks.length === 0) {
        const dishName = mainDishes[0].name;
        const allSameDish = mainDishes.every(item => item.name === dishName);
        if (allSameDish) {
            if (dishName === 'Karlstad') {
                return 'Dina wontons tillagas!';
            } else {
                const isPlural = mainDishes.length > 1 || mainDishes[0].quantity > 1;
                return isPlural 
                    ? `Dina ${dishName}s tillagas!` 
                    : `Din ${dishName} tillagas!`;
            }
        } else {
            return 'Din mat tillagas!';
        }
    } else if (dips.length > 0 && mainDishes.length === 0 && drinks.length === 0) {
        const isPlural = dips.length > 1 || dips[0].quantity > 1;
        return isPlural ? 'Dina dipsåser kan hämtas!' : 'Din dipsås kan hämtas!';
    } else if (drinks.length > 0 && mainDishes.length === 0 && dips.length === 0) {
        const isPlural = drinks.length > 1 || drinks[0].quantity > 1;
        return isPlural ? 'Dina drycker kan hämtas!' : 'Din dricka kan hämtas!';
    } else {
        return 'Din beställning tillagas!';
    }
}
async function submitOrder(orderItems) {
    try {
        const url = `https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/${tenantId}/orders`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-zocom': apiKey
            },
            body: JSON.stringify({
                items: orderItems.flatMap(item => Array(item.quantity).fill(item.id))
            })
        });
        if (!response.ok) {
            throw new Error('Beställningen misslyckades');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        showErrorMessage('Beställningen misslyckades. Försök igen.');
        throw error;
    }
}
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}
iconWrapper.addEventListener('click', switchToCart);
cartIcon.addEventListener('click', switchToMenu);
btnOrder.addEventListener('click', async () => {
    try {
        switchView('cart-view', 'eta-view');
        
        // Skicka order till API
        const orderData = await submitOrder(cart);
        lastOrderId = orderData.order.id;
        
        document.querySelector('.eta-view .order-id').textContent = '#' + orderData.order.id;
        
        // Beräkna ETA baserat på antal items
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const etaMinutes = totalItems <= 2 ? 5 : totalItems <= 5 ? 10 : 15;
        document.querySelector('.eta-view .eta-time').textContent = `ETA ${etaMinutes} MIN`;
        
        // Filtrera items och generera titel
        const mainDishes = cart.filter(item => item.type === 'wonton');
        const dips = cart.filter(item => item.type === 'dip');
        const drinks = cart.filter(item => item.type === 'drink');
        const title = getOrderTitle(mainDishes, dips, drinks);
        document.querySelector('.eta-view .eta-title').textContent = title;
    } catch (error) {
        switchView('eta-view', 'cart-view');
    }
});
export function getLastOrderId() {
    return lastOrderId;
}
export { switchToCart, renderCart, updateQuantity };