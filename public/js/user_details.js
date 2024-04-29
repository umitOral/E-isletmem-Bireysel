import { Request } from "./requests.js";
const request = new Request();

import { UI } from "./ui.js";

const ui = new UI();
import { Tables } from "./inner_modules/tables.js";
const tables = new Tables();
import Zoomist from "https://cdn.jsdelivr.net/npm/zoomist@2/zoomist.js";

const imageInput = document.querySelector(".upload_file");
const showContentsBtn = document.querySelectorAll(".show-content");
const contents = document.querySelectorAll(".userInformationsContent");

const addPictureForm = document.querySelector("#add_picture_form");
const editBtn = document.querySelector(".edit-informations-btn");
const editUserButton = document.getElementById("edit-user");

const loader = document.querySelector(".loader_wrapper.hidden");

const cancelModal = document.querySelectorAll(".modal .cancel_button");
const cancelAddPhoto = document.querySelector(".cancel_add_pic");

const addDataModal = document.querySelector(".add-data-modal");
const editPaymentModal = document.querySelector(".modal_edit_payment");

const addSessionModal = document.querySelector(".add-session-modal");
const addDataSaveButton = document.querySelector("#add-data-save-button");

const addDSessionSaveButton = document.querySelector(
  "#add-session-save-button"
);
let addDataForm = document.querySelector("#add-data-form");
let addSessionForm = document.querySelector("#add-session-form");

let addDiscountForm = document.querySelector("#add-discount-form");

let datasSelectInput = document.querySelector("#datas_select_input");

// modals
const allModals = document.querySelectorAll(".modal");

const modalUser = document.querySelector(".modal_user");
const addDiscountModal = document.querySelector(".add_discount_modal");
const modalSlider = document.querySelector(".modal_slider");

const modalImage = document.querySelector(".modal_image");
const modalOrders = document.querySelector(".modal_orders");
const userID = document.querySelector(".user-informations").dataset.userıd;

let modalEditData = document.querySelector(".edit-data-modal");

// responsed datas

let APPOINTMENT_STATUS = [];

eventListeners();

