import { renderDips } from './dips.js';
import { renderDrinks } from './drinks.js';

let apiKey = null;
let cart = [];

export function setApiKey(key) {
    apiKey = key;
}

async function getMenu() {
    const response = await fetch('https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu', {
        headers: {
            'x-zocom': apiKey
        }
    });
    
    const menu = await response.json();
    return menu;
}
//Rendera menyn
function renderMenu(menuItems) {
    const container = document.querySelector('#menu-container');
    container.innerHTML = '';
    const wontons = menuItems.filter(item => item.type === 'wonton');
    const dips = menuItems.filter(item => item.type === 'dip');
    const drinks = menuItems.filter(item => item.type === 'drink');
    
    if (wontons.length > 0) {
        const wontonsCard = document.createElement('div');
        wontonsCard.className = 'card';
        
        wontons.forEach(wonton => {
            const foodDiv = document.createElement('div');
            foodDiv.className = 'food';
            foodDiv.innerHTML = `
        <span class="food-name">${wonton.name}</span>
        <span class="dots"></span>
        <span class="price">${wonton.price} SEK</span>`;
            wontonsCard.appendChild(foodDiv);
            if (wonton.ingredients && wonton.ingredients.length > 0) {
                const description = document.createElement('p');
                description.className = 'description';
                description.textContent = wonton.ingredients.join(', ');
                wontonsCard.appendChild(description);
            }
            foodDiv.style.cursor = 'pointer';
            foodDiv.addEventListener('click', () => addToCart(wonton));
        });
        
        container.appendChild(wontonsCard);
    }
    
    // Rendera Dipsåser
    renderDips(dips, container);
    
    // Rendera Drycker
    renderDrinks(drinks, container);
} 

async function initMenu() {
    try {
        const response = await getMenu();
        const menuItems = response.items || response;
        console.log('Menu items från API:', menuItems);
        renderMenu(menuItems);
    } catch (error) {
        console.error('Fel vid hämtning av meny:', error);
    }
}

function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    console.log('Nuvarande varukorg:', cart);
    updateCartUI(); 
}

function updateCartUI() {
    const cartCount = document.querySelector('#cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        cartCount.style.display = 'flex';  
        cartCount.textContent = totalItems;
    } else {
        cartCount.style.display = 'none'; 
    }
}

export { renderMenu, addToCart, cart, updateCartUI, getMenu, initMenu };