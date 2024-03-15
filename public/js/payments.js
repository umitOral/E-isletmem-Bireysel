import { Print } from "./inner_modules/print.js";
const print = new Print();
import { Tables } from "./inner_modules/tables.js";
const tables = new Tables();
import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();

const modalPayment = document.querySelector(".modal_payment");
const modalExpenses = document.querySelector(".expenses_payment");
const filterPaymentsButton = document.querySelector(".payments-filter-button");
const addPaymentButton = document.querySelector(".payments-add-button");
const addExpensesButton = document.querySelector(".expenses-add-button");
const cancelButtons = document.querySelectorAll(".cancel_button");

const editPaymentModal = document.querySelector(".modal_edit_payment");
const totalValue = document.querySelector("#total_value");

const userSelect = document.querySelector("#fromUser");
const operationsSelect = document.querySelector("#operations_select");
const addPaymentFrom = document.querySelector("#add_payment");
const selected_proccess_type_add = document.querySelector(
  ".selected_proccess_type_add"
);
const selected_proccess_table = document.querySelector(
  ".selected_proccess_table tbody"
);
const paymentsTable = document.querySelector("#payments_table");

const startDate = document.querySelector(".startDate");
const endDate = document.querySelector(".endDate");

eventListeners();

startingDate();
filterPaymentStartPage();

function eventListeners() {
  addPaymentButton.addEventListener("click", addPaymentModalShow);
  addExpensesButton.addEventListener("click", addExpensesModalShow);
  filterPaymentsButton.addEventListener("click", filterPayment);
  startDate.addEventListener("change", dateRange);
  paymentsTable.addEventListener("click", handleTableBody);
}

cancelButtons.forEach((cancelbutton) => {
  cancelbutton.addEventListener("click", cancelAddPayment);
});

 function filterPayment (e) {
  
   request
    .getwithUrl(
      `/admin/payments/getSearchedPayments?startDate=${startDate.value}&endDate=${endDate.value}`
    )
    .then((response) => {
      console.log(response)
      ui.showAllPaymensToUI(response);
    })
    .catch((err) => console.log(err));
    
}

function filterPaymentStartPage() {
  request
    .getwithUrl(
      `/admin/payments/getSearchedPayments?startDate=${startDate.value}&endDate=${endDate.value}`
    )
    .then((response) => {
      ui.showAllPaymensToUI(response);

      const paymentTable = document.querySelector("#payments_table");

      paymentTable.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-payment")) {
          deletePayment(e);
        }
        if (e.target.classList.contains("edit-payment-btn")) {
          handleEditModal(e);
        }
      });
    })
    .catch((err) => console.log(err));
}

let selectedOperationsforEdit = [];
let editedPayment = "";

