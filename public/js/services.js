
import { Request } from "./requests.js";
import {UI} from './ui.js'


const request = new Request();
const ui = new UI();


const saveButtons = document.querySelectorAll(".input_save_buttons");
const cancelButtonModal = document.querySelectorAll(".cancel_button");

const priceInputs = document.querySelectorAll(".price_inputs");
const messageBox = document.querySelector(".information-modal")

priceInputs.forEach((input) => {
  input.addEventListener("input", () => {
    
    input.nextElementSibling.classList.add("showed");
  });
});

saveButtons.forEach((button) => {
  button.addEventListener("click", ()=>{
   
    const newPrice=button.previousElementSibling.value
    
    let data={
        servicePrice:newPrice
    }
    request.postWithUrl("./services/"+button.parentElement.dataset.servicesid+"/editService",data)
    .then((response)=>{
        ui.showModal(true,response.message)
        button.classList.remove("showed");
    })
    .catch(err=>ui.showModal(false,err));
  });
});



//modal actions

const addServicesButton = document.querySelector("#add_service_btn")

const allModals = document.querySelectorAll(".modal")

const modalCancelBtn= document.querySelectorAll(".cancel_button")
const modalServiceAdd = document.querySelector(".add_service")



addServicesButton.addEventListener("click", showModalAddServices)

modalCancelBtn.forEach(element => {
  element.addEventListener("click", closeModal)
});


function showModalAddServices() {
  allModals.forEach(element => {
    element.classList.remove("showed_modal")
  });
    modalServiceAdd.classList.add("showed_modal")
}


function closeModal(e) {
  e.preventDefault()
  allModals.forEach(element => {
    element.classList.remove("showed_modal")
  });
    
}


