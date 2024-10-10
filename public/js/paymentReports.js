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
let editPaymentModal=document.querySelector("#modal_edit_payment")
const checkAll = document.getElementById("check-all");


const selected_proccess_type_edit = document.querySelector(
  ".selected_proccess_type_edit"
);
const selected_proccess_table = document.querySelector(
  ".selected_proccess_table tbody"
);
const paymentsTable = document.querySelector("#payments_table");

let selectedOperationsforEdit = [];
let editedPayment = "";

let selectedOperations = [];

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
 
  let data = {
    page:page||1,
    startDate: searchForm.startDate.value,
    endDate: searchForm.endDate.value,
    users: Array.from(searchForm.userInput.selectedOptions).map(
      ({ value }) => value
    ),
    cashOrCard: searchForm.cashOrCard.options[searchForm.cashOrCard.options.selectedIndex].value
    
  };
  console.log(data)
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
  let btns=document.querySelectorAll(".payment-details-btn")
  btns.forEach(element => {
    element.addEventListener("click",(e)=>{
      handleEditModal(e.target.parentElement.parentElement.dataset.paymentid)
    })
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

function handleEditModal(paymentId) {
  
  editedPayment = paymentId;

  request
    .getwithUrl("../payments/" +paymentId)
    .then((response) => {
      console.log(response);
      editPaymentModal.classList.remove("hidden");
      selected_proccess_table_edit.innerHTML = "";

      if (response.data.cashOrCard === "Nakit") {
        paymentCCashRatio.checked = true;
      } else {
        paymentCreditCartRatio.checked = true;
      }
      editPaymentForm.dataset.userid = response.data.fromUser._id;
      paymentUserEdit.value =
        response.data.fromUser.name + " " + response.data.fromUser.surname;

      paymentDescriptionEdit.value = response.data.description;

      response.operationsDetails.forEach((element, index) => {
        selected_proccess_table_edit.innerHTML += `
        <tr data-id="${response.data.operations[index]._id}" data-price="${
          response.data.operations[index].paymentValue
        }" >
            <td>${element.operationName}</td>
                
            <td>
            <input type="number" min="0" value="1" readonly >
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
              <input class="payment_value" value=" ${
                response.data.operations[index].paymentValue
              }" placeholder="${
          response.data.operations[index].paymentValue
        }"></input>
            </td>
            
            <td><i class="fa-solid fa-trash delete_items_from_basket"></i></td>
        </tr>
           
            `;
      });
      selectedOperationsforEdit=[]
      response.data.operations.forEach((element) => {
        selectedOperationsforEdit.push(element);
      });
      console.log(selectedOperationsforEdit);
      calculatetTotalPriceforEdit();
    })
    .catch((err) => {
      console.log(err);
    });
}

function datasToTable(data) {
  let tableBody = document.querySelector("#payment-report-table tbody");
  let lastpage = document.querySelector("#lastpage");
  let total = document.querySelector("#total");


  while (tableBody.children[0]) {
    tableBody.children[0].remove();
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
                                       ${
                                         element.fromUser.name +
                                         " " +
                                         element.fromUser.surname
                                       }
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
    total.innerHTML = data.total;
  });
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


saveEditModal.addEventListener("click",(e) => {
  e.preventDefault();
  let data = {
    paymentId: editedPayment,
    cashOrCard: editPaymentForm.cashOrCard.value,
    description: editPaymentForm.description.value,
    operations: selectedOperationsforEdit,
  };
  console.log(data)

    request
    .postWithUrl("../payments/" + editedPayment + "/editPayment", data)
    .then((response) => {
      console.log("1")
      ui.showNotification(true, response.message);
      editPaymentModal.classList.add("hidden");
      getPayments()
     
    })
    .catch((err) => console.log(err));
  
});

function calculatetTotalPriceforEdit() {
  console.log("calculating2");

  let totalValueforEdit = document.querySelector("#total_value_edit");
  let paymentValues = selectedOperationsforEdit.map(
    (element) => element.paymentValue
  );

  if (paymentValues.length === 0) {
    totalValueforEdit.textContent = 0;
  } else {
    totalValueforEdit.textContent = paymentValues.reduce((a, b) => a + b);
  }
}


selected_proccess_table_edit.addEventListener("input", (e) => {
  if (e.target.classList.contains("payment_value")) {
    let index = selectedOperationsforEdit.findIndex(
      (item) => item._id === e.target.parentElement.parentElement.dataset.id
    );

    e.target.addEventListener("input", (e) => {
      selectedOperationsforEdit[index].paymentValue = Number(e.target.value);
      console.log(selectedOperationsforEdit);
      calculatetTotalPriceforEdit();
    });
  }
});
