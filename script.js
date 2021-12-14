// Global scope variables:
const body = document.getElementsByTagName('body')[0];
const itemList = document.querySelector('.items');
const cartSec = document.querySelector('.cart');
const cartItems = document.querySelector('.cart__items');
const emptyButton = document.querySelector('.empty-cart');
const totalPriceClass = '.total-price';
let currentPrice = 0;
// -------------------------------------------------

function headerAdder() {
  const header = document.createElement('header');
  const h1 = document.createElement('h1');

  body.insertBefore(header, body.firstChild);
  header.className = 'header';
  header.appendChild(h1);
  h1.innerText = 'TrybeStore';
  h1.addEventListener('click', () => {
    window.open('https://lojinhatrybe.com/');
  });
}

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

function createProductItemElement({
  id: sku, title: name, thumbnail: image, price, permalink: link,
}) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name))
    .addEventListener('click', ({ target }) => {
      if (target.className !== 'item__add') window.open(link);
    });
  section.appendChild(createProductImageElement(image.replace('-I', '-W')))
    .addEventListener('click', ({ target }) => {
      if (target.className !== 'item__add') window.open(link);
    });
  section.appendChild(createCustomElement('span', 'item__price-format', 'BRL'))
    .appendChild(createCustomElement('span', 'item__price', `R$ ${price}`));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

function priceSaver(currentPriceInnerHtml, currentPriceNum) {
  localStorage.setItem('price', JSON.stringify(currentPriceInnerHtml));
  localStorage.setItem('priceNum', JSON.stringify(currentPriceNum));
}

function cartItemClickListenerIMG({ target }) {
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
  if (target.tagName === 'IMG') {
    cartItemClickListenerIMG({ target });
  } else {
    target.remove();
    saveCartItems(cartItems.innerHTML);
    const priceAfterClick = target.innerText.split('$')[1];
    console.log(priceAfterClick);
    totalPrice.innerText = `${(currentPrice - priceAfterClick)
      .toLocaleString('pt-BR')
      .replace('.', '')
      .replace(',', '.')}`;
    currentPrice -= priceAfterClick;
    priceSaver(totalPrice.innerHTML, currentPrice);
  }
  if (cartItems.children.length === 0) {
    totalPrice.innerText = '0';
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice, thumbnail }) {
  const li = document.createElement('li');
  const newImage = thumbnail.replace('-I', '-W');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const img = document.createElement('img');
  img.src = newImage;
  img.className = 'cart__item_img';
  li.appendChild(img);
  return li;
}

function closeCartButton() {
  const button = document.createElement('button');
  cartSec.appendChild(button);
  button.innerText = 'Fechar Pedido';
  button.className = 'close-cart';
  button.addEventListener('click', () => {
    window.alert('Página de finalização da compra ainda em progresso!');
  });
}

async function listCreator() {
  try {
    const span = document.createElement('span');
    span.innerText = 'carregando...';
    span.className = 'loading';
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

function spanCreator(text, classStrng) {
  const span = document.createElement('span');
  span.className = classStrng;
  span.innerText = text;

  return span;
}

function totalPriceCreator() {
  const div = document.createElement('div');
  const basePrice = 0;
  cartSec.appendChild(div);
  div.className = 'totalPrice';
  div.appendChild(spanCreator('Total: '));
  div.appendChild(spanCreator('R$ '));
  div.appendChild(spanCreator(`${basePrice
    .toLocaleString('pt-BR')
    .replace('.', '')
    .replace(',', '.')}}`, 'total-price'));
}

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

function cartCleaner() {
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

function setSavedCartItems() {
  const storage = getSavedCartItems();
  cartItems.innerHTML = JSON.parse(storage);
  cartItems.childNodes.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
}

function footerAdder() {
  const footer = document.createElement('footer');
  const p = document.createElement('p');
  body.appendChild(footer);
  footer.appendChild(p);
  p.innerText = 'Projeto feito consumindo a API disponibilizada pelo Mercado Livre 💚';
}

window.onload = async () => {
  await listCreator();
  headerAdder();
  footerAdder();
  totalPriceCreator();
  closeCartButton();
  cartAdder();
  cartCleaner();
  setSavedCartItems();
  priceCatcher();
  if (localStorage.getItem('price') === null) {
    currentPrice = 0;
  }
};
