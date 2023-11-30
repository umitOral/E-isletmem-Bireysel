console.log("byra");
import { Request } from "./requests.js";

const request = new Request();

const saveButtons = document.querySelectorAll(".save_buttons");
console.log(saveButtons)
const priceInputs = document.querySelectorAll(".price_inputs");
const messageBox = document.querySelector(".information-modal")

priceInputs.forEach((input) => {
  input.addEventListener("input", () => {
    console.log("dada")
    input.nextElementSibling.classList.add("showed");
  });
});

saveButtons.forEach((button) => {
  button.addEventListener("click", ()=>{
    console.log("tıklandı")
    
    const newPrice=button.previousElementSibling.value
    console.log(button.parentElement.dataset.servicesid)
    
    let data={
        servicePrice:newPrice
    }
    request.postWithUrl("./services/"+button.parentElement.dataset.servicesid+"/editService",data)
    .then((response)=>{
        if (response.succes==false) {
            messageBox.classList.add("failure")
        }else{
            messageBox.classList.add("success")
        }
            messageBox.textContent=response.message
            messageBox.style.display="block"
            button.classList.remove("showed")
            setTimeout(() => {
                messageBox.style.display="none"
            }, 3000);
    })
    .catch(err=>console.log(err));
  });
});



//modal actions

const addServicesButton = document.querySelector(".add_service_btn")
const modalServiceCancel = document.querySelector(".cancel_button")
const modalServiceAdd = document.querySelector(".add_service")
console.log(modalServiceCancel)

addServicesButton.addEventListener("click", showModalAddServices)
modalServiceCancel.addEventListener("click", closeModalAddService)

function showModalAddServices() {
    modalServiceAdd.classList.add("showed_modal")
}
function closeModalAddService() {
    modalServiceAdd.classList.remove("showed_modal")
}

