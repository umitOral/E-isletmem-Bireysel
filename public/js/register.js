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
const loader = document.querySelector(".loader_wrapper.hidden");
const terms_checkbox = document.getElementById("terms_checkbox");




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
  terms_checkbox.checked = true
  termsModal.classList.remove("showed_modal");
});

// "Show the dialog" button opens the dialog modally
form.addEventListener("submit", (e) => {
  e.preventDefault();
  // modal ressetting
  messageModal.style="display:none"
  messageModal.textContent = "";
  // 
  loader.classList.toggle("showed");
  // recaptcha token creating
  const captchaResponse = grecaptcha.getResponse()
  // get form datas
  const fd = new FormData(e.target)
  const params = new URLSearchParams(fd)

  fetch("./register", {
    method: "POST",
    body: params
  }).then(res => res.json())
    .then(data => {
      loader.classList.toggle("showed");
      if (data.createSuccess) {
        dialog.showModal();
      } else {
        // showing errors
        messageModal.style = "display:block"
        messageModal.textContent = data.message;
      }
    })
    .catch(err =>{
      messageModal.textContent=err.message
      console.log(err)})

});


closeButton.addEventListener("click", () => {
  dialog.close();
});
