// Menu items data
const menuItems = [
    {id: 1, name: "Pizza Margherita", category: "pizza", price: 8.50, description: "Pomodoro, mozzarella, basilico fresco"},
    {id: 2, name: "Pizza Bella Napoli", category: "pizza", price: 12.50, description: "Mozzarella di bufala DOP, pomodori San Marzano, basilico, olio EVO"},
    {id: 3, name: "Pizza Quattro Formaggi", category: "pizza", price: 11.00, description: "Gorgonzola, parmigiano, mozzarella, pecorino"},
    {id: 4, name: "Pizza Diavola", category: "pizza", price: 9.50, description: "Pomodoro, mozzarella, salame piccante"},
    {id: 5, name: "Pizza Carnivora", category: "pizza", price: 13.50, description: "Salsiccia, speck, salame, pancetta, mozzarella"},
    {id: 6, name: "Pizza Vegetariana", category: "pizza", price: 10.50, description: "Verdure grigliate, mozzarella, pomodoro"},
    {id: 7, name: "Bruschetta Napoletana", category: "antipasti", price: 6.50, description: "Pane tostato, pomodoro, aglio, basilico"},
    {id: 8, name: "Antipasto Misto", category: "antipasti", price: 12.00, description: "Salumi, formaggi, olive, verdure sott'olio"},
    {id: 9, name: "Mozzarella di Bufala", category: "antipasti", price: 9.00, description: "Con pomodori e basilico fresco"},
    {id: 10, name: "Coca Cola", category: "bevande", price: 3.00, description: "33cl"},
    {id: 11, name: "Birra Peroni", category: "bevande", price: 4.00, description: "66cl"},
    {id: 12, name: "Acqua Naturale", category: "bevande", price: 2.00, description: "75cl"},
    {id: 13, name: "Vino Rosso della Casa", category: "bevande", price: 15.00, description: "Bottiglia 75cl"},
    {id: 14, name: "Tiramisù", category: "dolci", price: 5.50, description: "Preparato secondo la ricetta tradizionale"},
    {id: 15, name: "Cannoli Siciliani", category: "dolci", price: 6.00, description: "Con ricotta fresca e gocce di cioccolato"},
    {id: 16, name: "Gelato Artigianale", category: "dolci", price: 4.50, description: "3 gusti a scelta"}
];

let cart = {};
let currentFilter = 'all';

// Get table number from URL parameter (QR code)
function getTableNumber() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('table') || '1';
}

// Initialize app
function init() {
    const tableNumber = getTableNumber();
    document.getElementById('tableNumber').textContent = tableNumber;
    renderMenu();
    updateCartSummary();
}

// Show/hide sections
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Add active class to corresponding nav button
    const navButtons = document.querySelectorAll('.nav-btn');
    if (sectionName === 'menu') {
        navButtons[0].classList.add('active');
    } else if (sectionName === 'home') {
        navButtons[1].classList.add('active');
    } else if (sectionName === 'order') {
        navButtons[2].classList.add('active');
    }
    
    // Update order section if showing order
    if (sectionName === 'order') {
        renderOrder();
    }
}

// Filter menu by category
function filterMenu(category) {
    currentFilter = category;
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderMenu();
}

// Render menu items
function renderMenu() {
    const menuContainer = document.getElementById('menuItems');
    const filteredItems = currentFilter === 'all' ? 
        menuItems : menuItems.filter(item => item.category === currentFilter);
    
    menuContainer.innerHTML = filteredItems.map(item => `
        <div class="menu-item">
            <div class="menu-item-header">
                <h3>${item.name}</h3>
                <span class="price">€${item.price.toFixed(2)}</span>
            </div>
            <p>${item.description}</p>
            <div class="quantity-control">
                <button class="qty-btn" onclick="decreaseQuantity(${item.id})" 
                        ${!cart[item.id] ? 'disabled' : ''}>-</button>
                <span class="qty-display">${cart[item.id] || 0}</span>
                <button class="qty-btn" onclick="increaseQuantity(${item.id})">+</button>
            </div>
        </div>
    `).join('');
}

// Increase item quantity
function increaseQuantity(itemId) {
    cart[itemId] = (cart[itemId] || 0) + 1;
    renderMenu();
    updateCartSummary();
}

