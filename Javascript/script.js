
const search = document.querySelector('.headersearch');
const searchActive = document.querySelector('.search-active');
const noneDisplay = document.querySelector('.searce-display');

searchActive.onclick = () => {
    search.style.display = "inline-block"
}
noneDisplay.onclick = () => {
    search.style.display = "none"
}

const activeCart = document.querySelector('.active-cart');
const myCartActiveNone = document.querySelector('.my-cart-active-none');

activeCart.onclick = () => {
    document.querySelector('.cart-box').style.display = 'block';
}
myCartActiveNone.onclick = () => {
    document.querySelector('.cart-box').style.display = 'none';
}

// header bottom
const brasBtns = document.querySelector('.bras-btns');
const navBarDelate = document.querySelector('.nav-bar-delate');

brasBtns.onclick = () => {
    document.querySelector('.nav').style.display = 'inline-block';
}
navBarDelate.onclick = () => {
    document.querySelector('.nav').style.display = 'none';
}

// search
function searchItem() {
    const searchValue = document.querySelector('.search').value.toLowerCase();
    const productNames = document.querySelectorAll('.ptext p'); 
    let matchFound = false;

    productNames.forEach(item => {
        const itemName = item.innerText.toLowerCase(); 
        if (itemName.includes(searchValue)) {
            item.closest('.product-box').style.display = 'block'; 
            matchFound = true;
        } else {
            item.closest('.product-box').style.display = 'none'; 
        }
    });
}

// Attach search function to the button click
document.querySelector('.search-submit').addEventListener('click', searchItem);


// ----------------------------------------------
// Initialize the cart and totalPrice variables
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const addcart = document.querySelector('.allItem-cart');
let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;

const colors = ["#f8d7da", "#d4edda", "#d1ecf1", "#fef3cd", "#f5c6cb", "#c3e6cb", "#bee5eb", "#ffeeba"];


// Ensure totalPrice is a valid number
if (isNaN(totalPrice)) {
    totalPrice = 0;
}

// Load the cart items if available
createCartItem();


document.querySelectorAll('.cartbtns').forEach(button => {
    button.addEventListener('click', (e) => {
        const product = e.target.closest('.product-box');
        const img = product.querySelector('.productimg img').src; 
        const productName = product.querySelector('.pitem .ptext p').innerText;

        
        let priceText = product.querySelector('.price').innerText;
        priceText = priceText.replace(/[^0-9.]/g, ''); 
        const productPrice = parseFloat(priceText);

        if (isNaN(productPrice)) {
            console.error('Invalid price format:', priceText);
            return;
        }

        addProductToCart(img, productName, productPrice);
    });
});

// Function to Add Product to Cart
function addProductToCart(img, productName, productPrice) {
    const existingItemIndex = cart.findIndex(item => item.productName === productName);

    if (existingItemIndex > -1) {
        // Item already in the cart, increase quantity
        const existingItem = cart[existingItemIndex];
        existingItem.productQuantity += 1;
        existingItem.totalPrice = existingItem.productQuantity * existingItem.productPrice;
        totalPrice += existingItem.productPrice;
    } else {
        // New item, add to the cart
        cart.push({
            img, 
            productName, 
            productPrice,
            productQuantity: 1,
            totalPrice: productPrice
        });
        totalPrice += productPrice;
    }



    // Save cart and totalPrice to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalPrice', parseFloat(totalPrice).toFixed(2));

    createCartItem();
}

// Function to Display Cart Items
function updateQuantity(productName, change) {
    const itemIndex = cart.findIndex(item => item.productName === productName);

    if (itemIndex > -1) {
        const item = cart[itemIndex];
        item.productQuantity += change;

        
        if (item.productQuantity <= 0) {
            cart.splice(itemIndex, 1);
        } else {
            item.totalPrice = item.productQuantity * item.productPrice; 
        }

        
        totalPrice = cart.reduce((sum, item) => sum + (item.productPrice * item.productQuantity), 0);

        
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('totalPrice', parseFloat(totalPrice).toFixed(2));

        
        createCartItem();
    }
}

function createCartItem() {
    addcart.innerHTML = ''; 

    if (cart.length === 0) {
        addcart.innerHTML = '<h4>Your Cart is Empty</h4>';
        document.getElementById('total-price').innerText = "0.00"; 
        updateCartLengthDisplay();
        return;
    }

    cart.forEach((item, index) => {
        const createDiv = document.createElement('div');
        createDiv.classList.add('items-cart-product');

        // Set background color from the colors array based on index
        createDiv.style.backgroundColor = colors[index % colors.length];

        const quantity = item.productQuantity || 1;
        const productPrice = item.productPrice || 0;
        const itemTotalPrice = (quantity * productPrice).toFixed(2);

        createDiv.innerHTML = `
            <div class="items-cart-productto">
                <img src="${item.img}" alt="">
                <p>${item.productName}<br>
                    <span>${quantity} kg</span> X
                    <span>$ ${productPrice.toFixed(2)}</span><br>
                    <span>Total: $ ${itemTotalPrice}</span>
                </p>
            </div>
            <div class="delate-cart-product-items">
                <i class="fa-solid fa-plus plus"></i>
                <input type="number" id="quantity" name="quantity" min="1" value="${quantity}">
                <i class="fa-solid fa-minus minus"></i>
            </div>
        `;

        addcart.appendChild(createDiv);

        const plusButton = createDiv.querySelector('.plus');
        const minusButton = createDiv.querySelector('.minus');
        const quantityInput = createDiv.querySelector('#quantity');

        plusButton.addEventListener('click', () => updateQuantity(item.productName, 1));
        minusButton.addEventListener('click', () => updateQuantity(item.productName, -1));
        quantityInput.addEventListener('change', (e) => {
            const newQuantity = parseInt(e.target.value) || 1;
            updateQuantity(item.productName, newQuantity - quantity);
        });
    });
    updateCartLengthDisplay();
}


// Initialize totalPrice and cart on page load
totalPrice = totalPrice || 0;

function updateCartLengthDisplay() {
    const cartLength = cart.length;
    document.querySelector('.active-cart span').innerHTML = cartLength;
    document.querySelector('.my-cart h5 span').innerHTML = `(${cartLength})`;

    const checkoutButton = document.querySelector('.cart-chack-out');
    const myCartTitle = document.querySelector('.my-cart h5');
    const activeCartSpan = document.querySelector('.active-cart span');
    const shoppingCart = document.querySelector('.shopingcart');

    if (cartLength === 0) {
        checkoutButton.classList.remove('show');
        myCartTitle.classList.remove('show');
        activeCartSpan.classList.remove('show');
        shoppingCart.classList.remove('show');
    } else {
        checkoutButton.classList.add('show');
        myCartTitle.classList.add('show');
        activeCartSpan.classList.add('show');
        shoppingCart.classList.add('show');
    }

    const totalPriceElement = document.getElementById('total-price');
    const cartTotalPrice = document.querySelector('.cart-totle-price');
    totalPriceElement.innerText = totalPrice ? totalPrice.toFixed(2) : "0.00";
    cartTotalPrice.innerText = totalPrice ? totalPrice.toFixed(2) : "0.00";
}


localStorage.removeItem('cart');