function eventListeners() {
  addPictureForm.addEventListener("submit", addPicture);
  addDiscountForm.addEventListener("submit", (e) => addDiscount(e));
  editUserButton.addEventListener("click", editUser);
  editBtn.addEventListener("click", showInformationsModal);
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

let datasOptionsSelectInput = document.querySelector(
  "#datasOptions_select_input"
);
let dataOptionNumberValue = document.querySelector("#dataOptionNumberValue");
datasSelectInput.addEventListener("change", (e) => {
  let dataID = e.target.value;

  request
    .getwithUrl("/admin/datas/" + dataID)
    .then((response) => {
      console.log(response);
      let indexcontrol = response.serviceDatas.findIndex(
        (item) =>
          item.dataName ===
          e.target.options[e.target.options.selectedIndex].textContent.trim()
      );
      console.log(indexcontrol);

      while (datasOptionsSelectInput.children[0]) {
        datasOptionsSelectInput.children[0].remove();
      }

      console.log(response.serviceDatas[indexcontrol].dataOptions.length);
      if (response.serviceDatas[indexcontrol].dataOptions.length === 0) {
        datasOptionsSelectInput.setAttribute("disable", "true");
        datasOptionsSelectInput.parentElement.style = "display:none";
        dataOptionNumberValue.setAttribute("disable", "false");
        dataOptionNumberValue.parentElement.style = "display:block";
      } else {
        datasOptionsSelectInput.setAttribute("disable", "false");
        datasOptionsSelectInput.parentElement.style = "display:block";
        dataOptionNumberValue.setAttribute("disable", "true");
        dataOptionNumberValue.parentElement.style = "display:none";
        response.serviceDatas[indexcontrol].dataOptions.forEach((element) => {
          datasOptionsSelectInput.innerHTML += `
        <option value="${element}">${element}</option>
        `;
        });
      }
    })
    .catch((err) => console.log(err));
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

saveModal.forEach((element) => {
  element.onclick = () => {
    modalUser.classList.remove("showed_modal");
    addDiscountModal.classList.remove("showed_modal");
  };
});

//get all appointments
const sessionsSection = document.querySelector(
  ".userInformationsContent.appointments"
);

const showAppointmentsBtn = document.querySelector(
  ".show-content.appointments"
);

showAppointmentsBtn.addEventListener("click", () => {
  // sessionsSection.classList
  console.log("adada");
  getAllAppointments();
});
// change states

function getAllAppointments() {
  console.log("dada");
  request
    .getwithUrl(userID + "/getUsersAllSessions")
    .then((response) => {
      console.log(response);
      APPOINTMENT_STATUS = Object.values(response.APPOINTMENT_STATUS);
      const sessionsTableBody = document.querySelector(".sessionTableBody");
      const sessionsTableRows = document.querySelectorAll(
        ".sessionTableBody tr"
      );

      sessionsTableRows.forEach((row) => {
        row.remove();
      });

      response.sessions.forEach((session) => {
        sessionsTableBody.innerHTML += `
        <tr data-appointmentid="${session._id}">
    
        <td>
            ${new Date(session.date).toLocaleDateString("tr-TR")}
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
            ${session.doctor.surname}
        </td>
        <td>
          ${session.operations.map(
            (item, i) => `
                ${item.operation.operationName}
                seans:${item.session}
          `
          )}
        </td>

        
        <td>
             ${session.description}
        </td>


        <td>
          <select name="" class="updateStateAppointment">
          <option value="" disable hidden selected >${
            session.appointmentState
          }</option>
          ${APPOINTMENT_STATUS.map(
            (item) => `
          <option value="${item}" >${item}</option>
          `
          )}
            
          </select>
            
        </td>
        <td >
        <select name="" class="appointment-edit-select">
        <option value="" disable hidden selected >Seçenekler</option>
        
        <option class="addDescriptionAppointment">Açıklama ekle</option>
        
          
        
        </select>
        </td>
    </tr>
        `;
      });

      handleAppointmentEditBtn();
    })
    .catch((err) => {
      console.log(err);
    });
}

// add operation section

const proccessType = document.querySelector(".proccess_type_add");
const proccessDataDiv = document.querySelector(".processes_datas");

const selectedProcessTable = document.querySelector(
  "#selected_proccess_table tbody"
);

selectedProcessTable.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete_items_from_basket")) {
    handleDeleteOperationBtn(e);
  }
});
selectedProcessTable.addEventListener("change", (e) => {
  if (e.target.classList.contains("appointment-count")) {
    e.target.addEventListener("change", handleAppointmentBtn(e));
  }
});

let selectedOperations = [];
proccessType.addEventListener("change", () => {
  console.log("hizmet seçildi");
  console.log(selectedOperations);

  while (selectedProcessTable.firstChild) {
    selectedProcessTable.firstChild.remove();
  }
  selectedOperations.push({
    operationName:
      proccessType.options[proccessType.options.selectedIndex].value.trim(),
    operationPrice: Number(
      proccessType.options[proccessType.options.selectedIndex].dataset.price
    ),
    totalAppointments: 1,
  });

  selectedOperations.forEach((element) => {
    selectedProcessTable.insertRow;
    selectedProcessTable.innerHTML += `
    <tr data-operationname="${element.operationName}" data-operationprice="${element.operationPrice}">
        <td>${element.operationName}</td>
        <td><input type="number"class="appointment-count" value="1"></td>
        <td>${element.operationPrice}</td>
        <td><i class="fa-solid fa-trash delete_items_from_basket"></i></td>
    </tr>
    `;
  });

  calculateTotal();
  // remove selected proccess
});

let percentDiscount = document.querySelector("#percent_discount");

percentDiscount.addEventListener("input", () => {
  calculateTotal();
});

let totalValue = document.querySelector("#total_value");
function calculateTotal() {
  let percentDiscount = document.querySelector("#percent_discount").value;
  let selectedOperationsTotalValue = 0;
  if (selectedOperations.length !== 0) {
    selectedOperationsTotalValue = selectedOperations
      .map((item) => item.operationPrice)
      .reduce((a, b) => a + b);
  }

  if (percentDiscount) {
    totalValue.textContent =
      selectedOperationsTotalValue * ((100 - percentDiscount) / 100);
  } else {
    if (selectedOperations.length !== 0) {
      totalValue.textContent = selectedOperations
        .map((item) => item.operationPrice)
        .reduce((a, b) => a + b);
    } else {
      totalValue.textContent = 0;
    }
  }
}
function handleDeleteOperationBtn(e) {
  let controlindex = selectedOperations.findIndex(
    (item) =>
      item.operationName ===
      e.target.parentElement.parentElement.dataset.operationname
  );
  console.log(controlindex);
  selectedOperations.splice(controlindex, 1);
  console.log(selectedOperations);

  e.target.parentElement.parentElement.remove();
  calculateTotal();
}
function handleAppointmentBtn(e) {
  
    
  let controlindex = selectedOperations.findIndex(
    (item) =>
      item.operationName ===
      e.target.parentElement.parentElement.dataset.operationname
  );
  console.log(controlindex);
  selectedOperations[controlindex].totalAppointments = Number(
    e.target.value
  );
  

  console.log(selectedOperations);
}

