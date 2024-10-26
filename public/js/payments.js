import { Print } from "./inner_modules/print.js";
const print = new Print();
import { Tables } from "./inner_modules/tables.js";
const tables = new Tables();
import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();
ui.closeNotification();

const modalPayment = document.querySelector("#modal_payment");
const modalExpenses = document.querySelector("#expenses_payment");
const filterPaymentsButton = document.querySelector(".payments-filter-button");
const addPaymentButton = document.querySelector(".payments-add-button");
const addExpensesButton = document.querySelector(".expenses-add-button");
const cancelButtons = document.querySelectorAll(".cancel");

const editPaymentModal = document.querySelector("#modal_edit_payment");
const totalValue = document.querySelector("#total_value");

const barcodeInput = document.querySelector("#barcode-input");
const userSelect = document.querySelector("#fromUser");
const operationsSelect = document.querySelector("#operations_select");
const addPaymentFrom = document.querySelector("#add_payment");
const selected_proccess_type_add = document.querySelector(
  ".selected_proccess_type_add"
);
const selected_proccess_type_edit = document.querySelector(
  ".selected_proccess_type_edit"
);
const selected_proccess_table = document.querySelector(
  ".selected_proccess_table tbody"
);
const body = document.querySelector("body");

const startDate = document.querySelector(".startDate");
const endDate = document.querySelector(".endDate");

const paymentTable = document.querySelector("#payments_table");

let selectedOperationsforEdit = [];
let selectedProductsforEdit = [];
let editedPayment = "";

eventListeners();

startingDate();
filterPaymentStartPage();

function eventListeners() {
  addPaymentButton.addEventListener("click", addPaymentModalShow);
  addExpensesButton.addEventListener("click", addExpensesModalShow);
  filterPaymentsButton.addEventListener("click", filterPayment);
  startDate.addEventListener("change", dateRange);
  body.addEventListener("click", handleTableBody);
}

cancelButtons.forEach((element) => {
  element.addEventListener("click", () => {
    for (let index = operationsSelect.options.length - 1; index >= 0; index--) {
      operationsSelect.options[index].remove();
    }

    selectedOperations = [];
    selectedProducts = [];
    calculateTotalPrice();
    // remove selected operations from uı

    while (selected_proccess_table.firstChild) {
      selected_proccess_table.firstChild.remove();
    }

    let opt = document.createElement("option");
    opt.setAttribute("selected", "");
    opt.setAttribute("disable", "");
    opt.setAttribute("hidden", "");
    opt.textContent = "Hasta Seçiniz";
    userSelect.add(opt);
    ui.closeAllModals();
  });
});

function filterPayment() {
  console.log("2");
  request
    .getwithUrl(
      `/admin/payments/getSearchedPayments?startDate=${startDate.value}&endDate=${endDate.value}`
    )
    .then((response) => {
      console.log("3");
      console.log(response);
      ui.showAllPaymensToUI(response);
    })
    .catch((err) => console.log(err));
}

function filterPaymentStartPage() {
  console.log(startDate.value);
  console.log(endDate.value);
  request
    .getwithUrl(
      `/admin/payments/getSearchedPayments?startDate=${startDate.value}&endDate=${endDate.value}`
    )
    .then((response) => {
      console.log(response);
      ui.showAllPaymensToUI(response);
    })
    .catch((err) => console.log(err));
}

paymentTable.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-payment")) {
    deletePayment(e);
  }
  if (e.target.classList.contains("edit-payment-btn")) {
    handleEditModal(e);
  }
});

