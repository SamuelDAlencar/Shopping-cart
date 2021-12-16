// Global scope variables:
const itemList = document.querySelector('.items');
const cartSec = document.querySelector('.cart');
const cartItems = document.querySelector('.cart__items');
const emptyButton = document.querySelector('.empty-cart');
const totalPriceClass = '.total-price';
let currentPrice = 0;
// -------------------------------------------------

// General assist functions:
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);

  e.className = className;
  e.innerText = innerText;
  return e;
}

// -------------------------------------------------

// Main functions
function createProductImageElement(imageSource) {
  const img = createCustomElement('img', 'item__image', '');
  img.src = imageSource;
  return img;
}

function createProductItemElement({
  id: sku, title: name, thumbnail: image, price, permalink: link,
}) {
  const section = createCustomElement('section', 'item', '');
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createProductImageElement(image.replace('-I', '-W')))
    .addEventListener('click', ({ target }) => {
      if (target.className !== 'item__add') window.open(link);
    });
  section.appendChild(createCustomElement('span', 'item__title', name))
    .addEventListener('click', ({ target }) => {
      if (target.className !== 'item__add') window.open(link);
    });
  section.appendChild(createCustomElement('span', 'item__price-format', 'BRL'))
    .appendChild(createCustomElement('span', 'item__price', `R$ ${price}`));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.appendChild(createCustomElement('hr', 'hr_divisor', ''));

  return section;
}

function getSkuFromProductItem(item) { return item.querySelector('span.item__sku').innerText; }

function priceSaver(currentPriceInnerHtml, currentPriceNum) {
  localStorage.setItem('price', JSON.stringify(currentPriceInnerHtml));
  localStorage.setItem('priceNum', JSON.stringify(currentPriceNum));
}

function cartTagsItemClickListener({ target }) {
  target.parentNode.remove();
  saveCartItems(cartItems.innerHTML);
  const priceAfterClick = target.parentNode.innerText.split('$')[1];
  console.log(priceAfterClick);
  const totalPrice = document.querySelector(totalPriceClass);
  totalPrice.innerText = `${(currentPrice - priceAfterClick)
    .toLocaleString('pt-BR')
    .replace('.', '')
    .replace(',', '.')}`;
  currentPrice -= priceAfterClick;
  priceSaver(totalPrice.innerHTML, currentPrice);
}

function cartItemClickListener({ target }) {
  const totalPrice = document.querySelector(totalPriceClass);
  if (target.tagName === 'IMG'
    || target.tagName === 'I') { cartTagsItemClickListener({ target }); } else {
    target.remove();
    saveCartItems(cartItems.innerHTML);
    const priceAfterClick = target.innerText.split('$')[1];
    console.log(priceAfterClick);
    totalPrice.innerText = `${(currentPrice - priceAfterClick).toLocaleString('pt-BR')
      .replace('.', '')
      .replace(',', '.')}`;
    currentPrice -= priceAfterClick;
    priceSaver(totalPrice.innerHTML, currentPrice);
  }
  if (cartItems.children.length === 0) {
    totalPrice.innerText = '0';
    currentPrice = 0;
    localStorage.clear();
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice, thumbnail }) {
  const li = createCustomElement(
    'li', 'cart__item', `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`,
  );
  const newImage = thumbnail.replace('-I', '-W');
  li.addEventListener('click', cartItemClickListener);
  const img = createCustomElement('img', 'cart__item_img', '');
  img.src = newImage;
  const i = createCustomElement('i', 'fas fa-trash-alt', '');
  li.append(img, i);
  return li;
}

async function listCreator() {
  try {
    const span = createCustomElement('span', 'loading', 'carregando...');
    cartSec.appendChild(span);
    const result = await fetchProducts('computador');
    console.log(result);
    span.remove();
    result.results.forEach((product) => {
      itemList.appendChild(createProductItemElement(product));
    });
  } catch (err) {
    console.log(err);
  }
}

function totalPriceCreator() {
  const div = createCustomElement('div', 'totalPrice', '');
  const basePrice = 0;
  cartSec.appendChild(div);
  div.appendChild(createCustomElement('span', '', 'Total: '));
  div.appendChild(createCustomElement('span', '', 'R$ '));
  div.appendChild(createCustomElement('span', 'total-price', `${basePrice
    .toLocaleString('pt-BR')
    .replace('.', '')
    .replace(',', '.')}`));
}

function priceSum(price) {
  const totalPrice = document.querySelector(totalPriceClass);
  totalPrice.innerText = `${(currentPrice + price)
    .toLocaleString('pt-BR')
    .replace('.', '')
    .replace(',', '.')}`;
  currentPrice += price;
  priceSaver(totalPrice.innerHTML, currentPrice);
}

async function cartAdder() {
  try {
    const addButtons = document.querySelectorAll('.item__add');
    addButtons.forEach((button) => {
      button.addEventListener('click', async ({ target }) => {
        const id = await getSkuFromProductItem(target.parentNode);
        const item = await fetchItem(id);
        cartItems.appendChild(createCartItemElement(item));
        saveCartItems(cartItems.innerHTML);
        priceSum(item.price);
      });
    });
  } catch (err) {
    console.log(err);
  }
}

function cartCleanerButton() {
  const basePrice = 0;
  const totalPrice = document.querySelector(totalPriceClass);
  emptyButton.addEventListener('click', () => {
    if (currentPrice === 0) {
      window.alert('Seu carrinho está vazio, nada para remover');
    }
    cartItems.innerHTML = '';
    localStorage.clear();
    totalPrice.innerText = `${basePrice.toLocaleString('pt-BR')}`;
    currentPrice = 0;
  });
}

function closeCartButton() {
  const button = createCustomElement('button', 'close-cart', 'Fechar Pedido');
  cartSec.appendChild(button);
  button.addEventListener('click', () => {
    window.alert('Página de finalização da compra ainda em progresso!');
  });
}

// -------------------------------------------------

// LocalStorage functions:
function priceCatcher() {
  const totalPrice = document.querySelector(totalPriceClass);
  const price = localStorage.getItem('price');
  const priceNum = localStorage.getItem('priceNum');
  if (!price) {
    totalPrice.innerHTML = '0';
  } else {
    totalPrice.innerHTML = JSON.parse(price);
  }
  currentPrice = JSON.parse(priceNum);
}

function setSavedCartItems() {
  const storage = getSavedCartItems();
  cartItems.innerHTML = JSON.parse(storage);
  cartItems.childNodes.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
}
// -------------------------------------------------

window.onload = async () => {
  await listCreator();
  headerAdder();
  footerAdder();
  totalPriceCreator();
  closeCartButton();
  cartAdder();
  cartCleanerButton();
  setSavedCartItems();
  priceCatcher();
};
