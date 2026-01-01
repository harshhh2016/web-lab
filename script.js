/* =====================================================
   GLOBAL CART UTILITIES
   ===================================================== */

// Get cart from localStorage
function updateQty(id, change) {
  let cart = getCart();

  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += change;

  // Remove item if quantity becomes 0
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  loadCart();
}
function clearCart() {
  localStorage.setItem("cart", JSON.stringify([]));
  updateCartCount();
  alert("Thank you! Your order has been placed.");
  window.location.href = "index.html";
}


function removeItem(id) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  loadCart();
}

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart icon count
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartCountEl = document.getElementById("cartCount");
    if (cartCountEl) {
        cartCountEl.innerText = count;
    }
}

// Ensure cart starts empty on first load
if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify([]));
}


/* =====================================================
   SEARCH FUNCTIONALITY (PRODUCTS PAGE)
   ===================================================== */

function searchProducts(query) {
    query = query.toLowerCase();
    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {
        const text = product.innerText.toLowerCase();
        product.style.display = text.includes(query) ? "block" : "none";
    });
}


/* =====================================================
   ADD TO CART + SHOW QUANTITY CONTROLS
   ===================================================== */

function addProduct(button, name, price, image) {
    let cart = getCart();

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
  id: Date.now(),        // ✅ REQUIRED
  name: name,
  price: price,
  qty: 1,
  image: image
});

    }

    saveCart(cart);
    updateCartCount();

    // Hide "Add to Cart" button
    button.style.display = "none";

    // Show quantity controls
    const qtyControls = button.nextElementSibling;
    if (qtyControls) {
        qtyControls.style.display = "flex";
        qtyControls.querySelector("span").innerText = "1";
    }
}


/* =====================================================
   CHANGE QUANTITY (+ / −)
   ===================================================== */

function changeQty(btn, delta, name, price) {
    let cart = getCart();
    const item = cart.find(p => p.name === name);
    if (!item) return;

    item.qty += delta;

    // Prevent quantity < 1
    if (item.qty < 1) {
        item.qty = 1;
    }

    saveCart(cart);
    updateCartCount();

    // Update UI number
    const qtySpan = btn.parentElement.querySelector("span");
    qtySpan.innerText = item.qty;
}


/* =====================================================
   LOAD CART (CART PAGE)
   ===================================================== */

function loadCart() {
  const cart = getCart();

  const cartItemsDiv = document.getElementById("cartItems");
  const totalSpan = document.getElementById("total");
  const emptyMsg = document.getElementById("emptyCartMessage");
  const cartContent = document.getElementById("cartContent");

  if (!cartItemsDiv) return;

  cartItemsDiv.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    emptyMsg.style.display = "block";
    cartContent.style.display = "none";
    totalSpan.innerText = "0";
    return;
  }

  emptyMsg.style.display = "none";
  cartContent.style.display = "block";

  cart.forEach(item => {
    if (!item.qty || isNaN(item.qty)) item.qty = 1;

    const subtotal = item.price * item.qty;
    total += subtotal;

    cartItemsDiv.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" class="cart-img">

        <div class="cart-details">
          <h4>${item.name}</h4>
          <p>Price: ₹${item.price}</p>

          <div class="qty-controls">
            <button onclick="updateQty(${item.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="updateQty(${item.id}, 1)">+</button>
          </div>
        </div>

        <div class="cart-right">
          <p class="cart-subtotal">₹${subtotal}</p>
          <button class="remove-btn" onclick="removeItem(${item.id})">✕</button>
        </div>
      </div>
    `;
  });

  totalSpan.innerText = total;
}


/* =====================================================
   FEEDBACK FORM STORAGE
   ===================================================== */

function saveFeedback(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const feedback = {
        name,
        email,
        message,
        time: new Date().toLocaleString()
    };

    // Save to LocalStorage
    let feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
    feedbackList.push(feedback);
    localStorage.setItem("feedbackList", JSON.stringify(feedbackList));

    // ---- AUTO DOWNLOAD AS NOTEPAD FILE ----
    let textContent = "HeartStrings - Customer Feedback\n\n";

    feedbackList.forEach((fb, index) => {
        textContent += `Feedback ${index + 1}\n`;
        textContent += `Name: ${fb.name}\n`;
        textContent += `Email: ${fb.email}\n`;
        textContent += `Message: ${fb.message}\n`;
        textContent += `Time: ${fb.time}\n`;
        textContent += "-----------------------------\n\n";
    });

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "feedback.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    // Reset form
    event.target.reset();

    alert("Thank you! Your feedback has been saved.");
}


/* =====================================================
   INITIAL LOAD
   ===================================================== */

window.addEventListener("load", () => {
    updateCartCount();
});
function downloadFeedback() {
    const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];

    if (feedbackList.length === 0) {
        alert("No feedback available to download.");
        return;
    }

    let textContent = "HeartStrings - Customer Feedback\n\n";

    feedbackList.forEach((fb, index) => {
        textContent += `Feedback ${index + 1}\n`;
        textContent += `Name: ${fb.name}\n`;
        textContent += `Email: ${fb.email}\n`;
        textContent += `Message: ${fb.message}\n`;
        textContent += `Time: ${fb.time}\n`;
        textContent += `-----------------------------\n\n`;
    });

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "feedback.txt";
    a.click();

    URL.revokeObjectURL(url);
}
function downloadFeedback() {
    const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];

    if (feedbackList.length === 0) {
        alert("No feedback available to download.");
        return;
    }

    let textContent = "HeartStrings - Customer Feedback\n\n";

    feedbackList.forEach((fb, index) => {
        textContent += `Feedback ${index + 1}\n`;
        textContent += `Name: ${fb.name}\n`;
        textContent += `Email: ${fb.email}\n`;
        textContent += `Message: ${fb.message}\n`;
        textContent += `Time: ${fb.time}\n`;
        textContent += `-----------------------------\n\n`;
    });

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "feedback.txt";
    a.click();

    URL.revokeObjectURL(url);
}
let currentImages = [];
let currentIndex = 0;

function openModal(images, index = 0){
  currentImages = images;
  currentIndex = index;

  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");

  modal.style.display = "flex";
  modalImg.src = currentImages[currentIndex];
}

function closeModal(){
  document.getElementById("imageModal").style.display = "none";
}

function nextImage(){
  currentIndex = (currentIndex + 1) % currentImages.length;
  document.getElementById("modalImage").src = currentImages[currentIndex];
}

function prevImage(){
  currentIndex =
    (currentIndex - 1 + currentImages.length) % currentImages.length;
  document.getElementById("modalImage").src = currentImages[currentIndex];
}
function handleSearch(event, query) {
  if (event.key === "Enter" && query.trim() !== "") {
    window.location.href =
      "products.html?search=" + encodeURIComponent(query);
  }
}
window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get("search");

  if (searchQuery && document.querySelector(".products")) {
    searchProducts(searchQuery);
  }
});


