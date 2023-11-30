import { Request } from "./requests.js";
const request = new Request();

const showContentsBtn = document.querySelectorAll(".show-content");
const contents = document.querySelectorAll(".userInformationsContent");

const proccessType = document.querySelector(".proccess_type");
const selected_proccess_type_div = document.querySelector(
  ".selected_proccess_type"
);
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
const modalImage = document.querySelector(".modal_image");
const modalProccess = document.querySelector(".modal_proccess");



eventListeners();

function eventListeners() {
  
  
  editUserButton.addEventListener("click", editUser);
  editBtn.addEventListener("click", showInformationsModal);
  addImageButton.addEventListener("click", showAddImageModal);
  
}

cancelModal.forEach((element) => {
  element.addEventListener("click", () => {
    console.log(element.parentElement.parentElement);
    element.parentElement.parentElement.classList.remove("showed_modal");
  });
});

deleteImageBtn.forEach((element) => {
  element.addEventListener("click", () => {
    const photoid=element.dataset.photoid
    request
      .deletewithUrl("./"+photoid+ "/deletePhoto")
      .then((response) => console.log(response))
      .catch(err=>console.log(err));
  });
});

const userName = document.getElementById("user-name");
const usersurName = document.getElementById("user-surname");

function editUser() {
  const name = userName.value || userName.placeholder;
  const surName = usersurName.value || usersurName.placeholder;

  request
    .put(userID, {
      name: name,
      surname: surName,
    })
    .then((response) => console.log(response))
    .catch((err) => console.log(err));

  e.preventDefault();
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
const editInformation = document.getElementById("edit_informations");

const addImage = document.getElementById("add_image");
const addProccess = document.getElementById("add_proccess");

const saveModal = document.querySelectorAll(".modal .save_button");

function showInformationsModal() {
  console.log("dada");
  modalUser.classList.add("showed_modal");
}
function showAddImageModal(e) {
  console.log("dada");
  modalImage.classList.add("showed_modal");
}

cancelModal.forEach((element) => {
  element.addEventListener("click", (e) => {
    e.preventDefault();
    modalUser.classList.remove("showed_modal");
    modalSession.classList.remove("showed_modal");
    modalPayment.classList.remove("showed_modal");
    modalImage.classList.remove("showed_modal");
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

// add-session -------------------------






