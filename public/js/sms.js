import { Request } from "./requests.js";
import { UI } from "./ui.js";

const request = new Request();
const ui = new UI();
ui.closeNotification();

const cancelBtns = document.querySelectorAll(".cancel.form-btn");
const priceInputs = document.querySelectorAll(".changable_inputs");
const saveButtons = document.querySelectorAll(".input_save_buttons");
const addSmsButton = document.querySelector("#add_sms_btn");
const modalSmsAdd = document.querySelector("#add_sms_modal");

const addSmsForm = document.querySelector("#add-sms-form");

addSmsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = {
    smsName: addSmsForm.smsName.value,
    content: addSmsForm.content.value,
  };
  request
    .postWithUrl("./sms/addSmsTemplate", data)
    .then((response) => {
      ui.showNotification(response.success, response.message);
      console.log(response);
      addSmsForm.reset();
      modalSmsAdd.classList.add("hidden");
      setTimeout(() => {
        window.location.reload()
      }, 500);
    })
    .catch((err) => {
      ui.showNotification(err.success, err.message);
      console.log(err);
    });
});

saveButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const newContent = button.previousElementSibling.value;
    let data = {
      content: newContent,
    };
    request
      .postWithUrl(
        "./sms/" +
          button.parentElement.parentElement.parentElement.dataset.smsid +
          "/editSmsTemplate",
        data
      )
      .then((response) => {
        console.log(response);
        ui.showNotification(response.success, response.message);
        button.classList.remove("showed");
      })
      .catch((err) => ui.showNotification(false, err));
  });
});

priceInputs.forEach((input) => {
  input.addEventListener("input", () => {
    console.log("haho");
    input.nextElementSibling.classList.add("showed");
  });
});



//modal actions

addSmsButton.addEventListener("click", showModalAddSms);

cancelBtns.forEach((element) => {
  element.addEventListener("click", () => {
    ui.closeAllModals();
  });
});

function showModalAddSms() {
  modalSmsAdd.classList.remove("hidden");
}
