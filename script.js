/* ==========================================================================
   VELORA LUXURY E-COMMERCE INTERACTIVE ENGINE
   ========================================================================== */

// 1. Mock Data Source
const PRODUCTS = [
    {
        id: 1,
        name: "The Mini Structured Tote",
        category: "Handbags",
        price: 340,
        rating: 4.9,
        reviews: 28,
        featured: true,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800",
        description: "Crafted in Florence from textured grain calfskin. Features dual structured handles and a detachable crossbody strap."
    },
    {
        id: 2,
        name: "Heritage Silk Square Scarf",
        category: "Silk Scarves",
        price: 120,
        rating: 4.8,
        reviews: 14,
        featured: true,
        image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=800",
        description: "100% Mulberry silk woven with hand-rolled edges. Printed with our signature geometric motif."
    },
    {
        id: 3,
        name: "Sculpted Gold Hoop Earrings",
        category: "Jewelry",
        price: 185,
        rating: 5.0,
        reviews: 42,
        featured: true,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
        description: "18k gold vermeil hand-cast in fluid curves. Hypoallergenic lightweight post design."
    },
    {
        id: 4,
        name: "The Soft Leather Shoulder Bag",
        category: "Handbags",
        price: 450,
        rating: 4.7,
        reviews: 19,
        featured: false,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800",
        description: "Slouchy luxury silhouette made from supple nappa leather with magnetic closure."
    },
    {
        id: 5,
        name: "Tortoiseshell Polarized Glasses",
        category: "Accessories",
        price: 160,
        rating: 4.6,
        reviews: 9,
        featured: false,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800",
        description: "Hand-cut Italian acetate frames with 100% UV protection lenses."
    },
    {
        id: 6,
        name: "Minimalist Leather Card Case",
        category: "Accessories",
        price: 95,
        rating: 4.9,
        reviews: 31,
        featured: false,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800",
        description: "Slim profile with 4 main card slots and a central pocket for folded bills."
    }
];

// App State
let cart = [];
let wishlist = [];
let appliedCoupon = null;
let currentCategory = "all";
let maxPrice = 600;

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    // Render Icons
    lucide.createIcons();

    // Render Home & Shop Grid
    renderProducts();

    // Event Listeners
    setupEventListeners();
});

// Render Product Cards
function renderProducts() {
    const featuredGrid = document.getElementById("featured-product-grid");
    const shopGrid = document.getElementById("shop-product-grid");

    // Filter Logic
    let filtered = PRODUCTS.filter(p => {
        const matchesCategory = currentCategory === "all" || p.category === currentCategory;
        const matchesPrice = p.price <= maxPrice;
        return matchesCategory && matchesPrice;
    });

    // Render Featured (Home)
    if (featuredGrid) {
        const featured = PRODUCTS.filter(p => p.featured);
        featuredGrid.innerHTML = featured.map(p => createProductCardHtml(p)).join("");
    }

    // Render Shop Grid
    if (shopGrid) {
        shopGrid.innerHTML = filtered.map(p => createProductCardHtml(p)).join("");
        document.getElementById("product-count-text").innerText = `Showing ${filtered.length} items`;
    }

    lucide.createIcons();
}

// Generate HTML for Single Product Card
function createProductCardHtml(product) {
    const isWishlist = wishlist.includes(product.id);
    return `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" />
                <button class="wishlist-icon-btn" onclick="toggleWishlist(${product.id})">
                    <i data-lucide="heart" style="fill: ${isWishlist ? '#8C6D46' : 'none'}; color: ${isWishlist ? '#8C6D46' : '#171717'}"></i>
                </button>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title" onclick="openProductModal(${product.id})" style="cursor:pointer">${product.name}</h3>
                <p style="font-size:0.8rem; color: #666;">★ ${product.rating} (${product.reviews})</p>
                <div class="product-price-row">
                    <span class="price">$${product.price}.00</span>
                    <button class="btn btn-sm btn-outline" onclick="addToCart(${product.id})">ADD TO BAG</button>
                </div>
            </div>
        </div>
    `;
}

