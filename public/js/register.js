console.log("başarıl");

import { Request } from "./requests.js";
const request = new Request();

const form = document.getElementById("register-form");
const termsAndContidions = document.querySelector("#terms_conditions");
const loader = document.querySelector(".loader_wrapper.hidden");
const terms_checkbox = document.getElementById("termsConditionsCheckbox");
const acceptBtn = document.getElementById("accept_terms");
const alertMessage = document.querySelector(".res-message");
const successPopup = document.querySelector(".success_popup_wrapper")
const g_recaptcha = document.querySelector(".g-recaptcha")


termsAndContidions.addEventListener("click", () => {
  console.log("başarılı");
  termsModal.classList.add("showed_modal");
});


acceptBtn.addEventListener("click", () => {
  console.log("kabul edildi");
  terms_checkbox.checked = true
  
});
terms_checkbox.addEventListener("change", () => {
  console.log("haho");
  g_recaptcha.style.display="block"
  
});

// "Show the dialog" button opens the dialog modally
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // 
  loader.classList.toggle("showed");
  // recaptcha token creating
  const captchaResponse = grecaptcha.getResponse()
  // get form datas
  const fd = new FormData(e.target)
  const params = new URLSearchParams(fd)

  request.postWithUrlformData("/register",params)
    .then(response => {
      console.log(response)
      loader.classList.toggle("showed");
      if (response.success===true) {
        alertMessage.classList.add("d-none")
        successPopup.style.display = "block";
      } else {
        // showing errors
        alertMessage.classList.remove("d-none")
          alertMessage.textContent=response.message
      }
    })
    .catch(err =>{
      alertMessage.classList.remove("d-none")
      alertMessage.textContent=err.message
      console.log(err)})

});



