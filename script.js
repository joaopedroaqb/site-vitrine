const cartButton = document.getElementById("cart-button");
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsEl = document.getElementById("cart-items");
const totalPriceEl = document.getElementById("total-price");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout-btn");
const cartCountEl = document.getElementById("cart-count");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = count;
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function calculateTotalPrice() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function displayCartItems() {
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML = "<li>Seu carrinho está vazio.</li>";
    totalPriceEl.textContent = "Total: R$ 0,00";
    return;
  }

  cart.forEach((item, index) => {
    const li = document.createElement("li");

    const itemInfo = document.createElement("div");
    itemInfo.classList.add("item-info");

    const img = document.createElement("img");
    img.src = item.img;
    img.alt = item.name;

    const nameSpan = document.createElement("span");
    nameSpan.classList.add("item-name");
    nameSpan.textContent = item.name;

    itemInfo.appendChild(img);
    itemInfo.appendChild(nameSpan);

    const qtyDiv = document.createElement("div");
    qtyDiv.classList.add("item-qty");

    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.min = 1;
    qtyInput.value = item.quantity;
    qtyInput.addEventListener("change", (e) => {
      const val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) {
        e.target.value = item.quantity;
        return;
      }
      cart[index].quantity = val;
      saveCart();
      displayCartItems();
    });

    qtyDiv.appendChild(qtyInput);

    const priceSpan = document.createElement("span");
    priceSpan.textContent = `R$ ${(item.price * item.quantity).toFixed(2)}`;

    li.appendChild(itemInfo);
    li.appendChild(qtyDiv);
    li.appendChild(priceSpan);

    cartItemsEl.appendChild(li);
  });

  totalPriceEl.textContent = `Total: R$ ${calculateTotalPrice().toFixed(2)}`;
}

function clearCart() {
  cart = [];
  saveCart();
  displayCartItems();
}

function addToCart(name, price, img) {
  const idx = cart.findIndex(item => item.name === name);
  if (idx !== -1) {
    cart[idx].quantity++;
  } else {
    cart.push({ name, price, img, quantity: 1 });
  }
  saveCart();
  alert(`Você adicionou ${name} ao carrinho!`);
  displayCartItems();
}

function toggleCart() {
  cartModal.classList.toggle("hidden");

  if (cartModal.classList.contains("hidden")) {
    cartButton.classList.remove("hidden");
  } else {
    cartButton.classList.add("hidden");
  }
}

cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    toggleCart();
  }
});

document.getElementById("cart-content").addEventListener("click", (e) => {
  e.stopPropagation();
});

cartButton.addEventListener("click", toggleCart);
closeCartBtn.addEventListener("click", toggleCart);
clearCartBtn.addEventListener("click", clearCart);
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }
  alert(`Compra efetuada com sucesso!\nTotal: R$ ${calculateTotalPrice().toFixed(2)}`);
  cart = [];
  saveCart();
  displayCartItems();
  toggleCart();
});

document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", e => {
    const product = e.target.closest(".product");
    const name = product.dataset.name;
    const price = parseFloat(product.dataset.price);
    const img = product.dataset.img;
    addToCart(name, price, img);
  });
});

window.onload = () => {
  cartModal.classList.add("hidden");
  cartButton.classList.remove("hidden"); 
  updateCartCount();
  displayCartItems();
};