// Decrease item quantity
function decreaseQuantity(itemId) {
    if (cart[itemId] > 0) {
        cart[itemId]--;
        if (cart[itemId] === 0) {
            delete cart[itemId];
        }
    }
    renderMenu();
    updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
    const cartSummary = document.getElementById('cartSummary');
    const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const cartTotal = Object.entries(cart).reduce((total, [itemId, qty]) => {
        const item = menuItems.find(item => item.id == itemId);
        return total + (item.price * qty);
    }, 0);

    document.getElementById('cartCount').textContent = cartCount;
    document.getElementById('cartTotal').textContent = cartTotal.toFixed(2);

    if (cartCount > 0) {
        cartSummary.classList.add('show');
    } else {
        cartSummary.classList.remove('show');
    }
}

// Render order summary
function renderOrder() {
    const orderContainer = document.getElementById('orderItems');
    const orderEntries = Object.entries(cart);

    if (orderEntries.length === 0) {
        orderContainer.innerHTML = '<p style="text-align: center; color: #999;">Il tuo carrello è vuoto</p>';
        document.getElementById('totalPrice').textContent = '0.00';
        return;
    }

    orderContainer.innerHTML = orderEntries.map(([itemId, qty]) => {
        const item = menuItems.find(item => item.id == itemId);
        const itemTotal = item.price * qty;
        
        return `
            <div class="order-item">
                <div class="order-item-info">
                    <h4>${item.name}</h4>
                    <p>Quantità: ${qty} × €${item.price.toFixed(2)}</p>
                </div>
                <div class="order-item-price">€${itemTotal.toFixed(2)}</div>
            </div>
        `;
    }).join('');

    const total = orderEntries.reduce((sum, [itemId, qty]) => {
        const item = menuItems.find(item => item.id == itemId);
        return sum + (item.price * qty);
    }, 0);

    document.getElementById('totalPrice').textContent = total.toFixed(2);
}

// Confirm order - FUNZIONE SOSTITUITA
function confirmOrder() {
    if (Object.keys(cart).length === 0) {
        alert('Il carrello è vuoto!');
        return;
    }

    // Crea l'oggetto ordine
    const order = {
        id: Date.now(), // ID univoco basato sul timestamp
        table: getTableNumber(),
        items: getOrderItems(),
        total: calculateTotal(),
        timestamp: new Date().toLocaleString('it-IT'),
        status: 'new' // new, in-progress, ready
    };

    // Invia ordine alla cucina
    sendOrderToKitchen(order);
    
    // Mostra conferma
    showOrderConfirmation();
}

// Aggiungi queste nuove funzioni
function getOrderItems() {
    return Object.entries(cart).map(([itemId, quantity]) => {
        const item = menuItems.find(item => item.id == itemId);
        return {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: quantity,
            subtotal: (item.price * quantity).toFixed(2)
        };
    });
}

function calculateTotal() {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
        const item = menuItems.find(item => item.id == itemId);
        return total + (item.price * quantity);
    }, 0).toFixed(2);
}

function sendOrderToKitchen(order) {
    // Recupera ordini esistenti dal localStorage
    const existingOrders = JSON.parse(localStorage.getItem('kitchenOrders') || '[]');
    
    // Aggiungi il nuovo ordine
    existingOrders.unshift(order); // aggiungi in testa per vedere prima gli ultimi
    
    // Salva nel localStorage
    localStorage.setItem('kitchenOrders', JSON.stringify(existingOrders));
    
    console.log('Ordine inviato alla cucina:', order);
}

function showOrderConfirmation() {
    // Nascondi navigazione
    document.getElementById('navigation').style.display = 'none';
    
    // Mostra sezione conferma
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('thankYou').classList.add('active');

    // Aggiorna dettagli ordine nella conferma
    document.getElementById('orderDetails').innerHTML = `
        <p><strong>Tavolo:</strong> ${getTableNumber()}</p>
        <p><strong>Orario:</strong> ${new Date().toLocaleString('it-IT')}</p>
        <p><strong>Totale:</strong> €${calculateTotal()}</p>
    `;

    // Countdown per tornare al menu
    let countdown = 10;
    const countdownElement = document.getElementById('countdown');
    
    const timer = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            resetCart();
            // Torna al menu
            document.getElementById('navigation').style.display = 'flex';
            document.getElementById('thankYou').classList.remove('active');
            document.getElementById('menu').classList.add('active');
        }
    }, 1000);
}

function resetCart() {
    cart = {};
    updateCartSummary();
    renderMenu();
}

// Initialize app when page loads
window.addEventListener('load', init);