function handleEditModal(e) {
  console.log(e.target);
  editedPayment = e.target.dataset.paymentid;

  request
    .getwithUrl("./payments/" + e.target.dataset.paymentid)
    .then((response) => {
      console.log(response);
      editPaymentModal.classList.remove("hidden");
      selected_proccess_table_edit.innerHTML = "";

      if (response.data.cashOrCard === "Nakit") {
        paymentCCashRatio.checked = true;
      } else {
        paymentCreditCartRatio.checked = true;
      }
      if (!response.data.fromUser) {
        editPaymentForm.dataset.userid = "";
        paymentUserEdit.value = "";
      } else {
        editPaymentForm.dataset.userid = response.data.fromUser._id;
        paymentUserEdit.value =
          response.data.fromUser.name + " " + response.data.fromUser.surname;
      }
      paymentDescriptionEdit.value = response.data.description;

      response.operationsDetails.forEach((element, index) => {
        selected_proccess_table_edit.innerHTML += `
        <tr data-id="${response.data.operations[index]._id}" data-price="${
          response.data.operations[index].paymentValue
        }" data-type="operation">
            <td>${element.operationName}</td>
                
            <td>
           
            </td>
            

            <td>
              ${element.operationPrice}
            </td>
            <td>
              ${element.discount}
            </td>
            <td>
              ${element.percentDiscount}
            </td>
            <td>
            
            ${
              (element.operationPrice - element.discount) *
              ((100 - element.percentDiscount) / 100)
            }
            </td>
            <td>
              <input class="payment_value tdInputs" value=" ${
                response.data.operations[index].paymentValue
              }" placeholder="${
          response.data.operations[index].paymentValue
        }"></input>
            </td>
            
            <td><i class="fa-solid fa-trash delete_operation_from_basket"></i></td>
        </tr>
           
            `;
      });
      response.data.products.forEach((element, index) => {
        selected_proccess_table_edit.innerHTML += `
        <tr data-id="${element._id}" data-price="${element.price}" data-type="product" >
             <td>${element.productId.name}</td>
                  <td>
                  <input class="tdInputs product-quantity" type="number" min="0" value="${element.quantity}" >
                  </td>
                  <td>
                  <input class="tdInputs deactive" type="number" min="0" value="${element.price}" readonly >
                  </td>
                  <td>
                  <input class="tdInputs discount" type="number" min="0" value="${element.discount}" >
                  </td>
                  <td>
                  <input class="tdInputs percentDiscount" type="number" min="0" value="${element.percentDiscount}" >
                  </td>
                  <td>
                  <input class="tdInputs deactive"  type="number" min="0" value="${element.paymentValue}" readonly >
                  </td>
                 
                  <td>
                  <input class="payment_value tdInputs" type="number" min="0"
                    max=""
                    value="${element.paymentValue}"
                    step="1" disabled>
                  </td>
            
            <td><i class="fa-solid fa-trash delete_product_from_basket"></i></td>
        </tr>
           
            `;
      });
      selectedOperationsforEdit = [];
      selectedProductsforEdit = [];
      response.data.operations.forEach((element) => {
        selectedOperationsforEdit.push(element);
      });
      response.data.products.forEach((element) => {
        selectedProductsforEdit.push({
          _id: element._id,
          quantity: element.quantity,
          price: element.price,
          paymentValue: element.price,
          discount: element.discount,
          percentDiscount: element.percentDiscount,
          productId:element.productId._id
        });
      });
      console.log(selectedOperationsforEdit);
      console.log(selectedProductsforEdit);
      calculateTotalPriceforEdit();
    })
    .catch((err) => {
      console.log(err);
    });
}

function deletePayment(e) {
  if (confirm("silinecek onaylıyor musunuz?")) {
    request
      .getwithUrl("./payments/" + e.target.dataset.paymentid + "/deletePayment")
      .then((response) =>
        ui.deletePaymentFromUI(
          e.target.parentElement.parentElement.parentElement
        )
      )
      .catch((err) => console.log(err));
  } else {
    console.log("vazgeçildi");
  }
}

const paymentCreditCartRatio = document.querySelector(
  "#modal_edit_payment  #credit_card_ratio_edit"
);
const paymentCCashRatio = document.querySelector(
  "#modal_edit_payment  #cash_ratio_edit"
);
const paymentUserEdit = document.querySelector(
  "#modal_edit_payment  #payment_user_edit input"
);
const paymentDescriptionEdit = document.querySelector(
  "#modal_edit_payment  #description_for_edit"
);
const editPaymentForm = document.querySelector(
  "#modal_edit_payment #edit-payment-form"
);