// get payments from db

const showPaymentsBtn = document.querySelector(".show-content.payment");
const orderTable = document.querySelector(".order-table");
const paymentTable = document.querySelector(".payment-table");

showPaymentsBtn.addEventListener("click", getAllPayments);

function getAllPayments() {
  request
    .getwithUrl("./" + userID + "/getUsersAllPayments")
    .then((response) => {
      console.log(response);
      ui.showModal(response.success, response.message);
      ui.addPaymentsToTable(paymentTable, response.data);
      handlePaymentEditBtn();
    })
    .catch((err) => {
      ui.showModal(false, err.message);
    });
}

paymentTable.addEventListener("change", (e) => {
  if (e.target.classList.contains("operations-edit-select")) {
  }
});

// get all operations

const showOperationsBtn = document.querySelector(".show-content.operations");
showOperationsBtn.addEventListener("click", getAllOperations);

function getAllOperations() {
  request
    .getwithUrl("./" + userID + "/getUsersAllOperations")
    .then((response) => {
      console.log(response);
      ui.addResponseToTable(orderTable, response.data);

      handleOperationEditBtn();
      handleİmageBtn();
      handleshowSessionsBtn();
      showImagesBtn();
      editDatasBtn();
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
  let data = {
    selectedOperations,
    discount: Number(percentDiscount.value),
  };

  request
    .postWithUrl("./" + userID + "/addOperation", data)
    .then((response) => {
      ui.showModal(response.succes, response.message);
      modalOrders.classList.toggle("showed_modal");
      selectedProcessTable.innerHTML = "";
      selectedOperations = [];
      percentDiscount.value = 0;
      proccessType.innerHTML += `<option value="" selected disabled hidden>İşlem seçiniz</option>`;

      calculateTotal();
      getAllOperations();
    })
    .catch((err) => console.log(err));
});

// add picture

function handleİmageBtn() {
  const imageBtns = document.querySelectorAll(".fa-solid.fa-folder-plus");
  imageBtns.forEach((element) => {
    element.addEventListener("click", (e) => {
      console.log("jjjj");
      console.log(e.target.parentElement.parentElement.dataset.operationid);
      addPictureForm.dataset.operationid =
        e.target.parentElement.parentElement.dataset.operationid;
      modalImage.classList.toggle("showed_modal");
    });
  });
}
function handleshowSessionsBtn() {
  const showSessionBtns = document.querySelectorAll(".show-sessions");
  showSessionBtns.forEach((element) => {
    element.addEventListener("click", (e) => {
      console.log("kkk");
      console.log(e.target.parentElement.nextElementSibling);
      e.target.parentElement.parentElement.nextElementSibling.classList.toggle(
        "showed"
      );
      e.target.classList.toggle("asc");
    });
  });
}
function handleOperationEditBtn() {
  const editSelectBtns = document.querySelectorAll(".operations-edit-select");

  editSelectBtns.forEach((element) => {
    element.addEventListener("change", (e) => {
      const operationId =
        e.target.parentElement.parentElement.dataset.operationid;
      if (e.target.options[e.target.options.selectedIndex].value === "delete") {
        if (confirm("işlem silinecek onaylıyor musunuz?")) {
          request
            .getwithUrl("./" + userID + "/deleteOperation/" + operationId)
            .then((response) => {
              console.log(response);
              ui.showModal(response.succes, response.message);

              getAllOperations();
            })
            .catch((err) => ui.showModal(false, err.message));
        }
      }
      if (
        e.target.options[e.target.options.selectedIndex].value === "add-data"
      ) {
        addDataModal.classList.toggle("showed_modal");

        addDataForm.dataset.operationid =
          e.target.parentElement.parentElement.dataset.operationid;
      }
      if (
        e.target.options[e.target.options.selectedIndex].value === "add-session"
      ) {
        addSessionModal.classList.toggle("showed_modal");

        addSessionForm.dataset.operationid =
          e.target.parentElement.parentElement.dataset.operationid;
      }

      if (
        e.target.options[e.target.options.selectedIndex].value ===
        "add-discount"
      ) {
        addDiscountModal.classList.toggle("showed_modal");

        addDiscountForm.dataset.operationid =
          e.target.parentElement.parentElement.dataset.operationid;
      }
    });
  });
}

function handlePaymentEditBtn() {
  const editSelectBtns = document.querySelectorAll(".payments-edit-select");

  editSelectBtns.forEach((element) => {
    element.addEventListener("change", (e) => {
      const paymentID = e.target.parentElement.parentElement.dataset.paymentid;
      if (
        e.target.options[e.target.options.selectedIndex].value ===
        "delete-payment"
      ) {
        if (confirm("ödeme silinecek onaylıyor musunuz?")) {
          request
            .getwithUrl("../payments/" + paymentID + "/deletePayment")
            .then((response) => {
              console.log(response);
              ui.showModal(response.succes, response.message);
              calculatetTotalPriceforEdit();
              getAllPayments();
            })
            .catch((err) => ui.showModal(false, err.message));
        }
      }
      if (
        e.target.options[e.target.options.selectedIndex].value ===
        "edit-payment"
      ) {
        handleEditPaymentModal(e);
      }
    });
  });
}

const paymentCreditCartRatio = document.querySelector(
  ".modal_edit_payment  #credit_card_ratio_edit"
);
const paymentCCashRatio = document.querySelector(
  ".modal_edit_payment  #cash_ratio_edit"
);
const paymentUserEdit = document.querySelector(
  ".modal_edit_payment  #payment_user_edit input"
);
const paymentDescriptionEdit = document.querySelector(
  ".modal_edit_payment  #description_for_edit"
);
const editPaymentForm = document.querySelector(
  ".modal_edit_payment #edit-payment-form"
);
const saveEditModal = document.querySelector(
  ".modal_edit_payment .save_update_btn"
);

const selected_proccess_table_edit = document.querySelector(
  ".selected_proccess_table_edit tbody"
);
let selectedOperationsforEdit = [];
function handleEditPaymentModal(e) {
  console.log("burası");
  let editedPayment = e.target.parentElement.parentElement.dataset.paymentid;
  let editPaymentForm = document.querySelector("#edit-payment-form");

  request
    .getwithUrl("../payments/" + editedPayment)
    .then((response) => {
      console.log(response);
      selectedOperationsforEdit = response.data;
      editPaymentModal.classList.add("showed_modal");
      selected_proccess_table_edit.innerHTML = "";

      if (response.data.cashOrCard === "Nakit") {
        paymentCCashRatio.checked = true;
      } else {
        paymentCreditCartRatio.checked = true;
      }
      editPaymentForm.dataset.paymentid =
        e.target.parentElement.parentElement.dataset.paymentid;
      paymentUserEdit.value =
        response.data.fromUser.name + " " + response.data.fromUser.surname;

      paymentDescriptionEdit.value = response.data.description;

      response.operationsDetails.forEach((element, index) => {
        selected_proccess_table_edit.innerHTML += `
        <tr data-id="${response.data.operations[index]._id}" data-price="${
          response.data.operations[index].paymentValue
        }" >
            <td>${element.operationName}</td>
                
            <td>
            <input type="number" min="0" value="1" readonly >
            </td>
            

            <td>
              ${element.operationPrice}
            </td>
            <td>
              ${element.discount}
            </td>
            <td>
              ${element.percentDiscount}
            </td>
            <td>
            
            ${
              (element.operationPrice - element.discount) *
              ((100 - element.percentDiscount) / 100)
            }
            </td>
            <td>
              <input class="payment_value" value=" ${
                response.data.operations[index].paymentValue
              }" placeholder="${
          response.data.operations[index].paymentValue
        }"></input>
            </td>
            
            <td><i class="fa-solid fa-trash delete_items_from_basket"></i></td>
        </tr>
           
            `;
      });

      selectedOperationsforEdit = [];
      response.data.operations.forEach((element) => {
        selectedOperationsforEdit.push(element);
      });

      calculatetTotalPriceforEdit();
    })
    .catch((err) => {
      console.log(err);
    });
}

selected_proccess_table_edit.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete_items_from_basket")) {
    let index = selectedOperationsforEdit.findIndex(
      (item) => item._id === e.target.parentElement.parentElement.dataset.id
    );
    selectedOperationsforEdit.splice(index, 1);
    e.target.parentElement.parentElement.remove();
    calculatetTotalPriceforEdit();
    console.log(selectedOperationsforEdit);
  }
});

