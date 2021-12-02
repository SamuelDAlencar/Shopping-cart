require('../mocks/fetchSimulator');
const { fetchProducts } = require('../helpers/fetchProducts');
const computadorSearch = require('../mocks/search');

describe('1 - Teste a função fecthProducts', () => {
  test('Testa se fetchProducts é uma função', () => {
    expect(typeof fetchProducts).toBe('function')
  })

  test('Executa a função fetchProducts com o argumento "computador" e testa se fetch foi chamada', () => {
    fetchProducts('computador')
    expect(fetch).toHaveBeenCalled();
  })

  test('Testa se, ao chamar a função fetchProducts com o argumento "computador", a função fetch utiliza o endpoint "https://api.mercadolibre.com/sites/MLB/search?q=computador"', () => {
    fetchProducts('computador')
    expect(fetch).toHaveBeenCalledWith(`https://api.mercadolibre.com/sites/MLB/search?q=computador`);
  })

  test('Testa se o retorno da função fetchProducts com o argumento "computador" é uma estrutura de dados igual ao objeto computadorSearch, que já está importado no arquivo', async () => {
    const testFunc = await fetchProducts('computador');
    expect(testFunc).toEqual(computadorSearch);
  })

  test('Teste se, ao chamar a função fetchProducts sem argumento, retorna um erro com a mensagem: You must provide an url. Dica: Lembre-se de usar o new Error("mensagem esperada aqui") para comparar com o objeto retornado da API', async () => {
    // const testFunc = await fetchProducts();
    const error = new Error('You must provide an url');
    expect(await fetchProducts()).toEqual(error);
  })
});
