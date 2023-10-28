console.log("dada");

import { Request } from "./requests.js";
const request = new Request();

const loginForm = document.querySelector("#login-form");
const messageModal = document.querySelector(".res-message");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data={
    email:loginForm.email.value,
    password:loginForm.password.value,
  }
  request
    .postWithUrl("./login",data)
    .then((response) => {
      
      messageModal.style="display:block"
      messageModal.textContent=response.message
        if (response.success==true) {
            setTimeout(() => {
                window.location.assign("/admin")
            }, 1000);
        }
    })
    .catch((err) => {
      console.log(err);
      
    });
});
