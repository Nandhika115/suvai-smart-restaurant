// app.js

document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu-container');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartCount = document.getElementById('cart-count');
    let cart = [];

    // Function to render menu items
    function renderMenu(menuItems) {
        menuContainer.innerHTML = '';
        menuItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-card';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <span>$${item.price.toFixed(2)}</span>
                <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
            `;
            menuContainer.appendChild(card);
        });
        attachAddToCartListeners();
    }

    // Function to attach event listeners to "Add to Cart" buttons
    function attachAddToCartListeners() {
        const buttons = document.querySelectorAll('.add-to-cart');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const itemId = button.getAttribute('data-id');
                addToCart(itemId);
            });
        });
    }

    // Function to add item to cart
    function addToCart(itemId) {
        const item = menuItems.find(item => item.id === itemId);
        const cartItem = cart.find(item => item.id === itemId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        updateCartCount();
        updateCartDrawer();
    }

    // Function to update cart count display
    function updateCartCount() {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Function to update cart drawer display
    function updateCartDrawer() {
        const cartList = document.getElementById('cart-list');
        cartList.innerHTML = '';
        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} x ${item.quantity}`;
            cartList.appendChild(listItem);
        });
    }

    // Fetch menu data and render
    fetch('./src/data/menu.js')
        .then(response => response.json())
        .then(data => {
            menuItems = data;
            renderMenu(menuItems);
        })
        .catch(error => console.error('Error fetching menu data:', error));

    // Cart drawer toggle
    document.getElementById('cart-toggle').addEventListener('click', () => {
        cartDrawer.classList.toggle('open');
    });
});