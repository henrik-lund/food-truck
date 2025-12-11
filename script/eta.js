import { renderReceipt } from './receipt.js';
import { cart, updateCartUI } from './menu.js';
import { switchView } from './views.js';

document.querySelector('.eta-title').textContent = 'Din mat tillagas!';
document.querySelector('.eta-time').textContent = 'ETA 5 MIN';
document.querySelector('.btn-new-order').addEventListener('click', () => {
    // Töm varukorgen vid ny beställning
    cart.length = 0;
    updateCartUI();
    switchView('eta-view', 'menu-view');
});
let currentOrderId = '';
function generateOrderId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    currentOrderId = '#' + id;
    return currentOrderId;
}
document.querySelector('.btn-receipt').addEventListener('click', () => {
    switchView('eta-view', 'receipt-view');
});
function getCurrentOrderId() {
    return currentOrderId;
}
export { generateOrderId, getCurrentOrderId };