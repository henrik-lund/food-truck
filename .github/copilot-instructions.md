# Food Truck App - AI Coding Instructions

## Project Overview
This is a food ordering application for a food truck, built with vanilla JavaScript and a remote API. The app has three main views: menu (food browsing), cart (order review), and ETA (order status confirmation).

**Tech Stack:** Vanilla JS (ES6 modules), HTML, CSS  
**External API:** AWS Lambda-based menu/order API  
**File Structure:**
- `index.html` - Single page with three view sections (`.menu-view`, `.cart-view`, `.eta-view`)
- `script/main.js` - API initialization and app bootstrap
- `script/menu.js` - Menu fetching, rendering, and cart management
- `styles/` - Modular CSS files (style.css, cart.css, eta.css, view.css)

## Critical Architecture Decisions

### API Key & Module Loading Order
**Problem:** `menu.js` imports `apiKey` from `main.js` before it's initialized, causing runtime errors.  
**Solution:** Use `setApiKey(key)` function pattern instead of direct import:
1. `main.js` calls `getApiKey()` → fetches key from AWS
2. `main.js` calls `setApiKey(apiKey)` to set key in `menu.js`
3. `main.js` then calls `initMenu()` (defined in `menu.js`)
4. `initMenu()` now has access to the populated `apiKey` variable

**Never:** Do not call `initMenu()` directly from `menu.js` - it breaks initialization order.

### View Switching Pattern
Views are hidden/shown via `.view` classes. Use `classList.add/remove` with class names like:
- `.menu-view.active` - Show menu
- `.cart-view.active` - Show cart
- `.eta-view.active` - Show order confirmation

### Cart State Management
Cart is a global array in `menu.js`. Structure:
```javascript
let cart = [{id: 1, name: "Karlstad", quantity: 2, price: 129, ...}, ...]
```
- `addToCart(item)` - Adds or increments quantity
- `updateCartUI()` - Updates cart badge count on icon
- Cart badge uses `#cartCount` element with flexbox styling for red circular badge

## Common Patterns to Follow

### API Requests with Headers
All requests require the `x-zocom` header with the API key:
```javascript
const response = await fetch(url, {
    headers: { 'x-zocom': apiKey }
});
```

### Dynamic DOM Rendering
Menu items are built with `document.createElement()` and attached to `#menu-container`:
```javascript
const foodDiv = document.createElement('div');
foodDiv.className = 'food';
foodDiv.innerHTML = `<span class="food-name">${item.name}</span>...`;
foodDiv.addEventListener('click', () => addToCart(item));
```

### CSS Structure
- `style.css` - Menu view styling (cards, food items, buttons)
- `cart.css` - Cart view layout
- `eta.css` - Confirmation page (centered content, logo sizing)
- `view.css` - View visibility management

## Known Issues & Solutions

**CORS Errors:** API may block requests from `http://127.0.0.1:5500` if CORS headers aren't configured. This is a server-side issue.

**Duplicate Exports:** Only export a function once. Choose either `export function foo()` or `export { foo }`, not both.

**Cart Count Not Showing:** Ensure `#cartCount` element exists in HTML with `display: none` by default in CSS.

## Development Tips
- Open DevTools (F12) to log `cart` array state after clicking items
- Check API response structure with `console.log('Menu:', menuItems)` in `initMenu()`
- Use `querySelector` for single elements, `querySelectorAll` for collections
- CSS classes determine what's visible - toggle `.active` class on `.view` containers
