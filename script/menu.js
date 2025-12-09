// Importera apiKey senare när det är initialiserat
let apiKey = null;

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

// Rendera menyn
function renderMenu(menuItems) {
    const container = document.querySelector('#menu-container');
    container.innerHTML = '';
    
    // Gruppera items efter typ
    const wontons = menuItems.filter(item => item.type === 'wonton');
    const dips = menuItems.filter(item => item.type === 'dip');
    const drinks = menuItems.filter(item => item.type === 'drink');
    
    // Rendera Wontons
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
            
            // Ingredienser
            if (wonton.ingredients && wonton.ingredients.length > 0) {
                const description = document.createElement('p');
                description.className = 'description';
                description.textContent = wonton.ingredients.join(', ');
                wontonsCard.appendChild(description);
            }
            
            // Gör klickbar för att lägga till i varukorg
            foodDiv.style.cursor = 'pointer';
            foodDiv.addEventListener('click', () => addToCart(wonton));
        });
        
        container.appendChild(wontonsCard);
    }}
    
    async function initMenu() {
        try {
            const response = await getMenu();
            const menuItems = response.items || response;  // Hämta items från objektet
            console.log('Menu items från API:', menuItems);
            renderMenu(menuItems);
        } catch (error) {
            console.error('Fel vid hämtning av meny:', error);
        }
    }

// Global varukorg
let cart = [];

function addToCart(item) {
    // Kolla om itemet redan finns i varukorgen
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        // Om det finns redan, öka mängden
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        // Annars lägg till nytt item med quantity = 1
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    console.log('Nuvarande varukorg:', cart);
    updateCartUI();  // Anropa detta för att uppdatera UI
}

function updateCartUI() {
    const cartCount = document.querySelector('#cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        cartCount.style.display = 'flex';  // Visa den
        cartCount.textContent = totalItems;
    } else {
        cartCount.style.display = 'none';  // Dölj den
    }
}

export { renderMenu, addToCart, cart, updateCartUI, getMenu, initMenu };
