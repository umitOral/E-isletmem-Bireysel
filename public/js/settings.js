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

  request
    .postWithUrl("./settings/" + userID + "/updateCompanyInformations", {
      brandName: informationForm.brandName.value,
      companyName: informationForm.companyName.value,
      email: informationForm.email.value,
      phone: informationForm.phone.value,
      address: informationForm.address.value,
      billingAddress: informationForm.billingAddress.value,
      workStart: informationForm.workStart.value,
      workEnd: informationForm.workEnd.value,
      workPeriod: Number(informationForm.workPeriod.value),
    })
    .then((response) => {
      modalUser.classList.remove("hidden");
      ui.showNotification(true, response.message);
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


addDocBtns.forEach(element => {
  element.addEventListener("click",(e)=>{
    e.preventDefault();
    console.log("1")
    const fileInput = document.getElementById(e.target.dataset.dockey);
    console.log(fileInput)
    const file = fileInput.files[0];
  
    if (!file) {
      alert('Lütfen bir dosya seçin');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    loader.classList.toggle("showed");
    request
      .postWithUrlformData("./settings/" + userID +"/"+e.target.dataset.dockey+ "/updateCompanyDocs",formData)
      .then((response) => {
        loader.classList.toggle("showed");
        ui.showNotification(true, response.message);
        setTimeout(() => {
          window.location.reload()
        }, 500);
       
      })
      .catch((err) => ui.showNotification(err.success, err.message));
  })
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
   
    console.log(element.classList)
    if (element.classList.contains("notifications")) {
      getCompanyNotificationPermission()
    }
  });
});

// images area ----------------

const imagesSmall = document.querySelectorAll(
  ".userInformationsContent.images .small_images img"
);
const imageBig = document.querySelector(
  ".userInformationsContent.images #big_image_wrapper img "
);

imagesSmall.forEach((element) => {
  element.onclick = () => {
    imagesSmall.forEach((element) => {
      element.classList.remove("focused");
    });
    element.classList.add("focused");
    let src = element.getAttribute("src");

    imageBig.setAttribute("src", src);
  };
});

let notificationsTableBody=document.querySelector(".table.permissions-table tbody")
async function getCompanyNotificationPermission() {
  await request
    .getwithUrl("./getCompanyNotificationPermission")
    .then((response) => {
      console.log(response);
      ui.showNotification(response.success,response.message);

     
      response.NOTIFICATION_PERMISSIONS.forEach(element => {
        element.ispermitted=false
      });
      console.log(response.NOTIFICATION_PERMISSIONS)
      response.data.forEach((element) => {
        console.log(element)
       let index=response.NOTIFICATION_PERMISSIONS.findIndex((item)=>item.key===element)
       console.log(index)
        response.NOTIFICATION_PERMISSIONS[index].ispermitted=true
      });
      notificationsTableBody.innerHTML=""
      response.NOTIFICATION_PERMISSIONS.forEach((element, index) => {
        notificationsTableBody.innerHTML += `
          <tr>
            <td><span>${element.name}</span></td>
            <td><input type="checkbox"  class="centered_cell" data-notificationkey="${
              element.key
            }" name="notificationcheckbox" id="" ${(() => {
          if (element.ispermitted === true) {
            return `checked`;
          } else {
            return ``;
          }
        })()}></td>
          </tr>
    `;
      });
    })
    .catch((err) => console.log(err));
}

notificationsTableBody.addEventListener("change", (e) => {
  handleEvents(e);
});

function handleEvents(e) {
 
  if (e.target.name === "notificationcheckbox") {
    
    let data = { notificationkey: e.target.dataset.notificationkey };
    request
      .postWithUrl("./updateCompanyNotification",
        data
      )
      .then((response) => {
        console.log(response);
        ui.showNotification(response.success, response.message);
      })
      .catch((err) => {
        console.log(err);
        ui.showNotification(false, err);
      });
  }
}