selected_proccess_table_edit.addEventListener("input", (e) => {
  if (e.target.classList.contains("payment_value")) {
    let index = selectedOperationsforEdit.findIndex(
      (item) => item._id === e.target.parentElement.parentElement.dataset.id
    );

    e.target.addEventListener("input", (e) => {
      selectedOperationsforEdit[index].paymentValue = Number(e.target.value);
      console.log(selectedOperationsforEdit);
      calculatetTotalPriceforEdit();
    });
  }
});

function calculatetTotalPriceforEdit() {
  console.log("calculating2");

  let totalValueforEdit = document.querySelector("#total_value_edit");

  let paymentValues = selectedOperationsforEdit.map(
    (element) => element.paymentValue
  );

  if (paymentValues.length === 0) {
    totalValueforEdit.textContent = 0;
  } else {
    totalValueforEdit.textContent = paymentValues.reduce((a, b) => a + b);
  }
}

saveEditModal.addEventListener("click", (e) => {
  e.preventDefault();
  let data = {
    paymentId: e.target.parentElement.dataset.paymentid,
    cashOrCard: editPaymentForm.cashOrCard.value,
    description: editPaymentForm.description.value,
    operations: selectedOperationsforEdit,
  };
  console.log(data);

  request
    .postWithUrl(
      "../payments/" +
        e.target.parentElement.dataset.paymentid +
        "/editPayment",
      data
    )
    .then((response) => {
      console.log(response);
      ui.showModal(true, response.message);
      editPaymentModal.classList.toggle("showed_modal");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    })
    .catch((err) => console.log(err));
  e.preventDefault();
});

