function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);

  e.className = className;
  e.innerText = innerText;
  return e;
}

function footerAdder() {
  const body = document.getElementsByTagName('body')[0];
  const footer = createCustomElement('footer', '', '');
  const pText = 'Projeto feito consumindo a API disponibilizada pelo Mercado Livre 💚';
  const p = createCustomElement('p', '', pText);
  body.appendChild(footer);
  footer.appendChild(p);
}

if (typeof module !== 'undefined') {
  module.exports = footerAdder;
}
