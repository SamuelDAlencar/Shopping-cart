const fetchProducts = async (prodType) => {
  try {
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${prodType}`);
    const data = await response.json();

    return data;
  } catch (err) {
    return new Error('You must provide an url');
  }
};

console.log(fetchProducts('computador'));

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
