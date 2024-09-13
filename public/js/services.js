
import { Request } from "./requests.js";
import {UI} from './ui.js'


const request = new Request();
const ui = new UI();


const saveButtons = document.querySelectorAll(".input_save_buttons");
const informationModalWrapper = document.querySelector(".information-modal-wrapper");


const cancelButtonModal = document.querySelectorAll(".cancel_button");


const priceInputs = document.querySelectorAll(".price_inputs");


priceInputs.forEach((input) => {
  input.addEventListener("input", () => {
    
    input.nextElementSibling.classList.add("showed");
  });
});

saveButtons.forEach((button) => {
  button.addEventListener("click", ()=>{
    closebtnshandle()
    const newPrice=button.previousElementSibling.value
    
    let data={
        servicePrice:newPrice
    }
    request.postWithUrl("./services/"+button.parentElement.dataset.servicesid+"/editService",data)
    .then((response)=>{
      console.log(response)
        ui.showModal(response.success,response.message)
        button.classList.remove("showed");
    })
    .catch(err=>ui.showModal(false,err));
  });
});

function closebtnshandle() {
  
  informationModalWrapper.addEventListener("click",(e)=>{
    if (e.target.classList.contains("fa-xmark")) {
      e.target.parentElement.remove()
    }
  })
}



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


