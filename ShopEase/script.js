// ShopEase - basic JavaScript for the mini project

// Sample products. These are demo prices and do not represent real offers.
const products = [
    { id: 1, name: "Wireless Headphones", category: "Electronics", price: 1999, description: "Comfortable headphones for music and everyday listening.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80" },
    { id: 2, name: "Smart Watch", category: "Electronics", price: 2499, description: "A simple, stylish watch for your daily routine.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80" },
    { id: 3, name: "Camera", category: "Electronics", price: 4999, description: "Capture moments and keep your favourite memories.", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80" },
    { id: 4, name: "Bluetooth Speaker", category: "Electronics", price: 1499, description: "Compact speaker for music at home or on the go.", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80" },
    { id: 5, name: "Classic T-Shirt", category: "Clothing", price: 599, description: "A versatile everyday T-shirt with a relaxed fit.", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80" },
    { id: 6, name: "Casual Jacket", category: "Clothing", price: 1799, description: "A casual layer for cooler days and evening outings.", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80" },
    { id: 7, name: "Everyday Backpack", category: "Accessories", price: 1299, description: "Carry your daily essentials in a practical backpack.", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80" },
    { id: 8, name: "Classic Sunglasses", category: "Accessories", price: 799, description: "A timeless accessory for sunny days outdoors.", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80" }
];

let selectedCategory = "All";
let cart = loadCart();

function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

function loadCart() {
    try {
        return JSON.parse(localStorage.getItem("shopease-cart")) || [];
    } catch (error) {
        return [];
    }
}

function saveCart() {
    localStorage.setItem("shopease-cart", JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll(".cart-count").forEach(function (element) {
        element.textContent = count;
    });
}

function productCard(product) {
    return `
        <article class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-bottom"><span class="product-price">${formatPrice(product.price)}</span></div>
                <div class="product-buttons">
                    <button class="small-button secondary details-button" data-id="${product.id}">View Details</button>
                    <button class="small-button add-button" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        </article>`;
}

function showProducts(list, container) {
    if (!container) return;
    if (list.length === 0) {
        container.innerHTML = '<p class="empty-cart">No products found. Try another search.</p>';
        return;
    }
    container.innerHTML = list.map(productCard).join("");
}

function addToCart(productId) {
    const item = cart.find(function (cartItem) {
        return cartItem.id === productId;
    });

    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    renderCart();
    alert("Product added to your demo cart!");
}

function renderCart() {
    const cartContainer = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");
    if (!cartContainer || !totalElement) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty. Add a product to get started.</p>';
        totalElement.textContent = formatPrice(0);
        return;
    }

    let total = 0;
    cartContainer.innerHTML = cart.map(function (item) {
        const product = products.find(function (p) { return p.id === item.id; });
        if (!product) return "";
        const subtotal = product.price * item.quantity;
        total += subtotal;
        return `<div class="cart-row">
            <div><strong>${product.name}</strong><p>${formatPrice(product.price)} each · Quantity: ${item.quantity}</p></div>
            <strong>${formatPrice(subtotal)}</strong>
            <button class="remove-button" data-remove-id="${product.id}">Remove</button>
        </div>`;
    }).join("");

    totalElement.textContent = formatPrice(total);
}

function openProductDetails(productId) {
    const product = products.find(function (item) { return item.id === productId; });
    const dialog = document.getElementById("product-dialog");
    const content = document.getElementById("dialog-content");
    if (!product || !dialog || !content) return;

    content.innerHTML = `<div class="dialog-product">
        <img class="dialog-product-image" src="${product.image}" alt="${product.name}">
        <p class="product-category">${product.category}</p>
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <h3>${formatPrice(product.price)}</h3>
        <button class="button dialog-add-button" data-id="${product.id}">Add to Cart</button>
    </div>`;
    dialog.showModal();
}

function filterProducts() {
    const searchInput = document.getElementById("product-search");
    const container = document.getElementById("all-products");
    if (!container) return;

    const searchText = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const filtered = products.filter(function (product) {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchText) ||
            product.description.toLowerCase().includes(searchText);
        return matchesCategory && matchesSearch;
    });

    showProducts(filtered, container);
    const resultsMessage = document.getElementById("results-message");
    if (resultsMessage) resultsMessage.textContent = "Showing " + filtered.length + " product(s).";
}

function setupContactForm() {
    const form = document.getElementById("contact-form");
    const message = document.getElementById("form-message");
    if (!form || !message) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("full-name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const userMessage = document.getElementById("message").value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !email || !subject || !userMessage) {
            message.textContent = "Please fill in all required fields marked with *.";
            message.className = "form-message error";
        } else if (!emailPattern.test(email)) {
            message.textContent = "Please enter a valid email address.";
            message.className = "form-message error";
        } else {
            message.textContent = "Thank you, " + name + "! Your demo enquiry passed validation.";
            message.className = "form-message success";
            form.reset();
        }
    });

    form.addEventListener("reset", function () {
        message.textContent = "";
        message.className = "form-message";
    });
}

function setupTheme() {
    const savedTheme = localStorage.getItem("shopease-theme");
    if (savedTheme === "dark") document.body.classList.add("dark-mode");
    updateThemeButtons();

    document.querySelectorAll(".theme-toggle").forEach(function (button) {
        button.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
            const theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
            localStorage.setItem("shopease-theme", theme);
            updateThemeButtons();
        });
    });
}

function updateThemeButtons() {
    const isDark = document.body.classList.contains("dark-mode");
    document.querySelectorAll(".theme-toggle").forEach(function (button) {
        button.textContent = isDark ? "☀️" : "🌙";
        button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Show the current year in the footer.
    document.querySelectorAll(".year").forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });

    setupTheme();
    updateCartCount();

    // Home page featured products.
    showProducts(products.slice(0, 4), document.getElementById("featured-products"));

    // Products page search and category filters.
    const searchInput = document.getElementById("product-search");
    if (searchInput) searchInput.addEventListener("input", filterProducts);

    document.querySelectorAll(".filter-button").forEach(function (button) {
        button.addEventListener("click", function () {
            selectedCategory = button.dataset.category;
            document.querySelectorAll(".filter-button").forEach(function (filterButton) {
                filterButton.classList.remove("selected");
            });
            button.classList.add("selected");
            filterProducts();
        });
    });

    // Allow category links from the home page to preselect a category.
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get("category");
    if (requestedCategory && ["Electronics", "Clothing", "Accessories"].includes(requestedCategory)) {
        selectedCategory = requestedCategory;
        document.querySelectorAll(".filter-button").forEach(function (button) {
            button.classList.toggle("selected", button.dataset.category === selectedCategory);
        });
    }
    filterProducts();
    renderCart();

    // Event delegation handles buttons inside product cards and the cart.
    document.addEventListener("click", function (event) {
        const addButton = event.target.closest(".add-button");
        if (addButton) addToCart(Number(addButton.dataset.id));

        const detailsButton = event.target.closest(".details-button");
        if (detailsButton) openProductDetails(Number(detailsButton.dataset.id));

        const dialogAddButton = event.target.closest(".dialog-add-button");
        if (dialogAddButton) {
            addToCart(Number(dialogAddButton.dataset.id));
            document.getElementById("product-dialog").close();
        }

        const removeButton = event.target.closest("[data-remove-id]");
        if (removeButton) {
            const id = Number(removeButton.dataset.removeId);
            cart = cart.filter(function (item) { return item.id !== id; });
            saveCart();
            updateCartCount();
            renderCart();
        }
    });

    const closeDialog = document.getElementById("dialog-close");
    const dialog = document.getElementById("product-dialog");
    if (closeDialog && dialog) closeDialog.addEventListener("click", function () { dialog.close(); });

    const clearCartButton = document.getElementById("clear-cart");
    if (clearCartButton) {
        clearCartButton.addEventListener("click", function () {
            cart = [];
            saveCart();
            updateCartCount();
            renderCart();
        });
    }

    setupContactForm();
});
