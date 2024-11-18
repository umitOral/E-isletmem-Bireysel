$(".chosen-select").chosen({ width: "100%" });

console.log("reports");
$(".chosen-select").chosen({ width: "100%" });

import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();

const cancelBtns = document.querySelectorAll(".btn.cancel.form-btn");
const operationTypeSelect = document.getElementById("operationType");
let paginationBtns = document.querySelectorAll(".pagination-buttons");
let editPaymentModal = document.querySelector("#modal_edit_payment");
const checkAll = document.getElementById("check-all");

const selected_proccess_type_edit = document.querySelector(
  ".selected_proccess_type_edit"
);
const selected_proccess_table = document.querySelector(
  ".selected_proccess_table tbody"
);
const paymentsTable = document.querySelector("#payments_table");

let selectedOperationsforEdit = [];
let selectedProductsforEdit = [];
let editedPayment = "";

let selectedPaymentIndex;

cancelBtns.forEach((element) => {
  element.addEventListener("click", () => {
    ui.closeAllModals();
  });
});

const table = document.querySelector("#payment-report-table");
const searchForm = document.querySelector("#payment-reports-search");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  getPayments();
});

function getPayments(page) {
  console.log("burası");
  let data = {
    page: page || 1,
    startDate: searchForm.startDate.value,
    endDate: searchForm.endDate.value,
    users: Array.from(searchForm.userInput.selectedOptions).map(
      ({ value }) => value
    ),
    employee: Array.from(searchForm.employeeInput.selectedOptions).map(
      ({ value }) => value
    ),
    cashOrCard:
      searchForm.cashOrCard.options[searchForm.cashOrCard.options.selectedIndex]
        .value,
  };

  request
    .postWithUrl("./paymentsReportsPage", data)
    .then((response) => {
      ui.showNotification(response.success, response.message);
      console.log(response);

      datasToTable(response.data);
      detailsBtnhandLe();
      datasToPagination(response.data.pagination);
    })
    .catch((err) => {
      ui.showNotification(false, err.message);
      console.log(err);
    });
}

