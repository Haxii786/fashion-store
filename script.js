// ----------------------------
// NIGHT MODE
// ----------------------------
const toggleBtn = document.getElementById('modeToggle');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    toggleBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light' : '🌙 Night';
  });
}

// ----------------------------
// SEARCH, CATEGORY & PRICE FILTER
// ----------------------------
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryFilter = document.getElementById('categoryFilter');
const priceRange = document.getElementById('priceRange');
const minPriceValue = document.getElementById('minPriceValue');
const maxPriceValue = document.getElementById('maxPriceValue');
const productCards = document.querySelectorAll('.product-card');

function filterProducts() {
  const searchValue = searchInput?.value?.toLowerCase() || "";
  const categoryValue = categoryFilter?.value || "all";
  const maxPrice = parseInt(priceRange?.value || 3000);

  if (maxPriceValue) maxPriceValue.textContent = maxPrice;

  productCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const category = card.getAttribute('data-category');
    const price = parseInt(card.getAttribute('data-price'));

    const matchesSearch = title.includes(searchValue);
    const matchesCategory = categoryValue === 'all' || category === categoryValue;
    const matchesPrice = price <= maxPrice;

    card.style.display = (matchesSearch && matchesCategory && matchesPrice) ? 'block' : 'none';
  });
}

if (searchInput) {
  searchBtn.addEventListener('click', filterProducts);
  searchInput.addEventListener('keyup', filterProducts);
  categoryFilter.addEventListener('change', filterProducts);
  priceRange.addEventListener('input', filterProducts);
}

// ----------------------------
// CART SYSTEM
// ----------------------------
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateLocalCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(product);
  }
  updateLocalCart();
  alert(`${product.name} added to cart!`);
}

// Handle "Add to Cart" buttons
document.querySelectorAll('.add-cart-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    const product = {
      id: card.getAttribute('data-id'),
      name: card.getAttribute('data-name'),
      price: parseInt(card.getAttribute('data-price')),
      img: card.getAttribute('data-img'),
      quantity: 1
    };
    addToCart(product);
  });
});

// ----------------------------
// CART PAGE LOGIC
// ----------------------------
const cartContainer = document.querySelector('.cart-items');
if (cartContainer) {
  renderCart();
}

