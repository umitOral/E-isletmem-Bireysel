
import { Request } from "./requests.js";
import { UI } from "./ui.js";

const request = new Request();
const ui = new UI();
ui.closeNotification();

const saveButtons = document.querySelectorAll(".input_save_buttons");
const cancelBtns = document.querySelectorAll(".cancel.form-btn");
const priceInputs = document.querySelectorAll(".price_inputs");
const searchProductForm = document.querySelector("#search-product-form");
const productListForm = document.querySelector("#product-list-form");
const addProductButton = document.querySelector("#add_product_btn");
const modalProductAdd = document.querySelector("#add_product");
const modalProductEdit = document.querySelector("#edit_product");
const modalAddStock = document.querySelector("#add_stock");
const modalFixStock = document.querySelector("#fix_stock");
const modalupdateComission = document.querySelector("#update_comission");
const productTable = document.querySelector("#product-table tbody");

const editProductForm = document.querySelector("#edit-product-form");
const addProductForm = document.querySelector("#add-product-form");
const addStockForm = document.querySelector("#add-stock-form");
const fixStockForm = document.querySelector("#fix-stock-form");
const formUpdateComission = document.querySelector("#update_comission_form");
const modalShowStock = document.querySelector("#show-stocks-modal");
const formShowStock = document.querySelector("#show-stocks-form");

let productId;
let selectedRow;
let selectedProduct;

addStockForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let data = new FormData(addStockForm);

  request
    .postWithUrlformData("./products/" + productId + "/addStock", data)
    .then((response) => {
      ui.showNotification(response.success, response.message);
      if (response.success === true) {
        selectedProduct=response.data
        modalAddStock.classList.add("hidden");
        addStockForm.reset();
        datasToUI(selectedRow, response.data);
      }
    })
    .catch((err) => {
      ui.showNotification(err.message, err.message);
      console.log(err);
    });
});

formUpdateComission.addEventListener("submit", (e) => {
  e.preventDefault();

  let data = {
    comission: formUpdateComission.comission.value,
  };
  request
    .postWithUrl("./products/" + productId + "/updateComission", data)
    .then((response) => {
      console.log(response);
      ui.showNotification(response.success, response.message);
      if (response.success === true) {
        modalupdateComission.classList.add("hidden");
        formUpdateComission.reset();
        selectedProduct.baseComission=response.data
      }
    })
    .catch((err) => {
      ui.showNotification(err.message, err.message);
      console.log(err);
    });
});
fixStockForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let data = {
    quantity: fixStockForm.quantity.value,
    unitCost: 0,
  };
  request
    .postWithUrl("./products/" + productId + "/fixStock", data)
    .then((response) => {
      console.log(response);
      ui.showNotification(response.success, response.message);
      if (response.success === true) {
        modalFixStock.classList.add("hidden");
        fixStockForm.reset();
        datasToUI(selectedRow, response.data);
      }
    })
    .catch((err) => {
      ui.showNotification(err.message, err.message);
      console.log(err);
    });
});

addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(addProductForm.brands.value);
  let data = {
    name: addProductForm.name.value,
    barcode: addProductForm.barcode.value,
    brand: addProductForm.brands.value,
    price: addProductForm.price.value,
    stocks: {
      quantity: addProductForm.quantity.value,
      unitCost: addProductForm.unitCost.value,
    },
  };

  request
    .postWithUrl("./products/addProduct", data)
    .then((response) => {
      ui.showNotification(response.success, response.message);
      if (response.success === true) {
        modalProductAdd.classList.add("hidden");
        addProductForm.reset();
      }
    })
    .catch((err) => {
      console.log(err);
      ui.showNotification(err.message, err.message);
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
      e.target.reset();
      console.log(response);
      let product = response.data;
      selectedProduct = response.data;
      if (response.productFind) {
        productId = product._id;

        datasToUI(productTable, response.data);
      } else {
        if (product !== null) {
          productTable.innerHTML = `
        <tr data-productID=" ${product._id}" data-barcode="${
            product.barcodes[0].barcode
          }" >
  
              <td>
                  ${product.barcodes[0].barcode}
              </td>
              <td>
                  ${product.brand || "-"}
              </td>
              <td>
                  ${product.name}
              </td>
              
              <td>
                  <div class="inputs" >
                      <input type="number" class="price_inputs">tl
                      <i class="ph ph-floppy-disk input_save_buttons"></i>
                  </div>
              </td>
              <td>
                  <div class="inputs">
                      <input type="number" name="unitCost" class="price_inputs"
                          >tl
                      <i class="ph ph-floppy-disk input_save_buttons"></i>
                  </div>
              </td>
              <td>
                  <div class="inputs" name="quantity">
                      <input type="number" class="price_inputs"
                          value="">adet
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
        addPassiveProductHandle();
      }

      ui.showNotification(response.success, response.message);
    })
    .catch((err) => {
      ui.showNotification(err.success, err.message);
      console.log(err);
    });
});

// productListForm.addEventListener("submit", (e) => {
//   e.preventDefault();
//   let data = { productName: productListForm.productName.value };
//   request
//     .postWithUrl("./products/searchProductName", data)
//     .then((response) => {
//       e.target.reset();
//       console.log(response);
//       let product = response.data;

//       if (response.productFind) {
//         productId = product._id;
//         productTable.innerHTML=``
//         response.data.forEach(product => {
//           productTable.innerHTML = `
//           <tr data-productID="${product._id}" data-barcode="${
//             product.barcodes[0]
//           }" >

//              <td>
//                  ${product.barcodes}
//              </td>
//              <td>
//                  ${product.brand || "-"}
//              </td>
//              <td>
//                  ${product.name}
//              </td>

//              <td>

//                  <span>${product.price || "-"}</span> tl

//              </td>
//              <td>

//                  ${product.stocks[product.stocks.length - 1].unitCost || "-"}tl

//              </td>
//              <td>

//                 ${product.totalStock}

//              </td>
//               <td>
//                   <select name="" class="product-edit-select">
//                  <option selected disable hidden>Seçenekler</option>
//                  <option value="edit-product">Bilgileri Değiştir</option>
//                  <option value="add-stock">Stok Ekle</option>
//                  <option value="show-stocks">Stokları Göster</option>
//                  <option value="fix-stock">Stok Düzelt</option>
//                  <option value="update-comission">Prim Oranı Değiştir</option>
//                  </select>
//                </td>
//              </td>

//          </tr>
//        `;
//         });
//       } else {
//         if (product !== null) {
//           response.data.forEach((product) => {
//             productTable.innerHTML = `
//             <tr data-productID=" ${product._id}" data-barcode="${
//               product.barcodes[0].barcode
//             }" >

//                   <td>
//                       ${product.brand || "-"}
//                   </td>
//                   <td>
//                       ${product.name}
//                   </td>

//                   <td>
//                       <div class="inputs" >
//                           <input type="number" class="price_inputs">tl
//                           <i class="ph ph-floppy-disk input_save_buttons"></i>
//                       </div>
//                   </td>
//                   <td>
//                       <div class="inputs">
//                           <input type="number" name="unitCost" class="price_inputs"
//                               >tl
//                           <i class="ph ph-floppy-disk input_save_buttons"></i>
//                       </div>
//                   </td>
//                   <td>
//                       <div class="inputs" name="quantity">
//                           <input type="number" class="price_inputs"
//                               value="">adet
//                       </div>
//                   </td>
//                    <td>
//                       <span class="continue hoverable" id="add-product">Ekle+</span>
//                   </td>

//               </tr>
//             `;
//           });
//         } else {
//           productTable.innerHTML = `
//         ${response.message}
//         `;
//         }
//         addPassiveProductHandle();
//       }

//       ui.showNotification(response.success, response.message);
//     })
//     .catch((err) => {
//       ui.showNotification(err.success, err.message);
//       console.log(err);
//     });
// });

function addPassiveProductHandle() {
  const addProductMiniBtn = document.querySelector("#add-product");
  addProductMiniBtn.addEventListener("click", (e) => {
    let data = {
      barcode: e.target.parentElement.parentElement.dataset.barcode,
      name: e.target.parentElement.parentElement.children[2].textContent.trim(),
      price:
        e.target.parentElement.parentElement.children[3].children[0].children[0]
          .value,
      stocks: {
        quantity:
          e.target.parentElement.parentElement.children[5].children[0]
            .children[0].value,
        unitCost:
          e.target.parentElement.parentElement.children[4].children[0]
            .children[0].value,
      },
    };
    request
      .postWithUrl("./products/addPassiveProduct", data)
      .then((response) => {
        console.log(response);
        if (response.success === true) {
          ui.showNotification(response.success, response.message);
          productTable.innerHTML = `ürün eklendi`;
        } else {
          ui.showNotification(response.success, response.message);
        }
      })
      .catch((err) => {
        ui.showNotification(err.success, err.message);
      });
  });
}

function handleProductSelect() {
  const productEditSelect = document.querySelector(".product-edit-select");
  productEditSelect.addEventListener("change", (e) => {
    selectedRow = e.target.parentElement.parentElement;
    if (
      e.target.options[e.target.options.selectedIndex].value === "edit-product"
    ) {
      editProductForm.brand.value =
        e.target.parentElement.parentElement.children[1].textContent.trim();
      editProductForm.name.value =
        e.target.parentElement.parentElement.children[2].textContent.trim();
      editProductForm.price.value =
        e.target.parentElement.parentElement.children[3].children[0].textContent.trim();
      modalProductEdit.classList.remove("hidden");
    }
    if (
      e.target.options[e.target.options.selectedIndex].value === "add-stock"
    ) {
      modalAddStock.classList.remove("hidden");
    }
    if (
      e.target.options[e.target.options.selectedIndex].value === "fix-stock"
    ) {
      modalFixStock.classList.remove("hidden");
    }
    if (
      e.target.options[e.target.options.selectedIndex].value === "update-comission"
    ) {
      console.log("x")
      console.log(selectedProduct)
      formUpdateComission.comission.value=selectedProduct.baseComission||0
      modalupdateComission.classList.remove("hidden");
    }
    if (
      e.target.options[e.target.options.selectedIndex].value === "show-stocks"
    ) {
      modalShowStock.classList.remove("hidden");
       formShowStock.innerHTML=""
      selectedProduct.stocks.forEach(element => {
        formShowStock.innerHTML+=`
     
        <div class="form-group ">
                       <span>Tarih:</span>
                       <span>${new Date(element.createdAt).toLocaleDateString()}</span>
                       </br>
                       Adet:<input  type="Number" name="" id="" value="${element.quantity}" readonly>
                       Birim Fiyat:<input  type="Number" name="" id="" value="${element.unitCost}" readonly>
                   </div>
                   </br>
                   

     `
      });

  
     
    }
    e.target.selectedIndex = 0;
  });
}

editProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = new FormData(editProductForm);
  request
    .postWithUrlformData("./products/" + productId + "/editProduct", data)
    .then((response) => {
      ui.showNotification(response.success, response.message);
      console.log(response);
      if (response.success === true) {
        datasToUI(selectedRow, response.data);
        modalProductEdit.classList.add("hidden");
        editProductForm.reset();
      }
    })
    .catch((err) => {
      ui.showNotification(err.message, err.message);
      console.log(err);
    });
});
function datasToUI(target, product) {
  target.innerHTML = `
           <tr data-productID="${product._id}" data-barcode="${
    product.barcodes[0]
  }" >
              
              <td>
                  ${product.barcodes}
              </td>
              <td>
                  ${product.brand || "-"}
              </td>
              <td>
                  ${product.name}
              </td>
              
              <td>
                 
                  <span>${product.price || "-"}</span> tl
                  
              </td>
              <td>
                  
                  ${product.stocks[product.stocks.length - 1].unitCost || "-"}tl
                 
              </td>
              <td>
                  
                 %${product.baseComission}

              </td>
              <td>
                  
                 ${product.totalStock}

              </td>
               <td>
                   <select name="" class="product-edit-select">
                  <option selected disable hidden>Seçenekler</option>
                  <option value="edit-product">Bilgileri Değiştir</option>
                  <option value="add-stock">Stok Ekle</option>
                  <option value="show-stocks">Stokları Göster</option>
                  <option value="fix-stock">Stok Düzelt</option>
                   <option value="update-comission">Prim Oranı Değiştir</option>
                  </select>
                </td>
              </td>
              
          </tr>
        `;
  handleProductSelect();
}
addProductButton.addEventListener("click", showModalAddProduct);

cancelBtns.forEach((element) => {
  element.addEventListener("click", () => {
    console.log("close")
    ui.closeAllModals();
  });
});

function showModalAddProduct() {
  modalProductAdd.classList.remove("hidden");
}
