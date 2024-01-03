import { UI } from "./ui.js";
const ui = new UI();
import { Request } from "./requests.js";
const request = new Request();

const savebutton = document.querySelector(".save_button");
const form = document.querySelector("#register-form");

eventListeners();
function eventListeners() {
  form.addEventListener("submit", createEmployee);
}

function createEmployee(e) {
  e.preventDefault();
  let formData = {
    name: form.name.value,
    surname: form.surname.value,
    email: form.email.value,
    password: form.password.value,
    role: form.role.options[form.role.selectedIndex].value,
    sex: form.sex.value,
    birtdhDate: form.birtdhDate.value,
    address: form.address.value,
    billingAddress: form.billingAddress.value,
    phone: form.phone.value,
  };

  request
    .postWithUrl("./employees/createEmployee", formData)
    .then((response) => {
      if (response.success === true) {
        ui.showModal(true, response.message);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        ui.showModal(false, response.message);
      }
    })
    .catch((err) => console.log(err));
}

const addCustomerButton = document.querySelector(".add_customer_btn");
const modalCustomerAdd = document.querySelector(".add_customer");
const modalCustomerCancel = document.querySelector(".cancel_button");

addCustomerButton.addEventListener("click", showModalAddCostumer);
modalCustomerCancel.addEventListener("click", closeModalAddCostumer);

function showModalAddCostumer() {
  modalCustomerAdd.classList.add("showed_modal");
}
function closeModalAddCostumer() {
  modalCustomerAdd.classList.remove("showed_modal");
}


const adminColumn=document.querySelector("#userList")
console.log(adminColumn.children[0].children[5])
adminColumn.children[0].children[5].firstChild.style=`
pointer-events: none !important;
cursor: default;
color:Gray;
`

