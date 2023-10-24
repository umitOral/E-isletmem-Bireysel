console.log("dada");

import { Request } from "./requests.js";
const request = new Request();

const loginForm = document.querySelector("#login-form");
const messageModal = document.querySelector(".res-message");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data={
    email:loginForm.email.value,
    
  }
  request
    .postWithUrl("./forgotPassword",data)
    .then((response) => {
      messageModal.style.display="block"
      messageModal.textContent=response.message
    })
    .catch((err) => {
      
      console.log(err);
      
    });
});
