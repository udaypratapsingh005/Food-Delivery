// ==========================
// SWIPER
// ==========================
var swiper = new Swiper(".mySwiper", {
  loop: true,
  navigation: {
    nextEl: "#next",
    prevEl: "#prev",
  },
});

// ==========================
// EXISTING ELEMENTS
// ==========================
const cartIcon = document.querySelector(".cart-icon");
const cartTab = document.querySelector(".cart-tab");
const closeBtn = document.querySelector(".close-btn");
const cardList = document.querySelector(".card-list");
const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");
const cartValue = document.querySelector(".cart-value");
const humburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const bars = document.querySelector(".fa-bars");

// ==========================
// NAV / CART EVENTS
// ==========================
cartIcon.addEventListener("click", () => {
  cartTab.classList.add("cart-tab-active");
});

closeBtn.addEventListener("click", () => {
  cartTab.classList.remove("cart-tab-active");
});

humburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("mobile-menu-active");
  bars.classList.toggle("fa-xmark");
});

// ==========================
// PRODUCT + CART
// ==========================
let productList = [];
let cartProduct = [];

// ==========================
// UPDATE TOTAL
// ==========================
function updateTotal() {
  let totalPrice = 0;
  let totalQuantity = 0;

  document.querySelectorAll(".item").forEach((item) => {
    const quantity = parseInt(
      item.querySelector(".quantity-value").textContent
    );

    const price = parseFloat(
      item.querySelector(".item-total").textContent.replace("₹", "")
    );

    totalPrice += price;
    totalQuantity += quantity;
  });

  cartTotal.textContent = `₹${totalPrice.toFixed(2)}`;
  cartValue.textContent = totalQuantity;
}

// ==========================
// SHOW PRODUCTS
// ==========================
function showCards() {
  productList.forEach((product) => {
    const orderCard = document.createElement("div");

    orderCard.classList.add("order-card");

    orderCard.innerHTML = `
      <div class="card-image">
        <img src="${product.image}">
      </div>

      <h4>${product.name}</h4>
      <h4 class="price">${product.price}</h4>

      <a href="#" class="btn card-btn">Add to Cart</a>
    `;

    cardList.appendChild(orderCard);

    const cardBtn = orderCard.querySelector(".card-btn");

    cardBtn.addEventListener("click", (e) => {
      e.preventDefault();
      addToCart(product);
    });
  });
}

// ==========================
// ADD TO CART
// ==========================
function addToCart(product) {
  const existingProduct = cartProduct.find(
    (item) => item.id === product.id
  );

  if (existingProduct) {
    alert("Item already in your cart");
    return;
  }

  cartProduct.push(product);

  let quantity = 1;
  let price = parseFloat(product.price.replace("₹", ""));

  const cartItem = document.createElement("div");
  cartItem.classList.add("item");

  cartItem.innerHTML = `
    <div class="item-image">
      <img src="${product.image}">
    </div>

    <div class="detail">
      <h4>${product.name}</h4>
      <h4 class="item-total">${product.price}</h4>
    </div>

    <div class="flex">
      <a href="#" class="quantity-btn minus">
        <i class="fa-solid fa-minus"></i>
      </a>

      <h4 class="quantity-value">${quantity}</h4>

      <a href="#" class="quantity-btn plus">
        <i class="fa-solid fa-plus"></i>
      </a>
    </div>
  `;

  cartList.appendChild(cartItem);
  updateTotal();

  const plusBtn = cartItem.querySelector(".plus");
  const minusBtn = cartItem.querySelector(".minus");
  const quantityValue = cartItem.querySelector(".quantity-value");
  const itemTotal = cartItem.querySelector(".item-total");

  plusBtn.addEventListener("click", (e) => {
    e.preventDefault();

    quantity++;
    quantityValue.textContent = quantity;
    itemTotal.textContent = `₹${(price * quantity).toFixed(2)}`;

    updateTotal();
  });

  minusBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (quantity > 1) {
      quantity--;

      quantityValue.textContent = quantity;
      itemTotal.textContent = `₹${(price * quantity).toFixed(2)}`;

      updateTotal();
    } else {
      cartItem.remove();

      cartProduct = cartProduct.filter(
        (item) => item.id !== product.id
      );

      updateTotal();
    }
  });
}

// ==========================
// FETCH PRODUCTS.JSON
// ==========================
function initApp() {
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      productList = data;
      showCards();
    });
}

initApp();

// ==========================
// LOGIN / SIGNUP POPUP
// ==========================
function openAuthPopup() {
  document.getElementById("authOverlay").style.display = "flex";
  showLogin();
}

function closeAuthPopup() {
  document.getElementById("authOverlay").style.display = "none";
}

function showSignup() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("signupBox").style.display = "block";
}

function showLogin() {
  document.getElementById("loginBox").style.display = "block";
  document.getElementById("signupBox").style.display = "none";
}

// ==========================
// SIGNUP
// ==========================
function signupUser() {
  const user = {
    name: document.getElementById("signupName").value,
    email: document.getElementById("signupEmail").value,
    password: document.getElementById("signupPassword").value,
  };

  if (!user.name || !user.email || !user.password) {
    alert("Please fill all fields");
    return;
  }

  localStorage.setItem("khaoUser", JSON.stringify(user));

  alert("Signup Successful");
  showLogin();
}

// ==========================
// LOGIN
// ==========================
function loginUser() {
  const savedUser = JSON.parse(
    localStorage.getItem("khaoUser")
  );

  const email = document.getElementById("loginEmail").value;
  const password =
    document.getElementById("loginPassword").value;

  if (
    savedUser &&
    savedUser.email === email &&
    savedUser.password === password
  ) {
    localStorage.setItem("isLoggedIn", "true");

    updateAuthButtons(savedUser.name);

    alert("Login Successful");
    closeAuthPopup();
  } else {
    alert("Wrong Email or Password");
  }
}

// ==========================
// LOGOUT
// ==========================
function logoutUser() {
  localStorage.removeItem("isLoggedIn");
  location.reload();
}

// ==========================
// UPDATE NAVBAR BUTTONS
// ==========================
function updateAuthButtons(name) {
  document.querySelectorAll(".auth-btn").forEach((btn) => {
    btn.innerHTML = `Hi, ${name}`;
    btn.onclick = function () {
      logoutUser();
      return false;
    };
  });
}

// ==========================
// PAGE LOAD CHECK
// ==========================
window.addEventListener("load", () => {
  const savedUser = JSON.parse(
    localStorage.getItem("khaoUser")
  );

  const loggedIn = localStorage.getItem("isLoggedIn");

  if (savedUser && loggedIn) {
    updateAuthButtons(savedUser.name);
  }
});