const selected_proccess_table_edit = document.querySelector(
  ".selected_proccess_table_edit tbody"
);

editPaymentForm.addEventListener("submit", (e) => {
  let data = {
    paymentId: editedPayment,
    cashOrCard: editPaymentForm.cashOrCard.value,
    description: editPaymentForm.description.value,
    operations: selectedOperationsforEdit,
    products: selectedProductsforEdit,
  };
  console.log(data);

  request
    .postWithUrl("./payments/" + editedPayment + "/editPayment", data)
    .then((response) => {
      console.log("1");
      ui.showNotification(true, response.message);
      editPaymentModal.classList.add("hidden");
      setTimeout(() => {
        filterPayment();
      }, 500);
    })
    .catch((err) => console.log(err));
  e.preventDefault();
});

function handleTableBody(e) {
  const smallModals = document.querySelectorAll(".edit_payment_small_modal");

  if (e.target.classList.contains("edit_payment")) {
    console.log("burası");

    if (e.target.nextSibling.nextSibling.classList.contains("showed_modal")) {
      e.target.nextSibling.nextSibling.classList.toggle("showed_modal");
    } else {
      smallModals.forEach((modal) => {
        modal.classList.remove("showed_modal");
      });
      e.target.nextSibling.nextSibling.classList.toggle("showed_modal");
    }

    // e.target.nextSibling.nextSibling.classList.toggle("showed_modal");
  } else {
    smallModals.forEach((modal) => {
      modal.classList.remove("showed_modal");
    });
  }
}

function addPaymentModalShow() {
  modalPayment.classList.remove("hidden");
}

function addExpensesModalShow() {
  modalExpenses.classList.remove("hidden");
}

// start date
// lazım olacak
// function toDateInputValue(dateObject){
//   const local = new Date(dateObject);
//   local.setMinutes(dateObject.getMinutes() - dateObject.getTimezoneOffset());
//   return local.toJSON().slice(0,10);
// };

function startingDate() {
  var local = new Date();
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  local = local.toJSON().slice(0, 10);
  //

  startDate.value = local;

  endDate.value = startDate.value;
}

function dateRange() {
  const value = startDate.value;
  endDate.setAttribute("min", value);
}

// user selecting handled

