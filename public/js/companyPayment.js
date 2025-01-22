console.log("test1");

import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();
ui.closeNotification();

const addEmployeeBtn = document.querySelector("#add_employee_btn");
const formAddSubscription = document.querySelector("#add_subscription");
const formAddEmployee = document.querySelector("#add_employe_to_subscription");
const totalValueAddEmployee = document.querySelector("#total_value_add_employee");
const warningPopup = document.querySelector(".warning_popup_wrapper")
const warningPopupMessage = document.querySelector("#popup_message")
const warningPopupMessageExtra = document.querySelector("#popup_message_extra")
const closePopUp = document.querySelector("#close_warning_popUp")

const cancelBtns= document.querySelectorAll(".cancel.form-btn");

const modalAddEmployee = document.querySelector(".add_employee.modal");
const modalAddPayment = document.querySelector("#add_payment");
const modalAddPaymentInner = document.querySelector(
  ".inner_modal .payment_body"
);
const closeModal = document.querySelector(".close_modal");

const loader = document.querySelector(".loader_wrapper.hidden");
const paymentValue = document.querySelector("#payment_value");
const paymentValueAddEmployee = document.querySelector("#payment_value_for_add_employee");
const userCount = document.querySelector("#userCount");
const userCountAddEmployee = document.querySelector("#userCountAddEmployee");
const mounthCount = document.querySelector("#mounthCount");
const remainingDays = document.querySelector("#remainingDays");

formAddSubscription.addEventListener("submit", addPaymentRequest);
formAddEmployee.addEventListener("submit", addEmployeeRequest);
addEmployeeBtn.addEventListener("click", ()=>{
  console.log("add employee");
  calculateTotalPaymentAddEmployee();
  modalAddEmployee.classList.remove("hidden");
  
});

function addPaymentRequest(e) {
  e.preventDefault();

  let data = {
    type: "subscription",
    price: Number(paymentValue.textContent),
    paymentDuration:
      mounthCount.options[mounthCount.options.selectedIndex].value,
    userCount: Number(userCount.value),
  };
  loader.classList.toggle("showed");
  request
    .postWithUrl("./addCompanyPayment", data)
    .then((response) => {
      console.log(response);

      if (response.success === true) {
        console.log("burası");
        // window.open(response.data, "_blank");
        loader.classList.toggle("showed");

        const iframe = document.createElement("iframe");

        // Iframe özelliklerini ayarla
        iframe.id = "dynamicIframe";
        iframe.src = response.data.paymentPageUrl; // Hedef URL
        iframe.width = "100%"; // Genişlik
        iframe.height = "600px"; // Yükseklik
        iframe.style.border = "1px solid #ccc"; // Kenarlık ekle

        // Iframe'i DOM'a ekle
        modalAddPaymentInner.innerHTML = "";
        modalAddPaymentInner.appendChild(iframe);

        modalAddPayment.classList.remove("hidden");
      }else{
        loader.classList.toggle("showed");
        warningPopup.classList.add("showed")
        warningPopupMessage.textContent=response.message
        warningPopupMessageExtra.innerHTML=`
          <a class="btn-link save" href="${response.data}">Ayarlara Git</a>
        `
      }

    })

    .catch((err) => {
      loader.classList.remove("showed");
      console.log(err);
      ui.showNotification(false, err);
    });
}
function addEmployeeRequest(e) {
  e.preventDefault();

  let data = {
    type: "User_Purchase",
    price: Number(totalValueAddEmployee.textContent),
    userCount: Number(userCountAddEmployee.value),
  };
  loader.classList.toggle("showed");
  request
    .postWithUrl("./addEmployeeToSubscription", data)
    .then((response) => {
      console.log(response);

      if (response.success === true) {
        console.log("burası");
        // window.open(response.data, "_blank");
        loader.classList.toggle("showed");

        const iframe = document.createElement("iframe");

        // Iframe özelliklerini ayarla
        iframe.id = "dynamicIframe";
        iframe.src = response.data.paymentPageUrl; // Hedef URL
        iframe.width = "100%"; // Genişlik
        iframe.height = "600px"; // Yükseklik
        iframe.style.border = "1px solid #ccc"; // Kenarlık ekle

        // Iframe'i DOM'a ekle
        modalAddPaymentInner.innerHTML = "";
        modalAddPaymentInner.appendChild(iframe);

        modalAddPayment.classList.remove("hidden");
        modalAddEmployee.classList.add("hidden");
      }else{
        loader.classList.toggle("showed");
        warningPopup.classList.add("showed")
        warningPopupMessage.textContent=response.message
      }
    })

    .catch((err) => {
      loader.classList.remove("showed");
      console.log(err);
      ui.showNotification(false, err);
    });
}


userCount.addEventListener("change", function () {
  calculateTotalPayment();
});
userCountAddEmployee.addEventListener("change", function () {
  calculateTotalPaymentAddEmployee();
});

mounthCount.addEventListener("change", function () {
  calculateTotalPayment();
});

function calculateTotalPayment() {
  let basePrice = 750;

  let total = basePrice + 250 * (userCount.value - 1);

  paymentValue.textContent =
    total * mounthCount.options[mounthCount.options.selectedIndex].value;
}
function calculateTotalPaymentAddEmployee() {
  let singleDayPrice = 250/30;
  let remainingDay = Number(remainingDays.textContent);

  let total = remainingDay*singleDayPrice * (userCountAddEmployee.value);

  totalValueAddEmployee.textContent = total.toFixed(0);
}

closeModal.addEventListener("click", () => {
  modalAddPayment.classList.add("hidden");
});


cancelBtns.forEach(element => {
  element.addEventListener("click", () => {
    ui.closeAllModals()
  })
});

closePopUp.addEventListener("click",()=>{
  warningPopup.classList.toggle("showed")
})