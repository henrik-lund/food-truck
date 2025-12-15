import {renderMenu, addToCart, cart, updateCartUI, getMenu, initMenu, setApiKey} from './menu.js';
import { switchToCart, renderCart, updateQuantity } from './cart.js';
export let apiKey = null;
export let tenantId = null;

async function getApiKey() {
    const response = await fetch('https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/keys', {
        method: 'POST'
    });
    const data = await response.json();
    apiKey = data.key; 
    return apiKey;
}
async function createTenant() {
    const url = 'https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/tenants';
    const bodyToSend = {
        name: 'Henrik' + Math.floor(Math.random() * 10000) 
    };
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-zocom': apiKey 
        },
        body: JSON.stringify(bodyToSend)
    });
    const data = await response.json();
    tenantId = data.id;
    return data;
}

async function initApp() {
    await getApiKey();
    await createTenant();
    setApiKey(apiKey);  
    initMenu();
}

initApp();