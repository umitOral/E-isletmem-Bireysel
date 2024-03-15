import { Request } from "./requests.js";
const request = new Request();

import { UI } from "./ui.js";

const ui = new UI();
import { Tables } from "./inner_modules/tables.js";
const tables=new Tables
import Zoomist from "https://cdn.jsdelivr.net/npm/zoomist@2/zoomist.js";

const imageInput = document.querySelector(".upload_file");
const showContentsBtn = document.querySelectorAll(".show-content");
const contents = document.querySelectorAll(".userInformationsContent");



const addPictureForm = document.querySelector("#add_picture_form");
const editBtn = document.querySelector(".edit-informations-btn");
const editUserButton = document.getElementById("edit-user");
const addImageButton = document.querySelector("button.add");
const loader = document.querySelector(".loader_wrapper.hidden");
const addImageSaveButton = document.querySelector("#add-img-save-button");

const cancelModal = document.querySelectorAll(".modal .cancel_button");
const cancelAddPhoto = document.querySelector(".cancel_add_pic");

const addDataModal = document.querySelector(".add-data-modal");
const operationIdInput=document.querySelector(".operation-id")


// modals
const allModals = document.querySelectorAll(".modal");

const modalUser = document.querySelector(".modal_user");
const modalSlider = document.querySelector(".modal_slider");
const modalSession = document.querySelector(".modal_session");
const modalPayment = document.querySelector(".modal_payment");
const modalImage = document.querySelector(".modal_image");
const modalOrders = document.querySelector(".modal_orders");
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

cancelAddPhoto.addEventListener("click", () => {
  imageInput.value = "";
  addPictureForm.uploadTime.value = "";
  uploadFiles = [];
});

