import { UI } from "./ui.js";
const ui = new UI();
ui.closeNotification();

const showContentsBtns = document.querySelectorAll(".show-content");
const contents = document.querySelectorAll(".userInformationsContent");
const userID = document.querySelector(".userID").dataset.user;
const loader = document.querySelector(".loader_wrapper.hidden");

const editBtn = document.querySelector(".edit-informations-btn");
const changePassworForm = document.getElementById("change-password-form");
const formUpdateSmsConfig = document.getElementById("update-smsConfig-form");
const addDocBtns = document.querySelectorAll(".add_doc");

const informationForm = document.getElementById("informations-form");
const cancelBtns = document.querySelectorAll(".cancel.form-btn");

// modals
const modalUser = document.querySelector("#modal_user");

import { Request } from "./requests.js";
const request = new Request();

eventListeners();

function eventListeners() {
  editBtn.addEventListener("click", () => modalUser.classList.remove("hidden"));
  changePassworForm.addEventListener("submit", changePassword);
  formUpdateSmsConfig.addEventListener("submit", UpdateSmsConfig);

  informationForm.addEventListener("submit", changeInformations);
}

cancelBtns.forEach((element) => {
  element.addEventListener("click", () => {
    ui.closeAllModals();
  });
});

function changePassword(e) {
  e.preventDefault();

  request
    .postWithUrl("./settings/" + userID + "/updateCompanyPassword", {
      password: changePassworForm.password.value,
      password2: changePassworForm.password2.value,
    })
    .then((response) => {
      ui.showNotification(true, response.messageBox);
      changePassworForm.password.value = "";
      changePassworForm.password2.value = "";
    })
    .catch((err) => console.log("hata:" + err));
}
function changeInformations(e) {
  e.preventDefault();

  let formData = new FormData(informationForm);

  request
    .postWithUrlformData(
      "./settings/" + userID + "/updateCompanyInformations",
      formData
    )
    .then((response) => {
      console.log(response);
      ui.showNotification(response.success, response.message);
      if (response.success===true) {
        modalUser.classList.add("hidden")
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }else{
        console.log("nothing")
      }
    })
    .catch((err) => console.log("hata:" + err));
}
function UpdateSmsConfig(e) {
  e.preventDefault();

  request
    .postWithUrl("./settings/" + userID + "/updateSmsConfig", {
      userName: formUpdateSmsConfig.userName.value,
      password: formUpdateSmsConfig.password.value,
    })
    .then((response) => {
      ui.showNotification(true, response.message);
    })
    .catch((err) => ui.showNotification(err.success, err.message));
}

addDocBtns.forEach((element) => {
  element.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("1");
    const fileInput = document.getElementById(e.target.dataset.dockey);
    console.log(fileInput);
    const file = fileInput.files[0];

    if (!file) {
      alert("Lütfen bir dosya seçin");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    loader.classList.toggle("showed");
    request
      .postWithUrlformData(
        "./settings/" +
          userID +
          "/" +
          e.target.dataset.dockey +
          "/updateCompanyDocs",
        formData
      )
      .then((response) => {
        loader.classList.toggle("showed");
        ui.showNotification(true, response.message);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((err) => ui.showNotification(err.success, err.message));
  });
});

showContentsBtns.forEach((element, index) => {
  element.addEventListener("click", (e) => {
    showContentsBtns.forEach((element) => {
      element.classList.remove("active");
    });
    element.classList.add("active");

    contents.forEach((element) => {
      element.classList.remove("showed_content");
    });

    element.parentElement.nextElementSibling.children[0].children[
      index
    ].classList.add("showed_content");

    console.log(element.classList);
  });
});
