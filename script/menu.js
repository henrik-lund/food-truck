import { renderDips } from './dips.js';
import { renderDrinks } from './drinks.js';

let apiKey = null;
let cart = [];
const cartCountElement = document.querySelector('#cart-count');

export function setApiKey(key) {apiKey = key;}

async function getMenu() {
    const response = await fetch('https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu', {
        headers: {'x-zocom': apiKey}
});
    const menu = await response.json();
    return menu;
}
//Rendera menyn
function renderMenu(menuItems) {
    const container = document.querySelector('#menu-container');
    container.innerHTML = '';
    const mainDishes = menuItems.filter(item => item.type === 'wonton');
    const dips = menuItems.filter(item => item.type === 'dip');
    const drinks = menuItems.filter(item => item.type === 'drink');
    
    if (mainDishes.length > 0) {
        const mainDishesCard = document.createElement('div');
        mainDishesCard.className = 'card';
        
        mainDishes.forEach(mainDish => {
            const foodDiv = document.createElement('div');
            foodDiv.className = 'food';
            foodDiv.innerHTML = `
        <span class="food-name">${mainDish.name.toUpperCase()}</span>
        <span class="dots"></span>
        <span class="price">${mainDish.price} SEK</span>`;
            mainDishesCard.appendChild(foodDiv);
            if (mainDish.ingredients && mainDish.ingredients.length > 0) {
                const description = document.createElement('p');
                description.className = 'description';
                description.textContent = mainDish.ingredients.join(', ');
                mainDishesCard.appendChild(description);
            }
            foodDiv.style.cursor = 'pointer';
            foodDiv.addEventListener('click', () => addToCart(mainDish));
        });
        
        container.appendChild(mainDishesCard);
    }
    renderDips(dips, container);
    renderDrinks(drinks, container);
} 
async function initMenu() {
    try {
        const response = await getMenu();
        const menuItems = response.items || response;
        renderMenu(menuItems);
    } catch (error) {
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
    updateCartUI(); 
}
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
    if (totalItems > 0) cartCountElement.textContent = totalItems;
}
export { renderMenu, addToCart, cart, updateCartUI, getMenu, initMenu };