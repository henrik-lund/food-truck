import { addToCart, renderMenu } from './menu.js';

function renderDips(dips, container) {
  if (dips.length > 0) {
    const dipsCard = document.createElement('div');
    dipsCard.className = 'card';
    
    const dipsHeader = document.createElement('div');
    dipsHeader.className = 'dip';
    dipsHeader.innerHTML = `
      <h2 class="dips-title">Dipsås</h2>
      <span class="dots"></span>
      <span class="price">${dips[0].price} SEK</span>
    `;
    dipsCard.appendChild(dipsHeader);
    const dipsButtons = document.createElement('div');
    dipsButtons.className = 'menu-btns';
    dips.forEach(dip => {
      const button = document.createElement('button');
      button.textContent = dip.name;
      button.dataset.id = dip.id;
      button.dataset.price = dip.price;
      button.addEventListener('click', () => addToCart(dip));
      dipsButtons.appendChild(button);
    });
    dipsCard.appendChild(dipsButtons);
    container.appendChild(dipsCard);
  }
}
export { renderDips };