function detailsBtnhandLe() {
  let btns = document.querySelectorAll(".payment-details-btn");
  btns.forEach((element, index) => {
    element.addEventListener("click", (e) => {
      selectedPaymentIndex = index + 1;
      handleEditModal(e);
    });
  });
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
const saveEditModal = document.querySelector(
  "#modal_edit_payment #save_update_btn"
);

const selected_proccess_table_edit = document.querySelector(
  ".selected_proccess_table_edit tbody"
);

function handleEditModal(e) {
  console.log(e.target);
  editedPayment = e.target.parentElement.parentElement.dataset.paymentid;

  request
    .getwithUrl(
      "../payments/" + e.target.parentElement.parentElement.dataset.paymentid
    )
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
        paymentUserEdit.value = "hasta işlenmedi";
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
        <tr data-id="${element.productId._id}" data-price="${element.price}" data-type="product" >
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
          paymentValue: element.paymentValue,
          discount: element.discount,
          percentDiscount: element.percentDiscount,
          productId: element.productId._id,
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

function calculateTotalPriceforEdit() {
  console.log("calculating2");
  console.log(selectedProductsforEdit);

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

function datasToTable(data) {
  let tableBody = document.querySelector("#payment-report-table tbody");
  let tableFoot = document.querySelector("#payment-report-table tfoot");
  let lastpage = document.querySelector("#lastpage");

  while (tableBody.children[0]) {
    tableBody.children[0].remove();
  }
  while (tableFoot.children[0]) {
    tableFoot.children[0].remove();
  }

  data.reports.forEach((element, index) => {
    tableBody.innerHTML += `
    <tr data-paymentId="${element._id}">
                                       
                                       <td>
                                        <div style="display: flex; align-items: center; justify-content: center; gap:0.5rem;">
                                              <label for="">${
                                                (data.pagination.page - 1) *
                                                  data.pagination.limit +
                                                index +
                                                1
                                              }</label>
                                              <input type="checkbox" name="" id="">
                                          </div>
                                       
                                       </td>
                                       <td>
                                       ${new Date(
                                         element.createdAt
                                       ).toLocaleDateString()}
                                       </td>
                                      
                                      
                                       <td>
                                       ${(() => {
                                         if (element.comissionEmployee) {
                                           return (
                                             element.comissionEmployee.name +
                                             " " +
                                             element.comissionEmployee.surname
                                           );
                                         } else {
                                           return " ";
                                         }
                                       })()}
                                       </td>
                                       <td>
                                       ${(() => {
                                         if (element.fromUser) {
                                           return (
                                             element.fromUser.name +
                                             " " +
                                             element.fromUser.surname
                                           );
                                         } else {
                                           return " ";
                                         }
                                       })()}
                                       </td>
                                       
                                          <td>
                                       ${element.totalPrice}
                                       </td>
                                        
                                     
                                          <td>
                                       ${element.cashOrCard}
                                       </td>
                                          <td>
                                       ${element.description}
                                       </td>
                                          <td>
                                        
                                          <span class="payment-details-btn table-button notr">Detay</span>
                                       </td>
                                    
                                       
                                     
                                   </tr>
`;

    lastpage.innerHTML = `${data.pagination.lastpage}`;
  });

  tableFoot.innerHTML += `
                  
  <tr>
      
      <td colspan="4">toplam:</td>
        <td>
        ${(data.reports.map((item) => item.totalPrice)
          .reduce((a, b) => a + b))}
        </td>
     
  </tr>

`;
}
function datasToPagination(pagination) {
  let paginationArea = document.getElementById("pagination");
  // reset
  paginationArea.innerHTML = "";
  // create
  if (pagination.previous) {
    paginationArea.innerHTML += `
      <span class="pagination-buttons" data-pageNumber="${pagination.page - 1}">
       <i class="fa-solid fa-angle-left"></i>
      </span>
    
  `;
  }

  if (pagination.page > 1) {
    paginationArea.innerHTML += `
        <span class="pagination-buttons" data-pageNumber="${
          pagination.page - 1
        }">
        ${pagination.page - 1}
          </span>
        
      `;
  }

  paginationArea.innerHTML += `
      <span class="pagination-buttons page-active" data-pageNumber="${pagination.page}">
              ${pagination.page}
            </span>
    `;

  if (pagination.page < pagination.lastpage) {
    paginationArea.innerHTML += `
           
        <span class="pagination-buttons" data-pageNumber="${
          pagination.page + 1
        }">
        ${pagination.page + 1}
        </span>
     
 `;
  }
  if (pagination.next) {
    paginationArea.innerHTML += `
           
               <span class="pagination-buttons" data-pageNumber="${
                 pagination.page + 1
               }">
                  <i class="fa-solid fa-angle-right"></i>
               </span>
            
        `;
  }
  paginatioButtonsHandle();
}

function paginatioButtonsHandle() {
  let paginationBtns = document.querySelectorAll(".pagination-buttons");
  paginationBtns.forEach((element) => {
    element.addEventListener("click", (e) => {
      console.log(e.target.dataset.pagenumber);
      getPayments(e.target.dataset.pagenumber);
    });
  });
}

checkAll.addEventListener("click", (e) => {
  ui.tableRowSelection(table);
});

let selectedUsers = [];
// bulk operations

operationTypeSelect.addEventListener("change", () => {
  selectedUsers = [];

  const checkBoxes = table.querySelectorAll(
    "input[type=checkbox]:not(:first-child):checked"
  );

  checkBoxes.forEach((element) => {
    selectedUsers.push(
      element.parentElement.parentElement.parentElement.dataset.userid
    );
  });
  console.log(selectedUsers);
  let operationType =
    operationTypeSelect.options[operationTypeSelect.options.selectedIndex]
      .value;

  operationTypeSelect.options.selectedIndex = 0;
  if (selectedUsers.length === 0) {
    ui.showNotification(false, "listeden hasta seçiniz");
  } else {
    if (operationType === "sendMessage") {
    }
  }
});

saveEditModal.addEventListener("click", (e) => {
  e.preventDefault();
  let data = {
    paymentId: editedPayment,
    cashOrCard: editPaymentForm.cashOrCard.value,
    description: editPaymentForm.description.value,
    operations: selectedOperationsforEdit,
    products: selectedProductsforEdit,
  };
  console.log(data);

  request
    .postWithUrl("../payments/" + editedPayment + "/editPayment", data)
    .then((response) => {
      console.log(response);
      ui.showNotification(true, response.message);
      editPaymentModal.classList.add("hidden");
      table.rows[selectedPaymentIndex].children[4].innerHTML = `
        ${response.data.totalPrice}
      `;
      table.rows[selectedPaymentIndex].children[5].innerHTML = `
        ${response.data.cashOrCard}
      `;
      table.rows[selectedPaymentIndex].children[6].innerHTML = `
        ${response.data.description}
      `;
    })
    .catch((err) => console.log(err));
});

selected_proccess_table_edit.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete_product_from_basket")) {
    // remove selected options
    let index = selectedProductsforEdit.findIndex(
      (item) =>
        item.productId === e.target.parentElement.parentElement.dataset.id
    );
    console.log(index);
    selectedProductsforEdit.splice(index, 1);
    e.target.parentElement.parentElement.remove();
    console.log(selectedProductsforEdit);
    calculateTotalPriceforEdit();
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

selected_proccess_type_edit.addEventListener("input", (e) => {
  if (e.target.classList.contains("product-quantity")) {
    let index = selectedProductsforEdit.findIndex(
      (item) =>
        item.productId === e.target.parentElement.parentElement.dataset.id
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
      (item) => item._id === e.target.parentElement.parentElement.dataset.id
    );

    selectedProductsforEdit[index].discount = Number(e.target.value);
    selectedProductsforEdit[index].paymentValue =
      selectedProductsforEdit[index].quantity *
        selectedProductsforEdit[index].price -
      selectedProductsforEdit[index].discount;
    e.target.parentElement.parentElement.children[6].children[0].value =
      selectedProductsforEdit[index].paymentValue;

    calculateTotalPriceforEdit();
  }
});