function handleEditModal(e) {
  console.log(e.target);
  editedPayment = e.target.dataset.paymentid;

  request
    .getwithUrl("./payments/" + e.target.dataset.paymentid)
    .then((response) => {
      console.log(response);
      editPaymentModal.classList.add("showed_modal");
      selected_proccess_table_edit.innerHTML = "";

      if (response.data.cashOrCard === "Nakit") {
        paymentCCashRatio.checked = true;
      } else {
        paymentCreditCartRatio.checked = true;
      }
      editPaymentForm.dataset.userid = response.data.fromUser._id;
      paymentUserEdit.value =
        response.data.fromUser.name + " " + response.data.fromUser.surname;

        paymentDescriptionEdit.value=response.data.description

      response.operationsDetails.forEach((element, index) => {
        selected_proccess_table_edit.innerHTML += `
        <tr data-id="${response.data.operations[index]._id}" data-price="${
          response.data.operations[index].paymentValue
        }" >
            <td>${element.operationName}</td>
                
            <td>
            <input type="number" min="0" value="1" readonly >
            </td>
            

            <td>${element.paidValue}/${element.operationPrice}
            </td>
            <td>
            <input type="number" class="payment_value" min="0"
              max="${
                element.operationPrice -
                (element.paidValue -
                  response.data.operations[index].paymentValue)
              }" 
              placeholder="${response.data.operations[index].paymentValue}">TL
            </td>
            
            <td><i class="fa-solid fa-trash delete_items_from_basket"></i></td>
        </tr>
           
            
            `;
      });

      selectedOperationsforEdit = [];

      response.data.operations.forEach((element) => {
        selectedOperationsforEdit.push(element);
      });
      calculatetTotalPriceforEdit();
      console.log(selectedOperationsforEdit);

      selected_proccess_table_edit.addEventListener("click", (e) => {
       
        if (e.target.classList.contains("payment_value")) {
          let index = selectedOperationsforEdit.findIndex(
            (item) =>
              item._id === e.target.parentElement.parentElement.dataset.id
          );
          

          e.target.addEventListener("input", (e) => {
            selectedOperationsforEdit[index].paymentValue = Number(
              e.target.value
            );
            console.log(selectedOperationsforEdit);
            calculatetTotalPriceforEdit();
          });
        }

        if (e.target.classList.contains("delete_items_from_basket")) {
          let index = selectedOperationsforEdit.findIndex(
            (item) =>
              item._id === e.target.parentElement.parentElement.dataset.id
          );
          selectedOperationsforEdit.splice(index, 1);
          e.target.parentElement.parentElement.remove();
          calculatetTotalPriceforEdit();
          console.log(selectedOperationsforEdit);
        }
      });
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
  ".modal_edit_payment  #credit_card_ratio_edit"
);
const paymentCCashRatio = document.querySelector(
  ".modal_edit_payment  #cash_ratio_edit"
);
const paymentUserEdit = document.querySelector(
  ".modal_edit_payment  #payment_user_edit input"
);
const paymentDescriptionEdit = document.querySelector(
  ".modal_edit_payment  #description_for_edit"
);
const editPaymentForm = document.querySelector(
  ".modal_edit_payment #edit-payment-form"
);
const saveEditModal = document.querySelector(
  ".modal_edit_payment .save_update_btn"
);

const selected_proccess_table_edit = document.querySelector(
  ".selected_proccess_table_edit tbody"
);

saveEditModal.addEventListener("click", (e) => {
  
  let data = {
    paymentId: editedPayment,
    cashOrCard: editPaymentForm.cashOrCard.value,
    description: editPaymentForm.description.value,
    operations: selectedOperationsforEdit,
  };
  console.log(data);

  request
    .postWithUrl("./payments/" + editedPayment + "/editPayment", data)
    .then((response) => {
      ui.showModal(true, response.message);
      editPaymentModal.classList.toggle("showed_modal")
      filterPayment()
    })
    .catch((err) => console.log(err));
    e.preventDefault();
});

function handleTableBody(e) {
  const smallModals = document.querySelectorAll(".edit_payment_small_modal");

  if (e.target.classList.contains("edit_payment")) {
    smallModals.forEach((modal) => {
      modal.classList.remove("showed_modal");
    });

    e.target.nextSibling.nextSibling.classList.toggle("showed_modal");
  } else {
    smallModals.forEach((modal) => {
      modal.classList.remove("showed_modal");
    });
  }
}

function addPaymentModalShow() {
  modalPayment.classList.add("showed_modal");
}

function addExpensesModalShow() {
  modalExpenses.classList.add("showed_modal");
}

function cancelAddPayment(e) {
  e.preventDefault();
  modalPayment.classList.remove("showed_modal");
  modalExpenses.classList.remove("showed_modal");
  editPaymentModal.classList.remove("showed_modal");
}

// start date
function startingDate() {
  startDate.valueAsDate = new Date();
  endDate.valueAsDate = new Date();
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
      if (response.operations.length === 0) {
        console.log("burası");
        let opt = document.createElement("option");
        opt.setAttribute("selected", "");
        opt.setAttribute("disable", "");
        opt.setAttribute("hidden", "");
        opt.textContent = "hastaya Ait İşlem Yok";
        operationsSelect.add(opt);

        // remove selected operations from uı
        while (selected_proccess_table.firstChild) {
          console.log("hey");
          selected_proccess_table.firstChild.remove();
        }
        calculatetTotalPrice();
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

        while (selected_proccess_table.firstChild) {
          selected_proccess_table.firstChild.remove();
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

operationsSelect.addEventListener("change", () => {
  selectedOperations.push({
    operationId:
      operationsSelect.options[operationsSelect.options.selectedIndex].dataset
        .id,
    operationPrice: Number(
      operationsSelect.options[operationsSelect.options.selectedIndex].dataset
        .price
    ),
    paymentValue:
      Number(
        operationsSelect.options[operationsSelect.options.selectedIndex].dataset
          .price
      ) -
      Number(
        operationsSelect.options[operationsSelect.options.selectedIndex].dataset
          .paidvalue
      ),
    paidValue: Number(
      operationsSelect.options[operationsSelect.options.selectedIndex].dataset
        .paidvalue
    ),
  });

  console.log(selectedOperations);
  let row = selected_proccess_table.insertRow(0);
  row.setAttribute(
    "data-price",
    operationsSelect.options[operationsSelect.options.selectedIndex].dataset
      .price
  );
  row.setAttribute(
    "data-id",
    operationsSelect.options[operationsSelect.options.selectedIndex].dataset.id
  );
  row.setAttribute(
    "data-value",
    operationsSelect.options[operationsSelect.options.selectedIndex].value
  );
  row.setAttribute(
    "data-paidvalue",
    operationsSelect.options[operationsSelect.options.selectedIndex].dataset
      .paidvalue
  );
  let rowContent = `
                <td>${operationsSelect.options[
                  operationsSelect.options.selectedIndex
                ].textContent.trim()}</td>
                
                <td>
                <input type="number" min="0" value="1" readonly >
                </td>
                

                <td>${
                  operationsSelect.options[
                    operationsSelect.options.selectedIndex
                  ].dataset.paidvalue
                }/${
    operationsSelect.options[operationsSelect.options.selectedIndex].dataset
      .price
  }</td>
                <td>
                <input type="number" class="payment_value" min="0"
                  max="${
                    operationsSelect.options[
                      operationsSelect.options.selectedIndex
                    ].dataset.price -
                    operationsSelect.options[
                      operationsSelect.options.selectedIndex
                    ].dataset.paidvalue
                  }" 
                  placeholder="${
                    operationsSelect.options[
                      operationsSelect.options.selectedIndex
                    ].dataset.price -
                    operationsSelect.options[
                      operationsSelect.options.selectedIndex
                    ].dataset.paidvalue
                  }">TL
                </td>
                
                <td><i class="fa-solid fa-trash delete_items_from_basket"></i></td>
                
                `;

  row.innerHTML = rowContent;

  

  operationsSelect.options[operationsSelect.options.selectedIndex].remove();

  calculatetTotalPrice();
});

function calculatetTotalPrice() {
  console.log("calculating");

  let totalValue = document.querySelector("#total_value");
  let paymentValues = selectedOperations.map((element) => element.paymentValue);

  if (paymentValues.length === 0) {
    totalValue.textContent = 0;
  } else {
    totalValue.textContent = paymentValues.reduce((a, b) => a + b);
  }
}
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

// remove selected operations

selected_proccess_type_add.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-trash")) {
    // add back to selectedbox

    let opt = document.createElement("option");
    opt.setAttribute(
      "data-price",
      e.target.parentElement.parentElement.dataset.price
    );
    opt.setAttribute(
      "data-id",
      e.target.parentElement.parentElement.dataset.id
    );
    opt.setAttribute(
      "value",
      e.target.parentElement.parentElement.dataset.value
    );
    opt.setAttribute(
      "data-paidvalue",
      e.target.parentElement.parentElement.dataset.paidvalue
    );
    opt.textContent = e.target.parentElement.parentElement.dataset.value;

    operationsSelect.add(opt);

    // remove selected options
    let index = selectedOperations.findIndex(
      (item) =>
        item.operationId === e.target.parentElement.parentElement.dataset.id
    );
    selectedOperations.splice(index, 1);

    if (
      selectedOperations.map((element) => element.paymentValue).length !== 0
    ) {
      calculatetTotalPrice();
    } else {
      totalValue.value = 0;
    }
    e.target.parentElement.parentElement.remove();
    console.log(selectedOperations);
    calculatetTotalPrice();
  }

  // //////////////////

  if (e.target.classList.contains("payment_value")) {
    let index = selectedOperations.findIndex(
      (item) =>
        item.operationId === e.target.parentElement.parentElement.dataset.id
    );

    e.target.addEventListener("input", (e) => {
      selectedOperations[index].paymentValue = Number(e.target.value);

      calculatetTotalPrice();
    });
  }
});

// add payment

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
  };
  request
    .postWithUrl("./payments/addPayment", data)
    .then((response) => {
      ui.showModal(true, response.message);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    })
    .catch((err) => {
      ui.showModal(false, err);
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
