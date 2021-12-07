// Global scope variables
const cartSec = document.querySelector('.cart');
const cart = document.querySelector('.cart__items');
const totalPriceClass = '.total-price';
let currentPrice = 0;

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const priceSaver = (currentPriceInnerHtml, currentPriceNum) => {
  localStorage.setItem('price', JSON.stringify(currentPriceInnerHtml));
  localStorage.setItem('priceNum', JSON.stringify(currentPriceNum));
};

function cartItemClickListener({ target }) {
  target.remove();
  saveCartItems(cart.innerHTML);
  const priceAfterClick = target.innerText.split('$')[1];
  const totalPrice = document.querySelector(totalPriceClass);
  totalPrice.innerText = `${(currentPrice - priceAfterClick)
    .toLocaleString('pt-BR')
    .replace('.', '')
    .replace(',', '.')}`;
  currentPrice -= priceAfterClick;
  priceSaver(totalPrice.innerHTML, currentPrice);
  console.log(priceAfterClick);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const listCreator = async () => {
  try {
    const result = await fetchProducts('computador');
    const parent = document.querySelector('.items');
    result.results.forEach((product) => {
      parent.appendChild(createProductItemElement(product));
    });
  } catch (err) {
    console.log(err);
  }
};

const totalPriceCreator = () => {
  const span = document.createElement('span');
  cartSec.appendChild(span);
  span.className = 'total-price';
  const basePrice = 0;
  span.innerText = `${basePrice
    .toLocaleString('pt-BR')
    .replace('.', '')
    .replace(',', '.')}}`;
};

const priceCatcher = () => {
  const totalPrice = document.querySelector(totalPriceClass);
  const price = localStorage.getItem('price');
  const priceNum = localStorage.getItem('priceNum');
  if (!price) {
    totalPrice.innerHTML = '0';
  } else {
    totalPrice.innerHTML = JSON.parse(price);
  }
  currentPrice = JSON.parse(priceNum);
};

const priceSum = (price) => {
  const totalPrice = document.querySelector(totalPriceClass);
  totalPrice.innerText = `${(currentPrice + price)
    .toLocaleString('pt-BR')
    .replace('.', '')
    .replace(',', '.')}`;
  currentPrice += price;
  priceSaver(totalPrice.innerHTML, currentPrice);
};

const cartAdder = async () => {
  const buttons = document.querySelectorAll('.item__add');

  try {
    buttons.forEach((button) => {
      button.addEventListener('click', async ({ target }) => {
        const id = await getSkuFromProductItem(target.parentNode);
        const item = await fetchItem(id);
        cart.appendChild(createCartItemElement(item));
        saveCartItems(cart.innerHTML);
        priceSum(item.price);
      });
    });
  } catch (err) {
    console.log(err);
  }
};

const cartCleaner = () => {
  const emptyButton = document.querySelector('.empty-cart');
  const cartItems = document.querySelector('.cart__items');
  const basePrice = 0;
  const totalPrice = document.querySelector(totalPriceClass);
  emptyButton.addEventListener('click', () => {
    cartItems.innerHTML = '';
    localStorage.clear();
    totalPrice.innerText = `${basePrice.toLocaleString('pt-BR')}`;
    currentPrice = 0;
  });
};

const setSavedCartItems = () => {
  const storage = getSavedCartItems();
  cart.innerHTML = JSON.parse(storage);
  cart.childNodes.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
};

window.onload = async () => {
  await listCreator();
  totalPriceCreator();
  cartAdder();
  cartCleaner();
  setSavedCartItems();
  priceCatcher();
};