userSelect.addEventListener("change", () => {
  let userID = userSelect.options[userSelect.options.selectedIndex].value;
  selectedOperations = [];
  request
    .getwithUrl("./users/" + userID + "/getUsersHasPaymentOperations")
    .then((response) => {
      console.log(response);
      while (operationsSelect.firstChild) {
        operationsSelect.firstChild.remove();
      }
      if (response.operations.length === 0) {
        let opt = document.createElement("option");
        opt.setAttribute("selected", "");
        opt.setAttribute("disable", "");
        opt.setAttribute("hidden", "");
        opt.textContent = "hastaya Ait İşlem Yok";
        operationsSelect.add(opt);

        // remove selected operations from uı
        while (selected_proccess_table.firstChild) {
          selected_proccess_table.firstChild.remove();
        }
        calculateTotalPrice();
      } else {
        // delete all selectable user operations options from uı
        for (
          let index = operationsSelect.options.length - 1;
          index >= 0;
          index--
        ) {
          operationsSelect.options[index].remove();
        }

        // remove selected operations from uı
        let operations = selected_proccess_table.querySelectorAll(
          "[data-type='operation']"
        );

        while (operations.firstChild) {
          operations.firstChild.remove();
        }

        let opt = document.createElement("option");
        opt.setAttribute("selected", "");
        opt.setAttribute("disable", "");
        opt.setAttribute("hidden", "");
        opt.textContent = "İşlem Seçiniz";
        operationsSelect.add(opt);

        response.operations.forEach((element) => {
          let opt = document.createElement("option");
          opt.setAttribute("data-price", element.operationPrice);
          opt.setAttribute("data-id", element._id);
          opt.setAttribute("data-paidvalue", element.paidValue);
          opt.setAttribute("data-discount", element.discount);
          opt.setAttribute("data-percentdiscount", element.percentDiscount);
          opt.textContent = element.operationName;
          opt.value = element.operationName;
          operationsSelect.add(opt);
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// selectedOperations Handeled
let selectedOperations = [];
let selectedProducts = [];

operationsSelect.addEventListener("change", () => {
  let selectedOption =
    operationsSelect.options[operationsSelect.options.selectedIndex];

  selectedOperations.push({
    operationId: selectedOption.dataset.id,
    operationPrice: Number(selectedOption.dataset.price),
    paymentValue:
      (Number(selectedOption.dataset.price) -
        Number(selectedOption.dataset.discount)) *
        ((100 - Number(selectedOption.dataset.percentdiscount)) / 100) -
      Number(selectedOption.dataset.paidvalue),
    paidValue: Number(selectedOption.dataset.paidvalue),
    discount: Number(selectedOption.dataset.discount),
    percentDiscount: Number(selectedOption.dataset.percentdiscount),
  });

  console.log(selectedOperations);

  selected_proccess_table.innerHTML += `
  <tr data-price="${selectedOption.dataset.price}"
       data-value="${selectedOption.value}"
       data-paidvalue="${selectedOption.dataset.paidvalue}"
       data-discount="${selectedOption.dataset.discount}"
       data-percentDiscount="${selectedOption.dataset.percentdiscount}"
       data-id="${selectedOption.dataset.id}"
       data-type="operation">
  
      <td>${selectedOption.textContent.trim()}</td>
                
      <td>
      
      </td>
      <td>
      <input class="tdInputs deactive" type="number" min="0" value="${
        selectedOption.dataset.price
      }" readonly >
      </td>
      
      <td>
      <input class="tdInputs deactive" type="number" min="0" value="${
        selectedOption.dataset.discount
      }" readonly >
      </td>
      <td>
      <input class="tdInputs deactive" type="number" min="0" value="${
        selectedOption.dataset.percentdiscount
      }" readonly >
      </td>
      <td>
      <input class="tdInputs deactive"  type="number" min="0" value="${
        ((selectedOption.dataset.price - selectedOption.dataset.discount) *
          (100 - selectedOption.dataset.percentdiscount)) /
        100
      }" readonly >
      </td>
      

      <td>
      <input class="tdInputs deactive"  type="number" min="0" value="${
        selectedOption.dataset.paidvalue
      }" readonly >
      
      </td>
      <td>
      <input class="payment_value tdInputs" type="number" class="payment_value" min="0"
        max="${(
          ((selectedOption.dataset.price - selectedOption.dataset.discount) *
            (100 - selectedOption.dataset.percentdiscount)) /
            100 -
          selectedOption.dataset.paidvalue
        ).toFixed()}" 
        value="${(
          ((selectedOption.dataset.price - selectedOption.dataset.discount) *
            (100 - selectedOption.dataset.percentdiscount)) /
            100 -
          selectedOption.dataset.paidvalue
        ).toFixed()}"
        step="1">  
      </td>
      
      <td><i class="fa-solid fa-trash delete_items_from_basket"></i></td>
  </tr>
  `;

  selectedOption.remove();

  calculateTotalPrice();
});

function calculateTotalPrice() {
  console.log("calculating");

  let totalValue = document.querySelector("#total_value");
  let paymentValues = 0;
  let productPaymentValues = 0;
  if (selectedOperations.length !== 0) {
    paymentValues = selectedOperations.map((element) => element.paymentValue);
    paymentValues = paymentValues.reduce((a, b) => a + b).toFixed();
  }
  if (selectedProducts.length !== 0) {
    selectedProducts.forEach((element) => {
      productPaymentValues += element.paymentValue;
    });
    productPaymentValues = productPaymentValues;
  }
  console.log(Number(productPaymentValues));
  totalValue.textContent = Number(paymentValues) + Number(productPaymentValues);
}

function calculateTotalPriceforEdit() {
  console.log("calculating2");

  let totalValueforEdit = document.querySelector("#total_value_edit");
  let paymentValues = 0;
  let productPaymentValues = 0;
  if (selectedOperationsforEdit.length !== 0) {
    paymentValues = selectedOperationsforEdit.map(
      (element) => element.paymentValue
    );
    paymentValues = paymentValues.reduce((a, b) => a + b).toFixed();
  }
  if (selectedProductsforEdit.length !== 0) {
    selectedProductsforEdit.forEach((element) => {
      productPaymentValues += element.paymentValue;
    });
    productPaymentValues = productPaymentValues;
  }

  totalValueforEdit.textContent =
    Number(paymentValues) + Number(productPaymentValues);
}

// remove selected operations

selected_proccess_type_add.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete_items_from_basket")) {
    // add back to selectedbox

    let opt = document.createElement("option");

    operationsSelect.innerHTML += `
    
    <option selected disable hidden >işlem seçiniz</option>
  
     <option
      data-price="${e.target.parentElement.parentElement.dataset.price}" 
      data-id="${e.target.parentElement.parentElement.dataset.id}"
      data-paidvalue="${e.target.parentElement.parentElement.dataset.paidvalue}"
      data-discount="${e.target.parentElement.parentElement.dataset.discount}"
      data-percentdiscount="${e.target.parentElement.parentElement.dataset.percentdiscount}"
      value="${e.target.parentElement.parentElement.dataset.value}"
     >
     ${e.target.parentElement.parentElement.dataset.value}
     </option>
     `;

    // remove selected options
    let index = selectedOperations.findIndex(
      (item) =>
        item.operationId === e.target.parentElement.parentElement.dataset.id
    );
    console.log(index);
    selectedOperations.splice(index, 1);

    if (
      selectedOperations.map((element) => element.paymentValue).length !== 0
    ) {
      calculateTotalPrice();
    } else {
      totalValue.value = 0;
    }
    e.target.parentElement.parentElement.remove();
    console.log(selectedOperations);
    calculateTotalPrice();
  }
  if (e.target.classList.contains("delete_product_from_basket")) {
    // remove selected options
    let index = selectedProducts.findIndex(
      (item) => item._id === e.target.parentElement.parentElement.dataset.id
    );
    console.log(index);
    selectedProducts.splice(index, 1);
    e.target.parentElement.parentElement.remove();
    console.log(selectedProducts);
    calculateTotalPrice();
  }

  // //////////////////
});
selected_proccess_type_edit.addEventListener("input", (e) => {
  if (e.target.classList.contains("product-quantity")) {
    let index = selectedProductsforEdit.findIndex(
      (item) =>
        item._id === e.target.parentElement.parentElement.dataset.id
    );
    console.log(index);
    console.log(selectedProductsforEdit);
    selectedProductsforEdit[index].quantity = Number(e.target.value);
    selectedProductsforEdit[index].paymentValue =
      selectedProductsforEdit[index].quantity *
      selectedProductsforEdit[index].price;
    e.target.parentElement.parentElement.children[6].children[0].value =
      selectedProductsforEdit[index].paymentValue;
    calculateTotalPriceforEdit();
  }
  if (e.target.classList.contains("discount")) {
    let index = selectedProductsforEdit.findIndex(
      (item) =>
        item._id === e.target.parentElement.parentElement.dataset.id
    );
    
    
    selectedProductsforEdit[index].discount = Number(e.target.value);
    selectedProductsforEdit[index].paymentValue =
    selectedProductsforEdit[index].quantity * selectedProductsforEdit[index].price -
    selectedProductsforEdit[index].discount;
  e.target.parentElement.parentElement.children[6].children[0].value =
  selectedProductsforEdit[index].paymentValue;
    
    calculateTotalPriceforEdit();
  }
});


selected_proccess_type_add.addEventListener("input", (e) => {
  if (
    e.target.classList.contains("payment_value") &&
    e.target.parentElement.parentElement.dataset.type === "operation"
  ) {
    let index = selectedOperations.findIndex(
      (item) =>
        item.operationId === e.target.parentElement.parentElement.dataset.id
    );

    selectedOperations[index].paymentValue = Number(e.target.value);

    calculateTotalPrice();
  }
  if (
    e.target.classList.contains("payment_value") &&
    e.target.parentElement.parentElement.dataset.type === "product"
  ) {
    console.log("burası");
    let index = selectedProducts.findIndex(
      (item) => item._id === e.target.parentElement.parentElement.dataset.id
    );

    selectedProducts[index].paymentValue = Number(e.target.value);

    calculateTotalPrice();
  }
  if (
    e.target.classList.contains("percentDiscount") &&
    e.target.parentElement.parentElement.dataset.type === "product"
  ) {
    let index = selectedProducts.findIndex(
      (item) => item._id === e.target.parentElement.parentElement.dataset.id
    );

    selectedProducts[index].percentDiscount = Number(e.target.value);
    selectedProducts[index].paymentValue =
      selectedProducts[index].quantity *
      ((selectedProducts[index].price *
        (100 - selectedProducts[index].percentDiscount)) /
        100);
    e.target.parentElement.parentElement.children[7].children[0].value =
      selectedProducts[index].paymentValue;
    calculateTotalPrice();
  }
  if (
    e.target.classList.contains("discount") &&
    e.target.parentElement.parentElement.dataset.type === "product"
  ) {
    let index = selectedProducts.findIndex(
      (item) => item._id === e.target.parentElement.parentElement.dataset.id
    );

    selectedProducts[index].discount = Number(e.target.value);
    selectedProducts[index].paymentValue =
      selectedProducts[index].quantity * selectedProducts[index].price -
      selectedProducts[index].discount;
    e.target.parentElement.parentElement.children[7].children[0].value =
      selectedProducts[index].paymentValue;
    calculateTotalPrice();
  }
  if (e.target.classList.contains("product-quantity")) {
    let index = selectedProducts.findIndex(
      (item) =>
        item.productId ===
        e.target.parentElement.parentElement.dataset.productid
    );
    console.log(index);
    selectedProducts[index].quantity = Number(e.target.value);
    selectedProducts[index].paymentValue =
      selectedProducts[index].quantity * selectedProducts[index].price;
    e.target.parentElement.parentElement.children[7].children[0].value =
      selectedProducts[index].paymentValue;
    calculateTotalPrice();
  }
});

selected_proccess_table_edit.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete_product_from_basket")) {
    let index = selectedOperationsforEdit.findIndex(
      (item) => item._id === e.target.parentElement.parentElement.dataset.id
    );
    selectedProductsforEdit.splice(index, 1);
    e.target.parentElement.parentElement.remove();
    calculateTotalPriceforEdit();
    console.log(selectedProductsforEdit);
  }
  if (e.target.classList.contains("delete_operation_from_basket")) {
    let index = selectedOperationsforEdit.findIndex(
      (item) => item._id === e.target.parentElement.parentElement.dataset.id
    );
    selectedOperationsforEdit.splice(index, 1);
    e.target.parentElement.parentElement.remove();
    calculateTotalPriceforEdit();
    console.log(selectedOperationsforEdit);
  }
});

selected_proccess_table_edit.addEventListener("input", (e) => {
  if (
    e.target.classList.contains("payment_value") &&
    e.target.parentElement.parentElement.dataset.type === "operation"
  ) {
    let index = selectedOperationsforEdit.findIndex(
      (item) => item._id === e.target.parentElement.parentElement.dataset.id
    );

    e.target.addEventListener("input", (e) => {
      selectedOperationsforEdit[index].paymentValue = Number(e.target.value);

      calculateTotalPriceforEdit();
    });
  }

  if (
    e.target.classList.contains("payment_value") &&
    e.target.parentElement.parentElement.dataset.type === "product"
  ) {
    let index = selectedProductsforEdit.findIndex(
      (item) => item._id === e.target.parentElement.parentElement.dataset.id
    );
    console.log(index);
    console.log(selectedProductsforEdit);
    selectedProductsforEdit[index].paymentValue = Number(e.target.value);

    calculateTotalPriceforEdit();
  }
});

// add payment
barcodeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Formun otomatik gönderilmesini engeller

    const enteredBarcode = barcodeInput.value.trim(); // Girdiği değeri alır ve boşlukları siler
    if (enteredBarcode) {
      let data = {
        barcode: e.target.value,
      };
      request
        .postWithUrl("./products/searchProductInner", data)
        .then((response) => {
          barcodeInput.value = "";
          console.log(response);
          ui.showNotification(response.success, response.message);

          let index = selectedProducts.findIndex(
            (item) => item.productId === response.data._id
          );
          console.log(index);
          let product = {};

          if (response.success === true) {
            if (index === -1) {
              selected_proccess_table.innerHTML += `
              <tr data-productId="${response.data._id}" data-type="product" >
                  <td>
                    <span>${response.data.name}</span>
                  </td>
                  <td>
                  <input class="tdInputs product-quantity" type="number" min="0" value="1" >
                  </td>
                  <td>
                  <input class="tdInputs deactive" type="number" min="0" value="${response.data.price}" readonly >
                  </td>
                  <td>
                  <input class="tdInputs discount" type="number" min="0" value="" >
                  </td>
                  <td>
                  <input class="tdInputs percentDiscount" type="number" min="0" value="" >
                  </td>
                  <td>
                  <input class="tdInputs deactive"  type="number" min="0" value="" readonly >
                  </td>
                  <td>
                  
                  </td>
                  <td>
                  <input class="payment_value tdInputs" type="number" min="0"
                    max=""
                    value="${response.data.price}"
                    step="1" disabled> 
                  </td>
      
                  <td><i class="fa-solid fa-trash delete_product_from_basket"></i></td>
      
              </tr>`;
              product.productId = response.data._id;
              product.quantity = 1;
              product.price = response.data.price;
              product.paymentValue = response.data.price;
              product.discount = 0;
              product.percentDiscount = 0;
              selectedProducts.push(product);
            } else {
              selectedProducts[index].quantity =
                selectedProducts[index].quantity + 1;
              selectedProducts[index].paymentValue =
                selectedProducts[index].quantity *
                selectedProducts[index].price;
              let productsRow = selected_proccess_table.querySelectorAll("tr");

              productsRow.forEach((element) => {
                if (element.dataset.id === selectedProducts[index]._id) {
                  console.log("burası2");
                  element.children[1].children[0].value =
                    Number(element.children[1].children[0].value) + 1;
                  element.children[7].children[0].value =
                    selectedProducts[index].paymentValue;
                }
              });
            }

            console.log(selectedProducts);

            calculateTotalPrice();
          }
        })
        .catch((err) => {
          console.log(err);
          ui.showNotification(false, err);
        });
    }
  }
});

