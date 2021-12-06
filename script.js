// Constante 'cart' para uso geral no escopo global
const cart = document.querySelector('.cart__items');

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

function cartItemClickListener({ target }) {
  target.remove();
  saveCartItems(cart.innerHTML);
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

const cartAdder = () => {
  const buttons = document.querySelectorAll('.item__add');

  buttons.forEach((button) => {
    button.addEventListener('click', async ({ target }) => {
      const id = getSkuFromProductItem(target.parentNode);
      const item = await fetchItem(id);
      cart.appendChild(createCartItemElement(item));
      saveCartItems(cart.innerHTML);
    });
  });
};

const cartCleaner = () => {
  const button = document.querySelector('.empty-cart');
  const cartItems = document.querySelector('.cart__items');
  button.addEventListener('click', () => {
    cartItems.innerHTML = '';
    localStorage.clear();
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
  cartAdder();
  cartCleaner();
  setSavedCartItems();
};