function handleAppointmentEditBtn() {
  const editSelectBtns = document.querySelectorAll(".appointment-edit-select");
  const updateStateAppointment = document.querySelectorAll(
    ".updateStateAppointment"
  );

  updateStateAppointment.forEach((element) => {
    element.addEventListener("change", (e) => {
      const appointmentID =
        e.target.parentElement.parentElement.dataset.appointmentid;

      request
        .getwithUrl(
          "../" +
            "appointments/" +
            appointmentID +
            "/updateStateAppointment/?state=" +
            e.target.value
        )
        .then((response) => {
          console.log(response);
          ui.showModal(true, response.message);

          getAllAppointments();
        })
        .catch((err) => ui.showModal(false, err.message));
    });
  });

  editSelectBtns.forEach((element) => {
    element.addEventListener("change", (e) => {
      const appointmentID =
        e.target.parentElement.parentElement.dataset.appointmentid;
      console.log(appointmentID);
      if (
        e.target.options[e.target.options.selectedIndex].classList.contains(
          "delete-appointment"
        )
      ) {
        if (confirm("Randevu silinecek onaylıyor musunuz??")) {
          request
            .getwithUrl(
              "../" + "appointments/" + appointmentID + "/deleteAppointment"
            )
            .then((response) => {
              console.log(response);
              ui.showModal(true, response.message);

              getAllAppointments();
            })
            .catch((err) => ui.showModal(false, err.message));
        }
      }
      if (
        e.target.options[e.target.options.selectedIndex].classList.contains(
          "updateStateAppointment"
        )
      ) {
        request
          .postWithUrl(
            "../" + "appointments/" + appointmentID + "/updateStateAppointment",
            { state: e.target.value }
          )
          .then((response) => {
            console.log(response);
            ui.showModal(true, response.message);

            getAllAppointments();
          })
          .catch((err) => ui.showModal(false, err.message));
      }
    });
  });
}

