function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);

  e.className = className;
  e.innerText = innerText;
  return e;
}

function trybeH1() {
  const titleDiv = createCustomElement('div', 'title_div', '');
  const trybeLogo = createCustomElement('img', 'logo', '');
  const h1 = createCustomElement('h1', '', 'TrybeStore');
  trybeLogo.src = 'https://avatars.githubusercontent.com/u/51808343?s=280&v=4';
  titleDiv.append(trybeLogo, h1);
  titleDiv.addEventListener('click', () => window.open('https://lojinhatrybe.com/'));

  return titleDiv;
}

function headerAdder() {
  const body = document.getElementsByTagName('body')[0];
  const container = document.querySelector('.container');
  const header = createCustomElement('header', '', '');
  const nav = createCustomElement('nav', '', '');
  const aCart = createCustomElement('a', 'cart_a', 'Carrinho');
  const aLogin = createCustomElement('a', 'login_a', 'Login');
  const spanCart = createCustomElement('span', 'fas fa-shopping-cart', '');
  const spanLogin = createCustomElement('span', 'fas fa-user', '');
  header.appendChild(nav);
  nav.append(aCart, aLogin);
  container.id = 'container';
  aCart.href = '#container';
  aLogin.addEventListener('click', () => window.open('https://lojinhatrybe.com/minha-conta/'));
  aCart.insertBefore(spanCart, aCart.firstChild);
  aLogin.insertBefore(spanLogin, aLogin.firstChild);
  body.insertBefore(header, body.firstChild);
  header.insertBefore(trybeH1(), header.firstChild);
}

if (typeof module !== 'undefined') {
  module.exports = headerAdder;
}
