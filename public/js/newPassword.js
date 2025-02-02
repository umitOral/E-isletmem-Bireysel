console.log("dada");

import { Request } from "./requests.js";
const request = new Request();

const newPasswordForm = document.querySelector("#new-password-form");
const alertMessage = document.querySelector(".res-message");
const successPopup = document.querySelector(".success_popup_wrapper")

newPasswordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  let data={
    password:newPasswordForm.password.value,
    password2:newPasswordForm.password2.value
    
  }
  request
    .postWithUrl(newPasswordForm.action,data)
    .then((response) => {
      console.log(response)
      if (response.success===true) {
        successPopup.style.display="block"
      } else {
        alertMessage.classList.remove("d-none")
        alertMessage.innerHTML=`${response.message}`
        if (response.data) {
          alertMessage.innerHTML+=`<a href="${response.data}">Şifre sıfırlama Sayfası</a>`
        }
      }
      
    
    })
    .catch((err) => {
      console.log(err);
      
    });
});