// Event Listeners
function setupEventListeners() {
    // Drawer Toggles
    document.getElementById("cart-btn").addEventListener("click", () => toggleDrawer("cart-drawer-overlay", true));
    document.getElementById("close-cart-btn").addEventListener("click", () => toggleDrawer("cart-drawer-overlay", false));

    document.getElementById("wishlist-btn").addEventListener("click", () => {
        renderWishlistDrawer();
        toggleDrawer("wishlist-drawer-overlay", true);
    });
    document.getElementById("close-wishlist-btn").addEventListener("click", () => toggleDrawer("wishlist-drawer-overlay", false));

    // Search Toggle
    document.getElementById("search-toggle-btn").addEventListener("click", () => {
        document.getElementById("search-overlay").classList.toggle("active");
    });
    document.getElementById("close-search-btn").addEventListener("click", () => {
        document.getElementById("search-overlay").classList.remove("active");
    });

    // Category Filter Click
    const catItems = document.querySelectorAll("#category-filters li");
    catItems.forEach(item => {
        item.addEventListener("click", (e) => {
            catItems.forEach(i => i.classList.remove("active"));
            e.target.classList.add("active");
            currentCategory = e.target.getAttribute("data-cat");
            renderProducts();
        });
    });

    // Price Filter Slider
    const priceRange = document.getElementById("price-range");
    if(priceRange) {
        priceRange.addEventListener("input", (e) => {
            maxPrice = parseInt(e.target.value);
            document.getElementById("price-val").innerText = `$${maxPrice}`;
            renderProducts();
        });
    }

    // Modal Close
    document.getElementById("close-modal-btn").addEventListener("click", () => {
        document.getElementById("product-modal-overlay").classList.remove("active");
    });

    // Coupon Apply
    document.getElementById("apply-coupon-btn").addEventListener("click", () => {
        const val = document.getElementById("coupon-input").value.trim().toUpperCase();
        if(val === "VELORA10") {
            appliedCoupon = "VELORA10";
            alert("Promo Code VELORA10 applied: 10% Off!");
            updateCartUI();
        } else {
            alert("Invalid Promo Code");
        }
    });
}

// Navigation Helper
function navigateTo(pageId) {
    document.querySelectorAll(".page-view").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));

    const targetPage = document.getElementById(`page-${pageId}`);
    if(targetPage) targetPage.classList.add("active");

    const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
    if(activeLink) activeLink.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function filterByCategory(category) {
    currentCategory = category;
    navigateTo("shop");
    renderProducts();
}

// Drawer Toggle Helper
function toggleDrawer(id, show) {
    const el = document.getElementById(id);
    if(show) el.classList.add("active");
    else el.classList.remove("active");
}

// Cart State Management
function addToCart(productId) {
    const existing = cart.find(item => item.id === productId);
    if(existing) {
        existing.qty += 1;
    } else {
        const p = PRODUCTS.find(prod => prod.id === productId);
        cart.push({ ...p, qty: 1 });
    }
    updateCartUI();
    toggleDrawer("cart-drawer-overlay", true);
}

function updateCartQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if(item) {
        item.qty += delta;
        if(item.qty <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById("cart-items-container");
    const cartBadge = document.getElementById("cart-badge");
    const cartCountText = document.getElementById("cart-item-count");

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.innerText = totalQty;
    cartCountText.innerText = totalQty;

    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (cart.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 40px 0; color: #777;">Your shopping bag is empty.</div>`;
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}"/>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="price">$${item.price}.00</p>
                    <div class="qty-controls">
                        <button class="btn btn-sm btn-outline" onclick="updateCartQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="btn btn-sm btn-outline" onclick="updateCartQty(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join("");
    }

    // Shipping Progress Bar ($250 Free Shipping threshold)
    const threshold = 250;
    const progressFill = document.getElementById("shipping-progress-bar");
    const progressText = document.getElementById("shipping-progress-text");

    if (subtotal >= threshold) {
        progressFill.style.width = "100%";
        progressText.innerHTML = "You have unlocked <strong>FREE EXPRESS SHIPPING!</strong>";
    } else {
        const diff = threshold - subtotal;
        const pct = (subtotal / threshold) * 100;
        progressFill.style.width = `${pct}%`;
        progressText.innerHTML = `Add $${diff.toFixed(2)} more to qualify for <strong>FREE EXPRESS SHIPPING</strong>`;
    }

    // Price Summary Calculations
    let discount = appliedCoupon === "VELORA10" ? subtotal * 0.1 : 0;
    let finalTotal = subtotal - discount;

    document.getElementById("cart-subtotal").innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById("cart-total").innerText = `$${finalTotal.toFixed(2)}`;

    if(discount > 0) {
        document.getElementById("discount-row").style.display = "flex";
        document.getElementById("cart-discount").innerText = `-$${discount.toFixed(2)}`;
    } else {
        document.getElementById("discount-row").style.display = "none";
    }
}

// Wishlist State Management
function toggleWishlist(productId) {
    if(wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
    } else {
        wishlist.push(productId);
    }
    document.getElementById("wishlist-badge").innerText = wishlist.length;
    renderProducts();
}

function renderWishlistDrawer() {
    const container = document.getElementById("wishlist-items-container");
    if(wishlist.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 40px 0; color: #777;">Your wishlist is empty.</div>`;
        return;
    }

    const items = PRODUCTS.filter(p => wishlist.includes(p.id));
    container.innerHTML = items.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}"/>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="price">$${item.price}.00</p>
                <button class="btn btn-sm btn-primary" onclick="addToCart(${item.id}); toggleWishlist(${item.id}); renderWishlistDrawer();" style="margin-top:8px;">
                    MOVE TO BAG
                </button>
            </div>
        </div>
    `).join("");
}

// Product Detail Modal
function openProductModal(productId) {
    const p = PRODUCTS.find(prod => prod.id === productId);
    const content = document.getElementById("modal-content");

    content.innerHTML = `
        <div class="modal-grid">
            <img src="${p.image}" alt="${p.name}" style="width:100%; border-radius:8px;" />
            <div>
                <span class="section-subtitle">${p.category}</span>
                <h2>${p.name}</h2>
                <p style="font-size:1.5rem; font-weight:600; margin: 12px 0;">$${p.price}.00</p>
                <p style="color: #555; margin-bottom: 24px;">${p.description}</p>
                <button class="btn btn-primary btn-block" onclick="addToCart(${p.id}); document.getElementById('product-modal-overlay').classList.remove('active');">
                    ADD TO BAG
                </button>
            </div>
        </div>
    `;

    document.getElementById("product-modal-overlay").classList.add("active");
}

// Contact Form Handler
function handleContactSubmit(e) {
    e.preventDefault();
    alert("Thank you for reaching out to Velora Concierge. A client advisor will respond within 24 hours.");
}

// Checkout Modal Simulation Flow
function startCheckout() {
    if(cart.length === 0) {
        alert("Your shopping bag is empty!");
        return;
    }
    toggleDrawer("cart-drawer-overlay", false);
    document.getElementById("checkout-modal-overlay").classList.add("active");
    renderCheckoutStep(1);
}

function closeCheckout() {
    document.getElementById("checkout-modal-overlay").classList.remove("active");
}

function renderCheckoutStep(step) {
    const container = document.getElementById("checkout-step-content");
    document.querySelectorAll(".checkout-steps .step").forEach((el, idx) => {
        if (idx + 1 === step) el.classList.add("active");
        else el.classList.remove("active");
    });

    if(step === 1) {
        container.innerHTML = `
            <h3>Shipping Details</h3>
            <div class="contact-form">
                <div class="form-row">
                    <div class="form-group"><label>First Name</label><input type="text" value="Saniya" /></div>
                    <div class="form-group"><label>Last Name</label><input type="text" value="Gandhi" /></div>
                </div>
                <div class="form-group"><label>Address</label><input type="text" value="123 Luxury Boulevard, Suite 400" /></div>
                <button class="btn btn-primary btn-block" onclick="renderCheckoutStep(2)">CONTINUE TO PAYMENT</button>
            </div>
        `;
    } else if(step === 2) {
        container.innerHTML = `
            <h3>Payment Method</h3>
            <div class="contact-form">
                <div class="form-group"><label>Card Number</label><input type="text" value="•••• •••• •••• 4242" /></div>
                <div class="form-row">
                    <div class="form-group"><label>Expiry</label><input type="text" value="12/28" /></div>
                    <div class="form-group"><label>CVC</label><input type="text" value="888" /></div>
                </div>
                <button class="btn btn-primary btn-block" onclick="renderCheckoutStep(3)">COMPLETE ORDER</button>
            </div>
        `;
    } else if(step === 3) {
        container.innerHTML = `
            <div style="text-align:center; padding: 20px 0;">
                <i data-lucide="check-circle" style="width:64px; height:64px; color: #8C6D46; margin-bottom: 16px;"></i>
                <h2>Thank You for Your Order</h2>
                <p style="color: #666; margin-top:8px;">Order #VEL-${Math.floor(100000 + Math.random() * 900000)} has been placed successfully.</p>
                <button class="btn btn-outline" style="margin-top:24px;" onclick="cart=[]; updateCartUI(); closeCheckout(); navigateTo('home');">RETURN TO HOME</button>
            </div>
        `;
        lucide.createIcons();
    }
}