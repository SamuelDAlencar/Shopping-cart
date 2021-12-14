// Global scope variables -
const body = document.getElementsByTagName('body')[0];
const cartSec = document.querySelector('.cart');
const cart = document.querySelector('.cart__items');
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

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__price-format', 'US'))
    .appendChild(createCustomElement('span', 'item__price', `${price} $`));
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

const cartItemClickListenerIMG = ({ target }) => {
  target.parentNode.remove();
  saveCartItems(cart.innerHTML);
  const priceAfterClick = target.parentNode.innerText.split('$')[1];
  console.log(priceAfterClick);
  const totalPrice = document.querySelector(totalPriceClass);
  totalPrice.innerText = `${(currentPrice - priceAfterClick)
    .toLocaleString('pt-BR')
    .replace('.', '')
    .replace(',', '.')}`;
  currentPrice -= priceAfterClick;
  priceSaver(totalPrice.innerHTML, currentPrice);
};

function cartItemClickListener({ target }) {
  if (target.tagName === 'IMG') {
    cartItemClickListenerIMG({ target });
  } else {
    target.remove();
    saveCartItems(cart.innerHTML);
    const priceAfterClick = target.innerText.split('$')[1];
    console.log(priceAfterClick);
    const totalPrice = document.querySelector(totalPriceClass);
    totalPrice.innerText = `${(currentPrice - priceAfterClick)
      .toLocaleString('pt-BR')
      .replace('.', '')
      .replace(',', '.')}`;
    currentPrice -= priceAfterClick;
    priceSaver(totalPrice.innerHTML, currentPrice);
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice, thumbnail }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const img = document.createElement('img');
  img.src = thumbnail;
  img.className = 'cart__item_img';
  li.appendChild(img);
  return li;
}

const closeCartButton = () => {
  const button = document.createElement('button');
  cartSec.appendChild(button);
  button.innerText = 'Fechar Pedido';
  button.className = 'close-cart';
  button.addEventListener('click', () => {
    window.alert('Página de finalização da compra ainda em progresso !');
  });
};

const listCreator = async () => {
  try {
    const spanCreator = document.createElement('span');
    spanCreator.innerText = 'carregando...';
    spanCreator.className = 'loading';
    cartSec.appendChild(spanCreator);
    const result = await fetchProducts('computador');
    spanCreator.remove();
    const parent = document.querySelector('.items');
    result.results.forEach((product) => {
      parent.appendChild(createProductItemElement(product));
    });
  } catch (err) {
    console.log(err);
  }
};

const totalPriceCreator = () => {
  const div = document.createElement('div');
  const span1 = document.createElement('span');
  const span2 = document.createElement('span');
  const span3 = document.createElement('span');
  cartSec.appendChild(div);
  div.appendChild(span2);
  div.appendChild(span1);
  div.appendChild(span3);
  div.className = 'totalPrice';
  span3.innerText = ' $';
  span2.innerText = 'Total: ';
  span1.className = 'total-price';
  const basePrice = 0;
  span1.innerText = `${basePrice
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
    if (currentPrice === 0) {
      window.alert('Seu carrinho está vazio, nada para remover');
    }
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