addDataSaveButton.addEventListener("click", (e) => {
  e.preventDefault();

  let data = {
    dataName:
      datasSelectInput.options[
        datasSelectInput.options.selectedIndex
      ].textContent.trim(),
    data: datasOptionsSelectInput.selectedIndex!==-1
      ? datasOptionsSelectInput.options[datasOptionsSelectInput.selectedIndex].value
      : dataOptionNumberValue.value,
  };

  console.log(data);

  request
    .postWithUrl(
      "../operations/" +
        addDataForm.dataset.operationid +
        "/addDataToOperation",
      data
    )
    .then((response) => {
      ui.showModal(true, response.message);
      addDataModal.classList.remove("showed_modal");
      getAllOperations();
    })
    .catch((err) => ui.showModal(false, err.message));
});

addDSessionSaveButton.addEventListener("click", (e) => {
  e.preventDefault();

  let data = {
    addSessionValue: Number(addSessionForm.addsession.value),
  };

  request
    .postWithUrl(
      "../operations/" +
        addSessionForm.dataset.operationid +
        "/addSessionToOperation",
      data
    )
    .then((response) => {
      ui.showModal(true, response.message);
      addSessionModal.classList.remove("showed_modal");
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
        e.target.parentElement.parentElement.dataset.operationid
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

function addDiscount(e) {
  e.preventDefault();
  let data = {
    discount: addDiscountForm.discountValue.value,
    percentDiscount: addDiscountForm.percentDiscountValue.value,
  };

  request
    .postWithUrl(
      "./" + userID + "/addDiscountToOperation/" + e.target.dataset.operationid,
      data
    )
    .then((response) => {
      ui.showModal(response.success, response.message);
      getAllOperations();
    })
    .catch((err) => console.log(err));
}

function editDatasBtn() {
  let operationDataEditBtns = document.querySelectorAll(".edit-operation-data");
  let operationDataDeleteBtns = document.querySelectorAll(
    ".delete-operation-data"
  );

  operationDataDeleteBtns.forEach((element) => {
    element.addEventListener("click", (e) => {
      if (confirm("data silinecek onaylıyor musunuz?")) {
        request
          .getwithUrl(
            "/admin/datas/deleteOption/" +
              e.target.parentElement.dataset.dataid +
              "/" +
              e.target.parentElement.parentElement.parentElement.dataset
                .operationid
          )
          .then((response) => {
            getAllOperations();
          })
          .catch((err) => console.log(err));
      }
    });
  });
  operationDataEditBtns.forEach((element) => {
    element.addEventListener("click", async (e) => {
      console.log("dada");
      let operationDataEditForm = document.querySelectorAll("#edit-data-form");
      let operationDataName = document.querySelector("#dataName");
      let editDatasOptionSelect = document.querySelector("#edit_data_option");

      while (editDatasOptionSelect.children[0]) {
        editDatasOptionSelect.children[0].remove();
      }
      let dataId = e.target.parentElement.dataset.dataid;
      let operationId =
        e.target.parentElement.parentElement.parentElement.dataset.operationid;

      operationDataName.value = e.target.parentElement.dataset.dataname;
      await request
        .getwithUrl("/admin/datas/" + dataId)
        .then((response) => {
          console.log(response)
          let indexcontrol = response.serviceDatas.findIndex(
            (item) => item.dataName === e.target.parentElement.dataset.dataname
          );
          response.serviceDatas[indexcontrol].dataOptions.forEach(
            (element) => {
              editDatasOptionSelect.innerHTML += `
              <option value="${element}">${element}</option>
              `;
            }
          );
          
        })
        .catch((err) => console.log(err));

      let editDataSaveBtn = document.querySelector("#edit-data-save-button");

      editDataSaveBtn.addEventListener("click", (e) => {
        let data = {
          value:
            editDatasOptionSelect.options[
              editDatasOptionSelect.options.selectedIndex
            ].value,
        };
        e.preventDefault();
        request
          .postWithUrl(
            "/admin/operations/" +
              operationId +
              "/editDataofOperation/" +
              dataId,
            data
          )
          .then((response) => {
            ui.showModal(true, response.message);
            modalEditData.classList.remove("showed_modal");
            getAllOperations();
          })
          .then((err) => console.log(err));
      });

      modalEditData.classList.add("showed_modal");
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
let operationId = "";
function addPicture(e) {
  const formData = new FormData();
  uploadFiles.forEach((element) => {
    formData.append("upload_file", element);
  });
  console.log(uploadFiles);
  loader.classList.toggle("showed");

  formData.append("uploadTime", addPictureForm.uploadTime.value);
  formData.append("operationID", addPictureForm.dataset.operationid);

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
