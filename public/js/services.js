
import { Request } from "./requests.js";
import { UI } from './ui.js'

const request = new Request();
const ui = new UI();
ui.closeNotification()


const saveButtons = document.querySelectorAll(".input_save_buttons");
const cancelBtns= document.querySelectorAll(".cancel.form-btn");
const priceInputs = document.querySelectorAll(".price_inputs");


priceInputs.forEach((input) => {
  input.addEventListener("input", () => {
console.log("haho")
    input.nextElementSibling.classList.add("showed");
  });
});

saveButtons.forEach((button) => {
  button.addEventListener("click", () => {

    const newPrice = button.previousElementSibling.value

    let data = {
      servicePrice: newPrice
    }
    request.postWithUrl("./services/" + button.parentElement.dataset.servicesid + "/editService", data)
      .then((response) => {
        console.log(response)
        ui.showNotification(response.success, response.message)
        button.classList.remove("showed");
      })
      .catch(err => ui.showNotification(false, err));
  });
});




//modal actions

const addServicesButton = document.querySelector("#add_service_btn")
const modalServiceAdd = document.querySelector("#add_service")



addServicesButton.addEventListener("click", showModalAddServices)

cancelBtns.forEach(element => {
  element.addEventListener("click", () => {
    ui.closeAllModals()
  })
});


function showModalAddServices() {
  modalServiceAdd.classList.remove("hidden")
}