function deleteButtonFunction(selector) {
  let deleteImageBtn = document.querySelectorAll(".delete-photo");

  deleteImageBtn.forEach((element) => {
    element.addEventListener("click", (e) => {
      const photoid = element.dataset.photoid;
      const operationid = element.dataset.operationid;
      if (confirm("silinecek onaylıyor musunuz?")) {
        request
          .deletewithUrl(
            "./" + userID + "/deletePhoto/" + operationid + "/" + photoid
          )
          .then((response) => {
            ui.showModal(true, response.message);
            getOperationImages(operationid);
          })
          .catch((err) => ui.showModal(false, err.message));
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

async function getOperationImages(operationID) {
  const allSmallImages = document.querySelector(".small_images");

  await request
    .getwithUrl("./" + userID + "/getAllPhotos/" + operationID)
    .then((response) => {
      console.log(response);
      ui.showModal(true, response.message);
      console.log(response.photos.length);
      while (allSmallImages.firstChild) {
        allSmallImages.firstChild.remove();
      }
      if (response.photos.length !== 0) {
        response.photos.forEach((photo, index) => {
          allSmallImages.innerHTML += `
          <img src="${photo.url}" alt="aaa">
          <div class="small_images_options">
              <span>
                  ${photo.uploadTime} .Gün
              </span>
              <span data-photoid="${photo._id}" data-operationid="${operationID}"  class="delete-photo">
              Sil
              </span>
          </div>
          `;
        });
      }
    })
    .catch((err) => console.log(err));

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
  });
});

// images area ----------------
function imagesSmallHandled() {
  const imagesSmall = document.querySelectorAll(".small_images img");
  const bigImage = document.querySelector(".zoomist-image img");

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
          ${session.operations}
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

// add order section

const proccessType = document.querySelector(".proccess_type_add");
const proccessDataDiv = document.querySelector(".processes_datas");

const selected_proccess_type_add = document.querySelector(
  ".selected_proccess_type_add"
);

let selectedValues = {};
proccessType.addEventListener("change", () => {
  console.log("hizmet seçildi");
  console.log(selectedValues);

  while (selected_proccess_type_add.firstChild) {
    selected_proccess_type_add.firstChild.remove();
  }

  selectedValues.productName =
    proccessType.options[proccessType.options.selectedIndex].textContent.trim();
  selectedValues.productPrice = Number(
    proccessType.options[proccessType.options.selectedIndex].dataset.price
  );
  selectedValues.serviceDataName =
    proccessType.options[
      proccessType.options.selectedIndex
    ].dataset.servicedata;

  const proccessDiv = document.createElement("div");
  const nodeinput = document.createElement("input");
  nodeinput.value =
    proccessType.options[proccessType.options.selectedIndex].textContent.trim();
  nodeinput.setAttribute("name", "services");
  nodeinput.setAttribute("disabled", "");
  nodeinput.setAttribute("type", "text");
  nodeinput.setAttribute("class", "selected_proccess");
  nodeinput.setAttribute(
    "value",
    proccessType.options[proccessType.options.selectedIndex].value
  );

  const priceInput = document.createElement("input");
  priceInput.setAttribute("disabled", "");
  priceInput.value =
    proccessType.options[proccessType.options.selectedIndex].dataset.price;

  const deleteButton = document.createElement("i");

  deleteButton.classList.add("ph");
  deleteButton.classList.add("ph-x");

  proccessDiv.appendChild(nodeinput);
  proccessDiv.appendChild(priceInput);
  proccessDiv.appendChild(deleteButton);
  selected_proccess_type_add.appendChild(proccessDiv);
  
  if (
    proccessType.options[proccessType.options.selectedIndex].dataset.servicedata
  ) {
    while (proccessDataDiv.firstChild) {
      proccessDataDiv.firstChild.remove();
    }
    let node = document.createElement("input");
    node.setAttribute("name", "serviceData");
    node.classList.add("serviceData");
    let spanNode = document.createElement("span");
    spanNode.textContent =
      proccessType.options[
        proccessType.options.selectedIndex
      ].dataset.servicedata;

    proccessDataDiv.appendChild(spanNode);
    proccessDataDiv.appendChild(node);
  } else {
    while (proccessDataDiv.firstChild) {
      proccessDataDiv.firstChild.remove();
    }
  }

  // remove selected proccess
  const selectedProcessDeleteIcon = document.querySelectorAll(
    ".selected_proccess_type_add div i"
  );
  selectedProcessDeleteIcon.forEach((element) => {
    element.addEventListener("click", (e) => {
      selectedValues={}
      element.parentElement.remove();
      
    });
  });
});

// get proceses from db

const showOrderBtn = document.querySelector(".show-content.orders");
const showPaymentsBtn = document.querySelector(".show-content.payment");
const orderTable = document.querySelector(".order-table");
const paymentTable = document.querySelector(".payment-table");

showPaymentsBtn.addEventListener("click", getAllPayments);
showOrderBtn.addEventListener("click", getAllOperations);
function getAllOperations() {
  request
    .getwithUrl("./" + userID + "/getUsersAllOperations")
    .then((response) => {
      console.log(response);
      ui.showModal(response.success, response.message);
      ui.addResponseToTable(orderTable, response.data);
      handleİmageBtn();
      handleOperationEditBtn();
      showImagesBtn();
    })
    .catch((err) => {
      ui.showModal(false, err.message);
    });
}
function getAllPayments() {
  request
    .getwithUrl("./" + userID + "/getUsersAllPayments")
    .then((response) => {
      console.log(response);
      ui.showModal(response.success, response.message);
      ui.addPaymentsToTable(paymentTable, response.data);
    
    })
    .catch((err) => {
      ui.showModal(false, err.message);
    });
}

// order modal processes

const orderModalBtn = document.querySelector("#order_btn");

orderModalBtn.addEventListener("click", () => {
  modalOrders.classList.toggle("showed_modal");
});

// add order section

const addOrderBtn = document.querySelector("#add-order");

addOrderBtn.addEventListener("click", () => {
  const serviceData = document.querySelector(".serviceData");

  let totalAppointmens = Number(
    document.querySelector(".appointment-count").value
  );
  let data = {
    selectedValues,
    totalAppointmens,
  };
  if (serviceData) {
    data.selectedValues.serviceDataValue = serviceData.value;
  }

  request
    .postWithUrl("./" + userID + "/addOperation", data)
    .then((response) => {
      ui.showModal(response.succes, response.message);
      modalOrders.classList.toggle("showed_modal");
      getAllOperations();
    })
    .catch((err) => console.log(err));
});

// add picture

function handleİmageBtn() {
  const imageBtns = document.querySelectorAll(".fa-solid.fa-folder-plus");
  imageBtns.forEach((element) => {
    element.addEventListener("click", (e) => {
      console.log(e.target.parentElement.parentElement.children[0].textContent);
      addPictureForm.operationId.value =
        e.target.parentElement.parentElement.children[0].textContent;
      modalImage.classList.toggle("showed_modal");
    });
  });
}
function handleOperationEditBtn() {
  const editSelectBtns = document.querySelectorAll(".operations-edit-select");

  editSelectBtns.forEach((element) => {
    element.addEventListener("change", (e) => {
      const operationId =
        e.target.parentElement.parentElement.children[0].textContent;
      if (e.target.options[e.target.options.selectedIndex].value === "delete") {
        if (confirm("işlem silinecek onaylıyor musunuz?")) {
          request
            .deletewithUrl("./" + userID + "/deleteOperation/" + operationId)
            .then((response) => {
              ui.showModal(true, response.message);

              getAllOperations();
            })
            .catch((err) => ui.showModal(false, err.message));
        }
      }
      if (
        e.target.options[e.target.options.selectedIndex].value === "add-data"
      ) {
        addDataModal.classList.toggle("showed_modal");
        
        operationIdInput.value=operationId
      }
    });
  });
}

const addDataSaveButton = document.querySelector("#add-data-save-button");

addDataSaveButton.addEventListener("click", (e) => {
  e.preventDefault();
  let dataName = document.querySelector(".data-name");
  let dataValue = document.querySelector(".data-value");
  let data = {
    dataName: dataName.value,
    data: dataValue.value,
  };
  request
    .postWithUrl("./" + userID + "/addDataToOperation/" + operationIdInput.value, data)
    .then((response) => {
      ui.showModal(true, response.message);
      dataName.value = "";
      dataValue.value = "";
      addDataModal.classList.remove("showed_modal");
      getAllOperations();
    })
    .catch((err) => ui.showModal(false, err.message));
});

// show pics
const operationName = document.querySelector(".operation-name");
const operationDate = document.querySelector(".operation-date");
function showImagesBtn() {
  const showImagesBtns = document.querySelectorAll(".fa-regular.fa-images");
  showImagesBtns.forEach((element) => {
    element.addEventListener("click", (e) => {
      getOperationImages(
        e.target.parentElement.parentElement.children[0].textContent
      );
      modalSlider.classList.toggle("showed_modal");
      operationName.textContent =
        e.target.parentElement.parentElement.children[2].textContent;
      operationDate.textContent =
        e.target.parentElement.parentElement.children[1].textContent;
      const zoomist = new Zoomist(".slider", {
        maxScale: 5,
        slider: true,
        zoomer: true,
      });
    });
  });
}

// close the slider modal

const xBtn = document.querySelector(
  ".modal_slider i.fa-solid.fa-square-xmark "
);
xBtn.addEventListener("click", () => {
  modalSlider.classList.toggle("showed_modal");
});

imageInput.addEventListener("change", handleFiles);

let uploadFiles = [];

function handleFiles(e) {
  const selectedFiles = e.target.files;
  for (const iterator of selectedFiles) {
    uploadFiles.push(iterator);
  }
}

function addPicture(e) {
  const formData = new FormData();
  uploadFiles.forEach((element) => {
    formData.append("upload_file", element);
  });
  console.log(uploadFiles);
  loader.classList.toggle("showed");

  formData.append("uploadTime", addPictureForm.uploadTime.value);
  formData.append("operationID", addPictureForm.operationId.value);

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
      imageInput.value = "";
      addPictureForm.uploadTime.value = "";
      getAllOperations();
    })
    .catch((err) => {
      ui.showModal(false, err);
      console.log(err);
    });

  e.preventDefault();
}




  //tables sorting
 
  const tableElements = document.querySelectorAll("table");

  tableElements.forEach((table) => {
    table.querySelectorAll("thead th").forEach((head,columnIndex) => {
      head.addEventListener("click",()=>{
        
        tables.sortingStart(table,columnIndex)
        
      })
    });
  });
  