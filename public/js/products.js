import { Request } from "./requests.js";
import { UI } from "./ui.js";

const request = new Request();
const ui = new UI();
ui.closeNotification();

const saveButtons = document.querySelectorAll(".input_save_buttons");
const cancelBtns = document.querySelectorAll(".cancel.form-btn");
const priceInputs = document.querySelectorAll(".price_inputs");
const searchProductForm = document.querySelector("#search-product-form");
const addProductButton = document.querySelector("#add_product_btn");
const modalProductAdd = document.querySelector("#add_product");
const productTable = document.querySelector("#product-table tbody");

const addProductForm = document.querySelector("#add-product-form");



addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(addProductForm.brands.value)
  let data = {
    name: addProductForm.name.value,
    barcode: addProductForm.barcode.value,
    brand: addProductForm.brands.value,
    price: addProductForm.price.value,
  };

  
  request
    .postWithUrl("./products/addProduct", data)
    .then((response) => {
      ui.showNotification(response.success, response.message);

      console.log(response);
      addProductForm.classList.add("hidden");
    })
    .catch((err) => {
      ui.showNotification(err.success, err.message);
      console.log(err);
    });
});

priceInputs.forEach((input) => {
  input.addEventListener("input", () => {
    console.log("haho");
    input.nextElementSibling.classList.add("showed");
  });
});

saveButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const newPrice = button.previousElementSibling.value;

    let data = {
      servicePrice: newPrice,
    };
    request
      .postWithUrl(
        "./services/" +
          button.parentElement.dataset.servicesid +
          "/editService",
        data
      )
      .then((response) => {
        console.log(response);
        ui.showNotification(response.success, response.message);
        button.classList.remove("showed");
      })
      .catch((err) => ui.showNotification(false, err));
  });
});



searchProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = { barcode: searchProductForm.barcode.value };
  request
    .postWithUrl("./products/searchProduct", data)
    .then((response) => {
      console.log(response);
      let product = response.data;

      if (response.productFind) {
        productTable.innerHTML = `
        <tr data-productID="${product._id}" data-barcode="${product.barcodes[0].barcode}" >
  
              <td>
                  ${product.name}
              </td>
              
              <td>
                  <div class="inputs" data-productID="${product._id}">
                      <input type="number" class="price_inputs"
                          value="${product.price}">tl
                      <i class="ph ph-floppy-disk input_save_buttons"></i>
                  </div>
              </td>
              <td>
                  <div class="inputs" data-productID="${product._id}">
                      <input type="number" class="price_inputs"
                          value="${product.stock}">adet
                      <i class="ph ph-floppy-disk input_save_buttons"></i>
                  </div>
              </td>
               <td>
                  <span class="continue hoverable" id="update-product">Kaydet+</span>
              </td>
              
          </tr>
        `;
      } else {
        if (product !== null) {
          productTable.innerHTML = `
        <tr data-productID=" ${product._id}" data-barcode="${product.barcodes.barcode}" >
  
              <td>
                  ${product.name}
              </td>
              
              <td>
                  <div class="inputs" data-productID=" ${product._id}">
                      <input type="number" class="price_inputs"
                          value=" ${product.price}">tl
                      <i class="ph ph-floppy-disk input_save_buttons"></i>
                  </div>
              </td>
              <td>
                  <div class="inputs" data-productID=" ${product._id}">
                      <input type="number" class="price_inputs"
                          value=" ${product.stock}">adet
                      <i class="ph ph-floppy-disk input_save_buttons"></i>
                  </div>
              </td>
               <td>
                  <span class="continue hoverable" id="add-product">Ekle+</span>
              </td>
              
          </tr>
        `;
        
        } else {
          productTable.innerHTML = `
        ${response.message}
        `;
        }
      }

      addPassiveProductHandle();
      ui.showNotification(response.success, response.message);
    })
    .catch((err) => {
      ui.showNotification(err.success, err.message);
      console.log(err);
    });
});

function addPassiveProductHandle() {
  const addProductMiniBtn = document.querySelector("#add-product");
  addProductMiniBtn.addEventListener("click", (e) => {
    let data = {
      barcode: e.target.parentElement.parentElement.dataset.barcode,
      name: e.target.parentElement.parentElement.children[0].textContent.trim(),
      price:
        e.target.parentElement.parentElement.children[1].children[0].children[0]
          .value,
      stock:
        e.target.parentElement.parentElement.children[2].children[0].children[0]
          .value,
    };
    request
      .postWithUrl("./products/addPassiveProduct", data)
      .then((response) => {
        console.log(response);
        ui.showNotification(response.success, response.message);
        productTable.innerHTML=`ürün eklendi`
      });
  });
}

addProductButton.addEventListener("click", showModalAddServices);

cancelBtns.forEach((element) => {
  element.addEventListener("click", () => {
    ui.closeAllModals();
  });
});

function showModalAddServices() {
  modalProductAdd.classList.remove("hidden");
}
