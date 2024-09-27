import { Print } from "./inner_modules/print.js";
const print = new Print();
import { Tables } from "./inner_modules/tables.js";
const tables = new Tables();
import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();
ui.closeNotification()

const modalPayment = document.querySelector("#modal_payment");
const modalExpenses = document.querySelector("#expenses_payment");
const filterPaymentsButton = document.querySelector(".payments-filter-button");
const addPaymentButton = document.querySelector(".payments-add-button");
const addExpensesButton = document.querySelector(".expenses-add-button");
const cancelButtons = document.querySelectorAll(".cancel");

const editPaymentModal = document.querySelector("#modal_edit_payment");
const totalValue = document.querySelector("#total_value");

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
const paymentsTable = document.querySelector("#payments_table");

const startDate = document.querySelector(".startDate");
const endDate = document.querySelector(".endDate");


const paymentTable = document.querySelector("#payments_table");

let selectedOperationsforEdit = [];
let editedPayment = "";

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

cancelButtons.forEach((element) => {
  element.addEventListener("click",()=>{
    ui.closeAllModals()
  })
 
});

 function filterPayment() {
  console.log("2")
   request
    .getwithUrl(
      `/admin/payments/getSearchedPayments?startDate=${startDate.value}&endDate=${endDate.value}`
    )
    .then((response) => {
      console.log("3")
      console.log(response);
      ui.showAllPaymensToUI(response);
    })
    .catch((err) => console.log(err));
    
}

function filterPaymentStartPage() {
  console.log(startDate.value)
  console.log(endDate.value)
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
const saveEditModal = document.querySelector(
  "#modal_edit_payment #save_update_btn"
);

const selected_proccess_table_edit = document.querySelector(
  ".selected_proccess_table_edit tbody"
);

saveEditModal.addEventListener("click",(e) => {
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
      console.log("1")
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
let newDate=new Date()
console.log(newDate)

  startDate.value = newDate.toISOString().substr(0, 10);
  
  endDate.value =startDate.value;
 
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
       data-id="${selectedOption.dataset.id}">

      <td>${selectedOption.textContent.trim()}</td>
                
      <td>
      <input class="tdInputs deactive" type="number" min="0" value="1" readonly >
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
  <tr/>
`;

  selectedOption.remove();

  calculatetTotalPrice();
});

function calculatetTotalPrice() {
  console.log("calculating");
  console.log(selectedOperations);
  let totalValue = document.querySelector("#total_value");
  let paymentValues = selectedOperations.map((element) => element.paymentValue);

  if (paymentValues.length === 0) {
    totalValue.textContent = 0;
  } else {
    totalValue.textContent = paymentValues.reduce((a, b) => a + b).toFixed();
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
});

selected_proccess_type_add.addEventListener("input", (e) => {
  if (e.target.classList.contains("payment_value")) {
    let index = selectedOperations.findIndex(
      (item) =>
        item.operationId === e.target.parentElement.parentElement.dataset.id
    );

    selectedOperations[index].paymentValue = Number(e.target.value);

    calculatetTotalPrice();
  }
});

selected_proccess_table_edit.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete_items_from_basket")) {
    let index = selectedOperationsforEdit.findIndex(
      (item) => item._id === e.target.parentElement.parentElement.dataset.id
    );
    selectedOperationsforEdit.splice(index, 1);
    e.target.parentElement.parentElement.remove();
    calculatetTotalPriceforEdit();
    console.log(selectedOperationsforEdit);
  }
});

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
      console.log(response)
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
