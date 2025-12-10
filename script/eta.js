import { renderReceipt } from './receipt.js';
import { cart, updateCartUI } from './menu.js';

document.querySelector('.eta-title').textContent = 'Dina wontons tillagas!';
document.querySelector('.eta-time').textContent = 'ETA 5 MIN';
document.querySelector('.btn-new-order').addEventListener('click', () => {
    // Töm varukorgen
    cart.length = 0;
    updateCartUI();
    
    document.querySelector('.eta-view').classList.remove('active');
    document.querySelector('.menu-view').classList.add('active');
});
let currentOrderId = '';

export function generateOrderId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    currentOrderId = '#' + id;
    return currentOrderId;
}
document.querySelector('.btn-receipt').addEventListener('click', () => {
    document.querySelector('.eta-view').classList.remove('active');
    document.querySelector('.receipt-view').classList.add('active');
});
export function getCurrentOrderId() {
    return currentOrderId;
}