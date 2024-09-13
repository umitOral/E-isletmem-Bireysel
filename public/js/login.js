console.log("dada");

import { Request } from "./requests.js";
const request = new Request();

const loginForm = document.querySelector("#login-form");
const messageModal = document.querySelector(".res-message");
const successPopup = document.querySelector(".success_popup_wrapper")

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  messageModal.style="display:none"
  messageModal.textContent=""
  let data={
    email:loginForm.email.value,
    password:loginForm.password.value,
  }
  request
    .postWithUrl("./login",data)
    .then((response) => {
      console.log(response)
      
        if (response.success==true) {
          successPopup.classList.add("showed")
            setTimeout(() => {
                window.location.assign("/admin")
            }, 1500);
        }else{
          messageModal.style="display:block"
          messageModal.textContent=response.message
        }
    })
    .catch((err) => {
      console.log(err);
      messageModal.style="display:block"
      messageModal.textContent=response.message
    });
});