function renderCart() {
  const cartContainer = document.querySelector('.cart-items');
  const totalDisplay = document.querySelector('.total-price');

  if (!cartContainer) return;

  cartContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      const div = document.createElement('div');
      div.classList.add('cart-item');
      div.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>₹${item.price} × ${item.quantity}</p>
          <button class="remove-btn" data-index="${index}">Remove</button>
        </div>
      `;
      cartContainer.appendChild(div);
    });
  }

  if (totalDisplay) totalDisplay.textContent = `₹${total}`;
  updateLocalCart();

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const index = e.target.getAttribute('data-index');
      cart.splice(index, 1);
      renderCart();
    });
  });
}

// ----------------------------
// CHECKOUT POPUP LOGIC
// ----------------------------
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutPopup = document.getElementById('checkoutPopup');
const closePopup = document.getElementById('closePopup');
const checkoutForm = document.getElementById('checkoutForm');

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert("Your cart is empty! Add some products first.");
    } else {
      checkoutPopup.style.display = 'flex';
    }
  });
}

if (closePopup) {
  closePopup.addEventListener('click', () => {
    checkoutPopup.style.display = 'none';
  });
}

if (checkoutForm) {
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('custName').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const payment = document.getElementById('paymentMethod').value;

    // ----------------------------
// SAVE ORDER & SHOW SUCCESS MESSAGE
// ----------------------------
const totalAmount = document.querySelector('.total-price')?.textContent || '₹0';
const order = {
  id: Date.now(),
  name,
  address,
  payment,
  total: totalAmount,
  date: new Date().toLocaleString(),
  items: [...cart]
};

// Save order in localStorage
let orders = JSON.parse(localStorage.getItem('orders')) || [];
orders.push(order);
localStorage.setItem('orders', JSON.stringify(orders));

// Clear cart
localStorage.removeItem('cart');
cart = [];
renderCart();
checkoutPopup.style.display = 'none';

alert(`🎉 Thank you, ${name}! Your order has been placed successfully.\n\nYou can view it in "Your Orders".`);

  });
}
// ----------------------------
// ADMIN LOGIN LOGIC
// ----------------------------
const adminLoginSection = document.getElementById('adminLogin');
const adminDashboardSection = document.getElementById('adminDashboard');
const adminLoginForm = document.getElementById('adminLoginForm');
const logoutBtn = document.getElementById('logoutBtn');
const loginError = document.getElementById('loginError');

// Change your admin credentials here 👇
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "12345";

// Check login status
if (localStorage.getItem('adminLoggedIn') === 'true') {
  showDashboard();
} else {
  showLogin();
}

// Handle login form
if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('adminUser').value.trim();
    const pass = document.getElementById('adminPass').value.trim();

    if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
      localStorage.setItem('adminLoggedIn', 'true');
      showDashboard();
    } else {
      loginError.textContent = "Invalid username or password!";
    }
  });
}

// Logout button
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    showLogin();
  });
}

// Helper functions
function showDashboard() {
  if (adminLoginSection) adminLoginSection.style.display = 'none';
  if (adminDashboardSection) adminDashboardSection.style.display = 'block';
  loadAdminData();
}

function showLogin() {
  if (adminLoginSection) adminLoginSection.style.display = 'block';
  if (adminDashboardSection) adminDashboardSection.style.display = 'none';
}

// Load admin data from localStorage
function loadAdminData() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const adminOrdersContainer = document.querySelector('.admin-orders-list');
  const totalOrdersEl = document.getElementById('totalOrders');
  const totalProductsEl = document.getElementById('totalProducts');
  const totalRevenueEl = document.getElementById('totalRevenue');

  let totalOrders = orders.length;
  let totalProducts = 0;
  let totalRevenue = 0;

  adminOrdersContainer.innerHTML = "";

  orders.forEach(order => {
    const div = document.createElement('div');
    div.classList.add('admin-order-card');
    let itemsHTML = "";
    order.items.forEach(item => {
      totalProducts += item.quantity;
      totalRevenue += item.price * item.quantity;
      itemsHTML += `<li>${item.name} - ₹${item.price} × ${item.quantity}</li>`;
    });

    div.innerHTML = `
      <h4>Order #${order.id}</h4>
      <p><strong>Name:</strong> ${order.name}</p>
      <p><strong>Payment:</strong> ${order.payment}</p>
      <p><strong>Total:</strong> ${order.total}</p>
      <p><strong>Date:</strong> ${order.date}</p>
      <ul>${itemsHTML}</ul>
    `;
    adminOrdersContainer.appendChild(div);
  });

  totalOrdersEl.textContent = totalOrders;
  totalProductsEl.textContent = totalProducts;
  totalRevenueEl.textContent = "₹" + totalRevenue.toLocaleString();
}
// ----------------------------
// ADMIN DASHBOARD LOGIC
// ----------------------------
const adminOrdersContainer = document.querySelector('.admin-orders-list');
const totalOrdersEl = document.getElementById('totalOrders');
const totalProductsEl = document.getElementById('totalProducts');
const totalRevenueEl = document.getElementById('totalRevenue');

if (adminOrdersContainer) {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];

  let totalOrders = orders.length;
  let totalProducts = 0;
  let totalRevenue = 0;

  if (orders.length === 0) {
    adminOrdersContainer.innerHTML = '<p>No orders available.</p>';
  } else {
    orders.forEach(order => {
      const div = document.createElement('div');
      div.classList.add('admin-order-card');

      let orderItemsHTML = '';
      order.items.forEach(item => {
        totalProducts += item.quantity;
        totalRevenue += item.price * item.quantity;
        orderItemsHTML += `<li>${item.name} - ₹${item.price} × ${item.quantity}</li>`;
      });

      div.innerHTML = `
        <h4>Order #${order.id}</h4>
        <p><strong>Name:</strong> ${order.name}</p>
        <p><strong>Payment:</strong> ${order.payment}</p>
        <p><strong>Total:</strong> ${order.total}</p>
        <p><strong>Date:</strong> ${order.date}</p>
        <ul>${orderItemsHTML}</ul>
      `;
      adminOrdersContainer.appendChild(div);
    });
  }

  totalOrdersEl.textContent = totalOrders;
  totalProductsEl.textContent = totalProducts;
  totalRevenueEl.textContent = "₹" + totalRevenue.toLocaleString();
}
// ----------------------------
// ORDERS PAGE LOGIC
// ----------------------------
const ordersContainer = document.querySelector('.orders-list');
if (ordersContainer) {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];

  if (orders.length === 0) {
    ordersContainer.innerHTML = '<p>You have no orders yet.</p>';
  } else {
    orders.forEach(order => {
      const div = document.createElement('div');
      div.classList.add('order-card');
      div.innerHTML = `
        <h3>Order #${order.id}</h3>
        <p><strong>Name:</strong> ${order.name}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Payment:</strong> ${order.payment}</p>
        <p><strong>Total:</strong> ${order.total}</p>
        <p><strong>Date:</strong> ${order.date}</p>
        <div class="order-items">
          <strong>Items:</strong>
          <ul>
            ${order.items.map(i => `<li>${i.name} (₹${i.price} × ${i.quantity})</li>`).join('')}
          </ul>
        </div>
      `;
      ordersContainer.appendChild(div);
    });
  }
}