addPaymentFrom.addEventListener("submit", (e) => {
  e.preventDefault();

  let cashOrCard = addPaymentFrom.querySelector('[name="cashOrCard"]:checked');
  console.log(cashOrCard);
  let data = {
    fromUser: addPaymentFrom.fromUser.value,
    totalPrice: Number(totalValue.textContent),
    cashOrCard: addPaymentFrom.cashOrCard.value,
    description: addPaymentFrom.description.value,
    operations: selectedOperations,
    products: selectedProducts,
  };
  request
    .postWithUrl("./payments/addPayment", data)
    .then((response) => {
      console.log(response);
      ui.showNotification(response.success, response.message);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    })
    .catch((err) => {
      ui.showNotification(false, err);
    });
});

// print process

const pdf_btn = document.querySelector(".to_pdf");
const xlsx_btn = document.querySelector(".to_xlsx");

const table = document.querySelector("table");

pdf_btn.onclick = () => {
  console.log("dadad");
  print.toPDF(table);
};

xlsx_btn.onclick = () => {
  const xlsx_doc = print.toXLS(table);
  print.downloadFile(xlsx_doc, "xlsx", "e-isletmem.xls");
};

//tables sorting
const tableElements = document.querySelectorAll("table");

tableElements.forEach((table) => {
  table.querySelectorAll("thead th").forEach((head, columnIndex) => {
    head.addEventListener("click", () => {
      tables.sortingStart(table, columnIndex);
    });
  });
});
