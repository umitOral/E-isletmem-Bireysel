console.log("dada");

import { Request } from "./requests.js";
const request = new Request();

const loginForm = document.querySelector("#login-form");
const messageModal = document.querySelector(".res-message");
const tokenDiv = document.querySelector(".token-area");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  let data={
    password:loginForm.password.value,
    password2:loginForm.password2.value
    
  }
  request
    .postWithUrl("/newPassword/"+tokenDiv.textContent.trim(),data)
    .then((response) => {
      console.log(response)
      messageModal.style.display="block"
      messageModal.textContent=response.message
      if (response.succes==="true") {
        messageModal.textContent="Başarılı giriş sayfasına yönlendiriliyorsunuz ..."
      }
      setTimeout(() => {
        location.href="../login"
      }, 2000);
    })
    .catch((err) => {
      console.log(err);
      
    });
});
