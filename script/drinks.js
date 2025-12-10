import { addToCart } from './menu.js';

function renderDrinks(drinks, container) {
    if (drinks.length > 0) {
        const drinksCard = document.createElement('div');
        drinksCard.className = 'card';
        
        const drinksHeader = document.createElement('div');
        drinksHeader.className = 'drink';
        drinksHeader.innerHTML = `
        <h3 class="drink-title">Dricka</h3>
        <span class="dots"></span>
        <span class="price">${drinks[0].price} SEK</span>`;
        drinksCard.appendChild(drinksHeader);
        
        const drinksButtons = document.createElement('div');
        drinksButtons.className = 'menu-btns';
        
        drinks.forEach(drink => {
            const button = document.createElement('button');
            button.textContent = drink.name;
            button.dataset.id = drink.id;
            button.dataset.price = drink.price;
            button.addEventListener('click', () => addToCart(drink));
            drinksButtons.appendChild(button);
        });
        
        drinksCard.appendChild(drinksButtons);
        container.appendChild(drinksCard);
    }
}
export { renderDrinks };