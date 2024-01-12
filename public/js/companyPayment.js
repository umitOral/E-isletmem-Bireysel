console.log("test1");

import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();

const payButton = document.querySelector(".save_button");
const formData = document.querySelector("form");
const loader = document.querySelector(".loader_wrapper.hidden");
const selectButtons = document.querySelectorAll(".select_packet");

const paymentValue = document.querySelector(".total");

payButton.addEventListener("click", addPaymentRequest);

selectButtons.forEach((element) => {
  element.addEventListener("click", () => {
    paymentValue.textContent = element.parentElement.dataset.price;
    paymentValue.dataset.type = element.parentElement.dataset.type;
    paymentValue.dataset.paymentDuration =
      element.parentElement.dataset.paymentduration;
    selectButtons.forEach((element) => {
      element.parentElement.parentElement.classList.remove("selected");
    });
    element.parentElement.parentElement.classList.toggle("selected");
  });
});

function addPaymentRequest(e) {
  e.preventDefault();

  let data = {
    cardUserName: formData.cardUserName.value,
    cardNumber: formData.cardNumber.value,
    expireMonth: formData.expireMonth.value,
    expireYear: formData.expireYear.value,
    cvc: formData.cvc.value,
    paymentDuration: paymentValue.dataset.paymentDuration,
    //

    type: paymentValue.dataset.type,
    price: paymentValue.textContent,
  };

  if (paymentValue.innerHTML === "0") {
    ui.showModalWithoutResponse(false, "Lütfen  paket seçiniz");
  } else {
    
    request
      .postWithUrl("./addCompanyPayment", data)
      .then((response) => {
        console.log(response);

        if (response.success === false) {
          ui.showModal(false, response.result.errorMessage);
        } else {
          ui.showModal(true, response.message);
          var URL = response.data;

         
          window.open(response.data, "_blank");
          
        }
      })

      .catch((err) => {
        ui.showModal(false, err);
      });
  }
}

// formData.cardNumber.addEventListener("input", () => {
//   let data = {
//     cardInformations:formData.cardNumber.value,
//     price: 2400,
//   };
//   if (formData.cardNumber.value.length === 6) {
//     request
//       .postWithUrl("./getInstallment", data)
//       .then((response) => {
//         console.log(response);
//       })
//       .catch(err=>{console.log(err)});
//   }
// });
