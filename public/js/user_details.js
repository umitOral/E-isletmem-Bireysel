import { Request } from "./requests.js";
const request = new Request();
import { Tables } from "./inner_modules/tables.js";
const tables = new Tables();

import { UI } from "./ui.js";
const ui = new UI();

const imageInput = document.querySelector(".upload_file");
const showContentsBtn = document.querySelectorAll(".show-content");
const contents = document.querySelectorAll(".userInformationsContent");

const tableElements = document.querySelectorAll("table");

const addPictureForm = document.querySelector("#add_picture_form");
const editBtn = document.querySelector(".edit-informations-btn");
const editUserButton = document.getElementById("edit-user");
const addImageButton = document.querySelector("button.add");
const loader = document.querySelector(".loader_wrapper.hidden");
const addImageSaveButton = document.querySelector("#add-img-save-button");

const cancelModal = document.querySelectorAll(".modal .cancel_button");
const cancelAddPhoto = document.querySelector(".cancel_add_pic");

// modals
const allModals = document.querySelectorAll(".modal");

const modalUser = document.querySelector(".modal_user");
const modalSession = document.querySelector(".modal_session");
const modalPayment = document.querySelector(".modal_payment");
const modalImage = document.querySelector(".modal_image");
const modalProccess = document.querySelector(".modal_proccess");
const userID = document.querySelector(".user-informations").dataset.userıd;

eventListeners();

function eventListeners() {
  addPictureForm.addEventListener("submit", addPicture);
  editUserButton.addEventListener("click", editUser);
  editBtn.addEventListener("click", showInformationsModal);
  addImageButton.addEventListener("click", showAddImageModal);
}

cancelModal.forEach((element) => {
  
  element.addEventListener("click", (e) => {
    element.parentElement.parentElement.classList.remove("showed_modal");
    
  });
});

cancelAddPhoto.addEventListener("click",()=>{
  imageInput.value=""
  addPictureForm.uploadTime.value=""
  uploadFiles = [];
})

tableElements.forEach((table) => {
  table.querySelectorAll("thead th").forEach((head, columnIndex) => {
    head.addEventListener("click", () => {
      tables.sortingStart(table, columnIndex);
    });
  });
});

function deleteButtonFunction(selector) {
  
  let deleteImageBtn = document.querySelectorAll(".delete-photo");

 
   


  deleteImageBtn.forEach((element) => {
    element.addEventListener("click", (e) => {
      const publicID = element.dataset.publicid;
      if (confirm("silinecek onaylıyor musunuz?")) {

        request
          .deletewithUrl("./" + userID + "/deletePhoto/" + publicID)
          .then((response) => {
            ui.showModal(true, response.message);
            getAllImages();
            
          })
          .catch((err) => ui.showModal(false, err));
      }
    });
  });
}

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
    .then((response) => {
      console.log(response);
      ui.showModal(true, response.message);
    })
    .catch((err) => console.log(err));

  e.preventDefault();
}



imageInput.addEventListener("change", handleFiles);

let uploadFiles = [];

function handleFiles(e) {
  const selectedFiles = e.target.files;
  for (const iterator of selectedFiles) {
    uploadFiles.push(iterator);
    console.log(iterator)
    
  }
  
}

function addPicture(e) {
  const formData = new FormData();
  uploadFiles.forEach((element) => {
    formData.append("upload_file", element);
  });
  console.log(uploadFiles)
  loader.classList.toggle("showed");

  formData.append("uploadTime", addPictureForm.uploadTime.value);

  request
    .postImageWithUrl(addPictureForm.action, formData)
    .then((response) => {
      console.log(response);
      loader.classList.toggle("showed");
      if (response.success === true) {
      }
      modalImage.classList.remove("showed_modal");
      ui.showModal(true, response.message);
      uploadFiles = [];
      imageInput.value=""
      addPictureForm.uploadTime.value=""
      getAllImages();
    })
    .catch((err) => {
      ui.showModal(false, err);
      console.log(err);
    });

  e.preventDefault();
}

async function getAllImages() {
  
  const allImages = document.querySelector(".small_images");

  while (allImages.firstChild) {
    allImages.firstChild.remove();
  }
  console.log("aşama2");
  await request
    .getwithUrl("./" + userID + "/getAllPhotos")
    .then((response) => {
      response.photos.forEach((photo) => {
        allImages.innerHTML += `
      <img src="${photo.url}" alt="aaa">
      <div class="small_images_options">
                                                    <span>
                                                        ${photo.uploadTime} .Ay
                                                    </span>
                                                    <span data-photoid="${
                                                      photo.public_id
                                                    }" data-publicID="${
          photo.public_id.split("/")[1]
        }" class="delete-photo">
                                                        Sil
                                                    </span>

                                                   

                                                </div>
      `;
      });
    })
    .catch((err) => console.log(err));

  console.log("aşama3");
  console.log(allImages.querySelectorAll("div"));
  deleteButtonFunction();
  imagesSmallHandled();
}

