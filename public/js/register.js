console.log("başarıl");

import { Request } from "./requests.js";
const request = new Request();

const form = document.getElementById("register-form");
console.log(form.authorizedName);



const dialog = document.querySelector("dialog");
const modalMessage = document.querySelector("dialog p");
const terms = document.querySelector("u");
const termsModal = document.querySelector(".terms_modal");
const closeTermsSpan = document.querySelector(".terms_footer span");

console.log(termsModal)

const closeButton = document.querySelector("dialog span");
console.log(closeButton)
closeButton.addEventListener("click",()=>{
  dialog.close()
})

terms.addEventListener("click",()=>{
  console.log("başarılı")
  termsModal.classList.add("showed_modal")
})
closeTermsSpan.addEventListener("click",()=>{
  console.log("kapandı")
  termsModal.classList.remove("showed_modal")
})

// "Show the dialog" button opens the dialog modally
form.addEventListener("submit", (e) => {
    e.preventDefault()
  request.createCompany(
    {
      
      email: form.email.value,
      phone: form.phone.value,
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
