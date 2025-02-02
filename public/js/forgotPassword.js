console.log("dada");

import { Request } from "./requests.js";
const request = new Request();

const loginForm = document.querySelector("#new-password-form");

const alertMessage = document.querySelector(".res-message");
const helperContetn = document.querySelector("#helper-content");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data={
    email:loginForm.email.value,
    
  }
  request
    .postWithUrl("./forgotPassword",data)
    .then((response) => {
      console.log(response)
      alertMessage.textContent=response.message
      alertMessage.classList.remove("d-none")
      if (response.success===true) {
        console.log("haho")
        alertMessage.classList.remove("alert-danger")
        alertMessage.classList.add("alert-success")
        helperContetn.style.display="none"
      } else {
        console.log("haho1")
        alertMessage.classList.add("alert-danger")
        helperContetn.style.display="block"
      }
   
    })
    .catch((err) => {
      
      console.log(err);
      
    });
});
