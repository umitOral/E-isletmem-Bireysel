import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();
import { Tables } from "./inner_modules/tables.js";
const tables = new Tables();

const showContentsBtn = document.querySelectorAll(".show-content");
const contents = document.querySelectorAll(".userInformationsContent");
const messageBox = document.querySelector(".information-modal");

const tableElements = document.querySelectorAll("table");


const editBtn = document.querySelector(".edit-informations-btn");
const editUserButton = document.getElementById("edit-user");
const addImageButton = document.querySelector("button.add");
const loader = document.querySelector(".loader_wrapper.hidden");
const addImageSaveButton = document.querySelector("#add-img-save-button");
const deleteImageBtn = document.querySelectorAll(
  ".small_images_options span:last-child"
);

const cancelModal = document.querySelectorAll(".modal .cancel_button");

// modals
const modalUser = document.querySelector(".modal_user");
const modalSession = document.querySelector(".modal_session");
const modalPayment = document.querySelector(".modal_payment");

const modalProccess = document.querySelector(".modal_proccess");



eventListeners();

function eventListeners() {
  
  
  editUserButton.addEventListener("click", editUser);
  editBtn.addEventListener("click", showInformationsModal);
  
  
}

cancelModal.forEach((element) => {
  element.addEventListener("click", () => {
    console.log(element.parentElement.parentElement);
    element.parentElement.parentElement.classList.remove("showed_modal");
  });
});

tableElements.forEach((table) => {
  table.querySelectorAll("thead th").forEach((head,columnIndex) => {
    head.addEventListener("click",()=>{
      
      tables.sortingStart(table,columnIndex)
      
    })
  });
});


const userName = document.getElementById("user-name");
const usersurName = document.getElementById("user-surname");

function editUser(e) {
  e.preventDefault();
  
  const form=document.querySelector("#user-edit-form")
  request
    .postWithUrl(form.action, {
      name:form.name.value,
      surname:form.surname.value,
      role:form.role.value,
      email:form.email.value,
      sex:form.sex.value,
      address:form.address.value,
      phone:form.phone.value,
      activeOrNot:form.activeOrNot.value,
      birtdhDate:form.birtdhDate.value,
      
    })
    .then((response) => {
      console.log(response)
      ui.showModal(true,response.message)
      modalUser.classList.remove("showed_modal")
      setTimeout(() => {
        window.location.reload()
      }, 800);
    })
    .catch((err) =>ui.showModal(false,err) );

  
}

showContentsBtn.forEach((element, index) => {
  element.addEventListener("click", () => {
    showContentsBtn.forEach((element) => {
      element.classList.remove("active");
    });
    element.classList.add("active");

    contents.forEach((element) => {
      element.classList.remove("showed_content");
    });

    element.parentElement.nextElementSibling.children[0].children[
      index
    ].classList.add("showed_content");
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

// user details modal -----------------


const saveModal = document.querySelectorAll(".modal .save_button");

function showInformationsModal() {
  
  modalUser.classList.add("showed_modal");
}


cancelModal.forEach((element) => {
  element.addEventListener("click", (e) => {
    e.preventDefault();
    modalUser.classList.remove("showed_modal");
    modalSession.classList.remove("showed_modal");
    modalPayment.classList.remove("showed_modal");
    
    modalUser.classList.remove("showed_modal");
    modalProccess.classList.remove("showed_modal");
    console.log("dada");
  });
});
saveModal.forEach((element) => {
  element.onclick = () => {
    modalUser.classList.remove("showed_modal");
    modalSession.classList.remove("showed_modal");
    modalPayment.classList.remove("showed_modal");
    loader.classList.toggle("showed");
  };
});






