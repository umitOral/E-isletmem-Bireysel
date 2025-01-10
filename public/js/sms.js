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
const smsContent = document.querySelector("#sms-content");
const remainingText = document.querySelector("#remaining");

const addSmsForm = document.querySelector("#add-sms-form");

addSmsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (remainingText.textContent < 10) {
    ui.showNotification(false, "Karakter sınırını aştınız");
    return
  }
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

smsContent.addEventListener("keyup", (e) => {
  let maksChar=calculateRemainingText(e.target.value);

  remainingText.textContent = maksChar;
})


function calculateRemainingText  (textAreaValue) {
  const turkishChar=["ç", "ğ" , "ı" ,"ş" , "Ğ" , "İ" , "Ş" , "Ç"]
  let maksChar=155

  textAreaValue.split("").forEach((char) => {
    if (turkishChar.includes(char)) {
      maksChar -= 2;
    }else{
      maksChar-=1
    }
  })
  return maksChar
};

saveButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const newContent = button.previousElementSibling.value;
    let credit= button.parentElement.parentElement.parentElement.children[2].children[0].children[0].value
    if (credit > 140) {
      ui.showNotification(false, "karakter sınırını aştınız");
      return;
    }
    let data = {
      content: newContent,
      credit:credit
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
  input.addEventListener("input", (e) => {
    console.log("haho");
    input.nextElementSibling.classList.add("showed");
    let result=calculateRemainingText(e.target.value,input);
    input.parentElement.parentElement.parentElement.children[2].children[0].children[0].value=155-result
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
