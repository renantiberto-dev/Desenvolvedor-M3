import { Product } from "./Product";

const serverUrl = "http://localhost:5000/products";
const productList = document.getElementById('productList');
const loadMoreProducts = document.getElementById('load-more');
let currentPage = 1;
const productsPerPage = 6; // Defina o número de produtos por página

if(loadMoreProducts) {
  loadMoreProducts.addEventListener('click', () => {
    currentPage++;
    loadProducts(currentPage, productsPerPage);
  });
}

console.log(serverUrl.length);

function loadProducts(page: number, perPage: number) {
  const offset: number = (page - 1) * perPage;
  const url: string = `${serverUrl}?_page=${page}&_limit=${perPage}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Não foi possível obter os produtos da API');
      }
      return response.json();
    })
    .then(data => {
      data.forEach((product: Product) => {
        const productDiv: HTMLElement = document.createElement('li');
        productDiv.innerHTML = `
          <img class="p-photo" src="${product.image}" alt="${product.name}" />
          <h4 class="p-name">${product.name}</h2>
          <div class="p-price"><p>R$ ${product.price}</p><p>até ${product.parcelamento.join('x de R$')}</p></div>
          <div class="color-size__wrap"><div class="p-color ${product.color}"></div><div class="p-size">${product.size.join(', ')}</div></div>
          <a href="#" class="p-buy">Comprar</a>
        `;
        if (productList) productList.appendChild(productDiv);
      });
    })
    .catch(error => {
      console.error('Ocorreu um erro ao obter os produtos:', error);
    });
}

function main() {
  loadProducts(currentPage, productsPerPage);
}

document.addEventListener("DOMContentLoaded", main);
