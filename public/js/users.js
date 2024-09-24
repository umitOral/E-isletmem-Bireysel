import { UI } from "./ui.js";
const ui = new UI();
import { Request } from "./requests.js";
const request = new Request();
ui.closeNotification()
ui.deleteZeroFromPhone()

const savebutton = document.querySelector(".save_button");
const allModals = document.querySelectorAll(".modal");
const cancelButtons = document.querySelectorAll(".cancel");
const form = document.querySelector("#register-form");


eventListeners();
function eventListeners() {
  form.addEventListener("submit", createUser);
  
}


cancelButtons.forEach(element => {
  element.addEventListener( "click",()=>{
    allModals.forEach(element => {
      element.classList.add("hidden")
    });
  })
});

function createUser(e) {
  e.preventDefault();
  let formData = {
    name: form.name.value,
    surname: form.surname.value,
    email: form.email.value,
    phone:form.phone.value,
    sex: form.sex.value,
    birtdhDate: form.birtdhDate.value,
    address: form.address.value,
    billingAddress: form.billingAddress.value,
  };
console.log(form.getAttribute("action"))
  request
    .postWithUrl(form.getAttribute("action"), formData)
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


const addCustomerButton = document.querySelector(".add_customer_btn")
const modalCustomerAdd = document.querySelector("#add_customer")


addCustomerButton.addEventListener("click",()=>modalCustomerAdd.classList.remove("hidden"))


