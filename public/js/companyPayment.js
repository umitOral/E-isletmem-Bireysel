console.log("test1");

import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();

const payButton = document.querySelector(".save_button");
const formData = document.querySelector("form");
const loader = document.querySelector(".loader_wrapper.hidden");




const paymentValue = document.querySelector(".price");

payButton.addEventListener("click", addPaymentRequest);

function addPaymentRequest(e) {
  e.preventDefault();
  loader.classList.toggle("showed");
  let data = {
    cardUserName: formData.cardUserName.value,
    cardNumber: formData.cardNumber.value,
    expireMonth: formData.expireMonth.value,
    expireYear: formData.expireYear.value,
    cvc: formData.cvc.value,
    price: paymentValue.textContent.slice(0, -5),
  };

  request
    .postWithUrl("./addCompanyPayment", data)
    .then((response) => {
      console.log(response);
      
      loader.classList.remove("showed");
      if (response.result.status==="success") {
        ui.createResponseModal(response.message,"success");
      } else{
        ui.createResponseModal(response.result.errorMessage,"failure");

      }
      const closeModal = document.querySelectorAll(".response_modal div i");
      closeModal.forEach(element => {
        element.addEventListener("click",function (e) {
            console.log("sil")
            e.target.parentElement.remove()
        })
    });

    })

    .catch((err) => {
      ui.createResponseModal(err);
    });
}



