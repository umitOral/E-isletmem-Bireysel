console.log("başarıl");

import { Request } from "./requests.js";
const request = new Request();
const form = document.getElementById("register-form");
console.log(form.authorizedName);



const dialog = document.querySelector("dialog");
const modalMessage = document.querySelector("dialog p");


const closeButton = document.querySelector("dialog span");
console.log(closeButton)
closeButton.addEventListener("click",()=>{
  dialog.close()
})


// "Show the dialog" button opens the dialog modally
form.addEventListener("submit", (e) => {
    e.preventDefault()
  request.createCompany(
    {
      authorizedName: form.authorizedName.value,
      email: form.email.value,
      phone: form.phone.value,
      aaaa:"aaa",
      password: form.password.value,
      password2: form.password2.value,
    },
    "./register"
  ).then(response=>{
    dialog.showModal();
    console.log(response)
    if (response.succes==true) {
      modalMessage.textContent=response.message
      
    }else{
      modalMessage.textContent=response.message
      
    }
    
    
  })
  .catch(err=>{console.log(err)});
});


// "Close" button closes the dialog
// closeButton.addEventListener("click", () => {
//   dialog.close();
// });
