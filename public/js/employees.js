import { UI } from "./ui.js";
const ui = new UI();
import { Request } from "./requests.js";
const request = new Request();
ui.closeNotification();
ui.deleteZeroFromPhone();

const form = document.querySelector("#register-form");
const allModals = document.querySelectorAll(".modal");
const cancelButtons = document.querySelectorAll(".cancel");
const activateBtns = document.querySelectorAll(".activate_employee");

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
    sex: form.sex.value,
    birthDate: form.birthDate.value,
    address: form.address.value,
    billingAddress: form.billingAddress.value,
    phone: form.phone.value,
  };

  request
    .postWithUrl("./employees/createEmployee", formData)
    .then((response) => {
      if (response.success === true) {
        ui.showNotification(true, response.message);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        ui.showNotification(false, response.message);
      }
    })
    .catch((err) => console.log(err));
}

const addCustomerButton = document.querySelector(".add_customer_btn");
const modalCustomerAdd = document.querySelector("#add_customer");

addCustomerButton.addEventListener("click", showModalAddCostumer);
cancelButtons.forEach((element) => {
  element.addEventListener("click", () => {
    allModals.forEach((element) => {
      element.classList.add("hidden");
    });
  });
});

activateBtns.forEach((element) => {
  element.addEventListener("click", () => {
    request.getwithUrl(
      `./users/${element.parentElement.parentElement.dataset.employeeid}/activateEmployee`
    )
    .then(response=>{
      console.log(response)
      if (response.success===true) {
        ui.showNotification(response.success,response.message)
        setTimeout(() => {
          window.location.reload()
        }, 500);
        
      } else {
        ui.showWarningPopUp(response.message,response.data)
      }
      
    })
    .catch(err=>console.log(err))
  });
});

function showModalAddCostumer() {
  modalCustomerAdd.classList.remove("hidden");
}

const adminColumn = document.querySelector("#userList");

adminColumn.children[0].children[5].firstChild.style = `
pointer-events: none !important;
cursor: default;
color:Gray;
`;
