const saveCartItems = (currentInnerHtml) => {
  localStorage.setItem('cartItems', JSON.stringify(currentInnerHtml));
};

if (typeof module !== 'undefined') {
  module.exports = saveCartItems;
}
