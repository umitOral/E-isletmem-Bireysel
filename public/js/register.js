console.log("başarıl");

import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();

const form = document.getElementById("register-form");
console.log(form.authorizedName);

const dialog = document.querySelector("dialog");
const modalMessage = document.querySelector("dialog p");
const terms = document.querySelector("u");
const termsModal = document.querySelector(".terms_modal");
const closeTermsSpan = document.querySelector(".terms_footer span");
const messageModal = document.querySelector(".res-message");

console.log(termsModal);

const closeButton = document.querySelector("dialog span");
console.log(closeButton);
closeButton.addEventListener("click", () => {
  dialog.close();
});

terms.addEventListener("click", () => {
  console.log("başarılı");
  termsModal.classList.add("showed_modal");
});
closeTermsSpan.addEventListener("click", () => {
  console.log("kapandı");
  termsModal.classList.remove("showed_modal");
});

// "Show the dialog" button opens the dialog modally
form.addEventListener("submit", (e) => {
  e.preventDefault();
  messageModal.style="display:block"
  messageModal.textContent="Bekleyiniz..."

  request
    .createCompany(
      {
        email: form.email.value,
        phone: form.phone.value,
        password: form.password.value,
        password2: form.password2.value,
      },
      "./register"
    )
    .then((response) => {
     
      
      console.log(response);
      if (response.success == true) {
        dialog.showModal();
      } else {
        messageModal.textContent = response.message;
      }
    })
    .catch((err) => {
      messageModal.textContent=err.message

      console.log(err);
    });
});


closeButton.addEventListener("click", () => {
  dialog.close();
});