showContentsBtn.forEach((element, index) => {
  element.addEventListener("click", (e) => {
    // close all open modals
    allModals.forEach((modal) => {
      modal.classList.remove("showed_modal");
    });
    //remove active all buttons
    showContentsBtn.forEach((element) => {
      element.classList.remove("active");
    });

    // activate selected buttons
    element.classList.add("active");

    contents.forEach((element) => {
      element.classList.remove("showed_content");
    });

    element.parentElement.nextElementSibling.children[0].children[
      index
    ].classList.add("showed_content");

    if (e.target.classList.contains("images")) {
      getAllImages();
    }
  });
});

// images area ----------------
function imagesSmallHandled() {
  const imagesSmall = document.querySelectorAll(".small_images img");
  const bigImage = document.querySelector(".image-container img");
  const closeBigImage = document.querySelector(".image-container i");
  console.log(bigImage);
  closeBigImage.onclick = (e) => {
    bigImage.parentElement.parentElement.classList.remove("showed_modal");
  };

  imagesSmall.forEach((element) => {
    element.onclick = () => {
      imagesSmall.forEach((element) => {
        element.classList.remove("focused");
      });
      element.classList.add("focused");
      let src = element.getAttribute("src");

      bigImage.setAttribute("src", src);
      bigImage.parentElement.parentElement.classList.add("showed_modal");
    };
  });
}

// user details modal -----------------

const saveModal = document.querySelectorAll(".modal .save_button");

function showInformationsModal() {
  console.log("dada");
  modalUser.classList.add("showed_modal");
}

function showAddImageModal(e) {
  modalImage.classList.add("showed_modal");
}

saveModal.forEach((element) => {
  element.onclick = () => {
    modalUser.classList.remove("showed_modal");
    modalSession.classList.remove("showed_modal");
    modalPayment.classList.remove("showed_modal");
  };
});



// options modals
const sessionsSection = document.querySelector(
  ".userInformationsContent.sessions"
);
sessionsSection.addEventListener("click", sessionEditButtonHandled);
function sessionEditButtonHandled(e) {
  const editModals = document.querySelectorAll(".session-options-modal");
  if (e.target.classList.contains("edit_modals")) {
    if (e.target.nextElementSibling.classList.contains("showed_modal")) {
      e.target.nextElementSibling.classList.remove("showed_modal");
    } else {
      console.log("burası");
      editModals.forEach((element) => {
        element.classList.remove("showed_modal");
      });

      e.target.nextElementSibling.classList.add("showed_modal");
    }
  } else {
    console.log("burası2");
    editModals.forEach((element) => {
      element.classList.remove("showed_modal");
    });
  }
}

// change states
changeState();
function changeState() {
  const sessionOptionsModalOptions = document.querySelectorAll(
    ".session-options-modal span"
  );

  sessionOptionsModalOptions.forEach((element, index) => {
    element.addEventListener("click", (e) => {
      console.log(e.target);
      if (e.target.classList.contains("delete-session")) {
        console.log("burası");
        request
          .deleteSession(
            "../appointments/" +
              e.target.parentElement.dataset.appointmentid +
              "/deleteAppointment"
          )
          .then((response) => {
            console.log(response);
            ui.showModal(true, response.message);
            console.log("silme başarılı");
          })
          .catch((err) => ui.showModal(false, err));
      }

      if (e.target.classList.contains("change-state")) {
        request
          .updateStateSession(
            "../appointments/" +
              e.target.parentElement.dataset.appointmentid +
              "/updateStateAppointment?state=" +
              e.target.textContent
          )
          .then((response) => {
            console.log(response);
            ui.showModal(true, response.message);
            getAllSessisons();
          })
          .catch((err) => console.log(err));
      }
    });
  });
}

function getAllSessisons() {
  request
    .getwithUrl("/api/" + userID + "/getAllSessions")
    .then((response) => {
      console.log(response);
      const sessionsTableBody = document.querySelector(".sessionTableBody");
      const sessionsTableRows = document.querySelectorAll(
        ".sessionTableBody tr"
      );

      sessionsTableRows.forEach((row) => {
        row.remove();
      });

      response.sessions.forEach((session) => {
        sessionsTableBody.innerHTML += `
        <tr>
    
        <td>
            ${new Date(session.date).toLocaleDateString()}
        </td>

        <td>
            ${new Date(session.startHour).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
                -
                ${new Date(session.endHour).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                    
        </td>

        <td>
            ${session.doctor.name}
        </td>
        <td>
          ${session.services}
        </td>
        <td>
             ${session.description}
        </td>


        <td>
            <p class="finish">
                ${session.state}
            </p>
        </td>
        <td style="position: relative;">

            <i class="fa-solid fa-ellipsis-vertical edit_modals"></i>

            <div class="session-options-modal"
                data-appointmentID="${session._id}">
                <span class="edit-session-btn">Düzenle</span>
                <span class="delete-session">Sil</span>
                <span class="change-state">Bitti</span>
                <span class="change-state">Seansta</span>
                <span class="change-state">Hasta Gelmedi</span>
                <span class="change-state">Personel Gelmedi</span>
            </div>

        </td>
    </tr>
        `;
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
