import { Product } from "./Product";

const serverUrl = "http://localhost:5000/products";
const productList = document.getElementById('productList');
const btnFilterMobile = document.querySelector('.filtros-button__mobile');
const asideFilter = document.querySelector('aside');
const colorCheckboxes = document.querySelectorAll('.filtro-cores input[type="checkbox"]');
const sizeCheckboxes = document.querySelectorAll('.filtro-tamanhos input[type="checkbox"]');
const priceCheckboxes = document.querySelectorAll('.filtro-preco input[type="checkbox"]');

// Evento para revelar aside de filtro no mobile
btnFilterMobile.addEventListener("click", () => {
  if (window.innerWidth < 768) {
    if (asideFilter.classList.contains('hide')) {
      asideFilter.classList.remove('hide');
    } else {
      asideFilter.classList.add('hide');
    }
  }
});

// Eventos de alteração nos checkboxes dos filtros
colorCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', updateProductList);
});

sizeCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', updateProductList);
});

priceCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', updateProductList);
});

// Carregar produtos do servidor
function loadProducts(callback: (products: Product[]) => void) {
  const url: string = `${serverUrl}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Não foi possível obter os produtos da API');
      }
      return response.json();
    })
    .then((data) => {
      callback(data);
      console.log("Carregou!");
    })
    .catch((error) => {
      console.error('Ocorreu um erro ao obter os produtos:', error);
    });
}

function getSelectedValues(checkboxes: NodeListOf<Element>): string[] {
  const selectedValues: string[] = [];
  checkboxes.forEach((checkbox) => {
    if ((checkbox as HTMLInputElement).checked) {
      selectedValues.push(checkbox.getAttribute('id') || '');
    }
  });
  return selectedValues;
}

// Atualizar produtos após filtragem
function updateProductList() {
  const selectedColors = getSelectedValues(colorCheckboxes);
  const selectedSizes = getSelectedValues(sizeCheckboxes);
  const selectedPriceRanges = getSelectedValues(priceCheckboxes);

  loadProducts((products) => {
    if (productList) {
      productList.innerHTML = '';
      products.forEach((product: Product) => {
        const productDiv: HTMLElement = createProductElement(product);
        productList.appendChild(productDiv);
      });

      const filteredProducts = filterProducts(products, selectedColors, selectedSizes, selectedPriceRanges);
      productList.innerHTML = '';
      filteredProducts.forEach((product: Product) => {
        const productDiv: HTMLElement = createProductElement(product);
        productList.appendChild(productDiv);
      });
    }
  });
}

// Criar elemento HTML para produto
function createProductElement(product: Product): HTMLElement {
  const productDiv: HTMLElement = document.createElement('li');
  productDiv.innerHTML = `
    <img class="p-photo" src="${product.image}" alt="${product.name}" />
    <h4 class="p-name">${product.name}</h2>
    <div class="p-price"><p>R$ ${product.price}</p><p>até ${product.parcelamento.join('x de R$')}</p></div>
    <div class="color-size__wrap"><div class="p-color ${product.color}"></div><div class="p-size">${product.size.join(', ')}</div></div>
    <a href="#" class="p-buy">Comprar</a>
  `;
  return productDiv;
}

// Filtrar produtos com base nas seleções do usuário
function filterProducts(products: Product[], selectedColors: string[], selectedSizes: string[], selectedPriceRanges: string[]): Product[] {
  return products.filter((product) => {
    const hasColor = selectedColors.length === 0 || selectedColors.includes(product.color);
    const hasSize = selectedSizes.length === 0 || product.size.some((size) => selectedSizes.includes(size));
    const hasPriceRange = selectedPriceRanges.length === 0 || selectedPriceRanges.includes(getPriceRange(product.price));

    return hasColor && hasSize && hasPriceRange;
  });
}

// Faixa de preço com base no preço dos produtos
function getPriceRange(price: number): string {
  if (price >= 0 && price <= 50) return '0-50';
  if (price > 50 && price <= 150) return '51-150';
  if (price > 150 && price <= 300) return '151-300';
  if (price > 300 && price <= 500) return '301-500';
  if (price >= 500) return '500-more';
  return;
}

// Remover atributo 'open' de elementos <details>
function removeAttributeDetailsTag() {
  const detailsElements = document.querySelectorAll('details');

  function handleScreenSizeChange() {
    if (window.innerWidth < 768) {
      detailsElements.forEach((details) => {
        details.removeAttribute('open');
      });
    } else {
      detailsElements.forEach((details) => {
        details.setAttribute('open', '');
      });
    }
  }

  window.addEventListener('load', handleScreenSizeChange);
  window.addEventListener('resize', handleScreenSizeChange);
}

// Chamada para remover atributo 'open' de elementos <details>
document.addEventListener("DOMContentLoaded", removeAttributeDetailsTag);

// Chamada para atualizar lista de produtos na inicialização
document.addEventListener("DOMContentLoaded", updateProductList);
