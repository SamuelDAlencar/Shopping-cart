const fetchProducts = async (prodType) => {
  try {
    const api = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${prodType}`)

    console.log(api)
  } catch (err) {
    console.log(err)
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
