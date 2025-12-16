import { cart, updateCartUI } from './menu.js';
import { getCurrentOrderId } from './eta.js';
import { switchView } from './views.js';
import { getLastOrderId } from './cart.js';

document.querySelector('.btn-receipt').addEventListener('click', () => {
    switchView('eta-view', 'receipt-view');
    
    renderReceipt();
    
});
//Renderar kvitton med beställda varor och deras kvantiteter samt totalpris
function renderReceipt() {
    const receiptItemsContainer = document.querySelector('.receipt-items');
    receiptItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'receipt-item';
        itemDiv.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">${item.quantity} stycken</div>
            </div>
            <div class="item-price">${item.price * item.quantity} SEK</div>
        `;
        receiptItemsContainer.appendChild(itemDiv);
    });
    //Visar order-ID och totalpris på kvittot
    document.querySelector('.receipt-view .order-id').textContent = '#' + getLastOrderId();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.querySelector('.receipt-view .total-price').textContent = total + ' SEK';
}
document.querySelector('.receipt-view .btn-new-order').addEventListener('click', () => {
    switchView('receipt-view', 'menu-view');
    cart.length = 0;
    updateCartUI();
});
export { renderReceipt };