import { Request } from "./requests.js";
const request = new Request();

import { UI } from "./ui.js";

const ui = new UI();
ui.closeNotification();
ui.deleteZeroFromPhone();

import { Tables } from "./inner_modules/tables.js";
const tables = new Tables();
import Zoomist from "https://cdn.jsdelivr.net/npm/zoomist@2/zoomist.js";

const imageInput = document.querySelector(".upload_file");
const showContentsBtn = document.querySelectorAll(".show-content");
const contents = document.querySelectorAll(".userInformationsContent");
const userInformationForm = document.querySelector(
  "#edit-userInformation-form"
);

const addPictureForm = document.querySelector("#add_picture_form");
const editBtn = document.querySelector(".edit-informations-btn");

const loader = document.querySelector(".loader_wrapper.hidden");

const cancelBtns = document.querySelectorAll(".cancel.form-btn");
const cancelAddPhoto = document.querySelector("#cancel-add-photo");

const addDataModal = document.querySelector("#add-data-modal");
const editPaymentModal = document.querySelector("#modal_edit_payment");

const addSessionModal = document.querySelector("#add-session-modal");
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

const modalUser = document.querySelector("#modal_user");
const addDiscountModal = document.querySelector("#add_discount_modal");
const modalSlider = document.querySelector("#modal_slider");

const modalImage = document.querySelector("#modal_image");
const modalOrders = document.querySelector("#modal_order");
const userID = document.querySelector(".user-informations").dataset.userıd;

const selected_proccess_type_edit = document.querySelector(
  ".selected_proccess_type_edit"
);

let modalEditData = document.querySelector("#edit-data-modal");
const allSessionsofOperationModal = document.querySelector(
  "#allSessionsofOperationModal"
);
const allSessionsofOperationModalContent = document.querySelector(
  ".allsessionOfOperationContent table tbody"
);
const notificationsArea = document.querySelector(
  ".userInformationsContent.notifications"
);
const permissionsTabButton = document.querySelector(
  ".show-content.notifications"
);

// responsed datas

let APPOINTMENT_STATUS = [];
let selectedOperationsforEdit = [];
let selectedProductsforEdit = [];
let editedPayment;
let selectedPaymentIndex;

eventListeners();

function eventListeners() {
  addPictureForm.addEventListener("submit", addPicture);
  addDiscountForm.addEventListener("submit", (e) => addDiscount(e));

  editBtn.addEventListener("click", showInformationsModal);
  userInformationForm.addEventListener("submit", userInformationEdit);
  permissionsTabButton.addEventListener("click", getUserNotifications);
}

cancelBtns.forEach((element) => {
  element.addEventListener("click", (e) => {
    ui.closeAllModals();
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

function userInformationEdit(e) {
  e.preventDefault();
  let data = new FormData(this);

  request
    .postWithUrlformData("../users/" + userID + "/editInformations", data)
    .then(async(response) => {
      if (response.success) {
        ui.showNotification(true, response.message);
        modalUser.classList.add("hidden")
        console.log(response.data)
        let user=response.data.user
        let ınformationsArea=document.querySelector(".table-wrapper.userInformation")
        
     
        while (this.children.length !==1) {
         
          this.firstChild.remove()
        }
        let htmlContent=`
                     <div class="form-group">
                        <span>İsim</span>
                        <input type="text" name="name" id="user-name" value="${user.name }">
                    </div>

                    <div class="form-group">
                        <span>Soyisim</span>
                        <input type="text" name="surname" id="user-surname" value="${user.surname }">
                    </div>
                    <div class="form-group">
                        <span>TC</span>
                        <input type="text" name="identity" id="identity" value="${user.identity }" inputmode="numeric" pattern="[0-9]{11}">
                        

                    </div>
                    <div class="form-group">
                        <span>Email</span>
                        <input type="text" name="email" id="" value="${user.email }">
                    </div>
                    <div class="form-group">
                       
                      
                        <span>Doğum Tarihi</span>
                        
                        <input type="date" name="birthDate" id="" value="${user.birthDate?.split("T")[0]}">
                    </div>
                    <div class="options">
                        <span>Cinsiyet:</span>
                        ${(()=>{
                          if(user.sex==="male" ){
                            
                            return `<div>
                                <input type="radio" id="sex-women-update" name="sex" value="female">
                                &nbsp; <label for="sex-women-update">Kadın</label>

                                <input type="radio" id="sex-man-update" name="sex" value="male" checked="checked">
                                &nbsp; <label for="sex-man-update">Erkek</label>

                            </div>`
                            // 
                            }else{
                             return ` <div>
                                  <input type="radio" id="sex-women-update" name="sex" value="female"
                                      checked="checked">
                                  &nbsp; <label for="sex-women-update">Kadın</label>

                                  <input type="radio" id="sex-man-update" name="sex" value="male">
                                  &nbsp; <label for="sex-man-update">Erkek</label>

                              </div>`
                               }

                        })()}
                         

                    </div>
                    <div class="form-group">
                        <span>Adres</span>
                        <input type="text" name="address" id="" value="${user.address }"
                            placeholder="${user.address }">
                    </div>
                    <div class="form-group">
                        <span>Telefon</span>
                        <input type="number" name="phone" id="phone" value="${user.phone }">
                    </div>
                    <div class="form-group">
                        <span>Şirket</span>
                        <input type="text" name="userCompany" id="" value="${user.userCompany }">
                    </div>
                    <div class="form-group">
                        <span>Fatura Bilgisi:</span>
                        <textarea name="billingAddress" id="" cols=""
                            rows="2">${user.billingAddress }</textarea>
                    </div>
                    <div class="form-group">
                        <span>Açıklama</span>
                        <textarea name="notes" id="" cols="" rows="2">${user.notes}</textarea>
                    </div>
                  
        `
        this.insertAdjacentHTML("afterbegin", htmlContent)
        
        ınformationsArea.innerHTML=`
                <div class="form-group">
                                            <span>İsim</span>
                                            <input type="text" name="" id="name" value="${user.name }"
                                                readonly>
                                        </div>
                                        <div class="form-group">
                                            <span>Soyisim</span>
                                            <input type="text" name="" id="surname" value="${user.surname}"
                                                readonly>
                                        </div>
                                        <div class="form-group">
                                            <span>TC</span>
                                            <input type="text" name="" id="surname" value="${user.identity }" 
                                                readonly>
                                        </div>
                                        <div class="form-group">
                                            <span>Kayıt Tarihi:</span>
                                            <input type="text" name="" id="surname"
                                                value="${user.createdAt.split("T")[0]}" readonly>
                                        </div>
                                        <div class="options ">
                                            <span>Cinsiyet</span>
                                            ${(()=>{
                                              if(user.sex==="male" ){
                                               return ` <div>

                                                    <input type="radio" id="sex-man" name="sex" value="male"
                                                        checked="checked">
                                                    &nbsp; <label for="sex-man">Erkek</label>

                                                </div>`
                                                } else{
                                                 return ` <div>
                                                      <input type="radio" id="sex-women" name="sex" value="female"
                                                          checked="checked">
                                                      &nbsp; <label for="sex-women">Kadın</label>

                                                  </div>`
                                                  } 
                                            })()}
                                            
                                        </div>
                                        <div class="form-group">
                                            <span>Doğum Tarihi</span>
                                            
                                            <input type="date" name="" id="" value="${user.birthDate?.split("T")[0]}"
                                                readonly>
                                        </div>
                                        <div class="form-group">
                                            <span>Email</span>
                                            <input type="email" name="" id="" value="${user.email }" readonly>
                                        </div>

                                        <div class="form-group">
                                            <span>Adres:</span>
                                            <input type="text" value="${user.address }" readonly>
                                        </div>
                                        <div class="form-group">
                                            <span>Şirket:</span>
                                            <input type="text" value="${user.userCompany }" readonly>
                                        </div>
                                        <div class="form-group">
                                            <span>Fatura Adresi:</span>
                                            <input type="text" name="" id="" value="${user.billingAddress }"
                                                readonly>

                                        </div>
                                        <div class="form-group">
                                            <span>Telefon</span>
                                            <input type="number" name="" id="" value="${user.phone }" readonly>
                                        </div>


                                        <div class="form-group">
                                            <span>Açıklama</span>
                                            <input type="text" name="" id="" value="${user.notes }" readonly>
                                        </div>
                                    </div>           
        `


      } else {
        ui.showNotification(false, response.message);
      }

      console.log(response);
    })
    .catch((err) => {
      console.log(err);
      ui.showNotification(false, err.message);
    });
}

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
            ui.showNotification(true, response.message);
            getOperationImages(operationid);
          })
          .catch((err) => ui.showNotification(false, err.message));
      }
    });
  });
}

const userName = document.getElementById("user-name");
const usersurName = document.getElementById("user-surname");

async function getOperationImages(operationID) {
  const allSmallImages = document.querySelector(".small_images");

  await request
    .getwithUrl("./" + userID + "/getAllPhotos/" + operationID)
    .then((response) => {
      console.log(response);
      ui.showNotification(true, response.message);
      while (allSmallImages.firstChild) {
        allSmallImages.firstChild.remove();
      }
      if (response.photos.length !== 0) {
        response.photos.forEach((photo, index) => {
          allSmallImages.innerHTML += `
          <div class="single_image">
          <img src="${photo.url}" alt="aaa">
          <div class="small_images_options">
              
              <span class="upload_time">
                  ${photo.uploadTime} .Gün
              </span>
              <span data-photoid="${photo._id}" data-operationid="${operationID}"  class="delete-photo">
              Sil
              </span>
              
          </div>
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
      modal.classList.add("hidden");
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

let horizontal = document.querySelector(".small_images");
horizontal.addEventListener("wheel", (e) => {
  e.preventDefault();
  horizontal.scrollLeft += e.deltaY;
});

// user details modal -----------------

const saveModal = document.querySelectorAll(".modal .save_button");

function showInformationsModal() {
  console.log("dada");
  modalUser.classList.remove("hidden");
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

function getAllAppointments() {
  console.log("dada");
  request
    .getwithUrl(userID + "/getUsersAllAppointments")
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

      response.appointments.forEach((appointment) => {
        sessionsTableBody.innerHTML += `
        <tr data-appointmentid="${appointment._id}">
    
        <td>
            ${new Date(appointment.date).toLocaleDateString("tr-TR")}
        </td>

        <td>
            ${appointment.startHour}
                -
                ${appointment.endHour}
                    
        </td>

        <td>
            ${appointment.doctor.name}
            ${appointment.doctor.surname}
            
        </td>
        <td>
          <div class="selected_proccess" >
             Kayıtlı:
              ${appointment.plannedOperations.oldOperations.map(
                (item, i) => `
            
              <span type="text" class="old">
                ${item.operationName}
              </span>
                `
              )}
          </div>
          
          <div class="selected_proccess" >
             Planlanan:
            ${appointment.plannedOperations.newOperations.map(
            (item, i) => `
                 <span type="text" class="new">
                ${item}
              </span>
          `
          )}
          </div>
       
       
        </td>

        
        <td>
             ${appointment.description}
        </td>


        <td>
          <select name="" class="updateStateAppointment">
          <option value="" disable hidden selected >${
            appointment.appointmentState
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
//get all sms
const smsSection = document.querySelector(
  ".userInformationsContent.sms"
);

const showSmsBtn = document.querySelector(
  ".show-content.sms"
);

showSmsBtn.addEventListener("click", () => {
  // sessionsSection.classList
  console.log("adada");
  getAllSms();
});

function getAllSms() {
  console.log("sms");
  request
    .getwithUrl(userID + "/getUsersAllSms")
    .then((response) => {
      console.log(response);
      // APPOINTMENT_STATUS = Object.values(response.APPOINTMENT_STATUS);
      const smsTableBody = document.querySelector(".sms-table tbody");
      const smsTableFoot = document.querySelector("#sms-table-foot");
      const smsTableRows = document.querySelectorAll(
        ".sms-table tbody tr"
      );

      smsTableRows.forEach((row) => {
        row.remove();
      });
      
      response.sms.list.forEach((sms) => {
        smsTableBody.innerHTML += `
        <tr data-sms-pckId="${sms.id}">
          <td>
              ${new Date(sms.sendingDate).toLocaleDateString("tr-TR")} ${new Date(sms.sendingDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
          </td>
        
          <td>
          ${sms.id}
          </td>
          <td>
          ${sms.title}
          </td>
          <td>
          ${sms.content}
          </td>
          <td>
          ${sms.senders[0]}
          </td>
          <td>
          ${sms.statistics.total}
          </td>
          <td>
          ${sms.statistics.delivered}
          </td>
          <td>
          ${sms.statistics.undelivered}
          </td>
          <td>
          ${response.SMS_PACKAGE_STATUS[sms.state]}
          </td>

    </tr>
        `;
      });

      smsTableFoot.innerHTML=`
        <div>Toplam ${response.sms.stats.totalRecord} adet Kayıt  Bulundu.</div>
      `

     
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
  selectedOperations[controlindex].totalAppointments = Number(e.target.value);

  console.log(selectedOperations);
}

// get payments from db

const showPaymentsBtn = document.querySelector(".show-content.payment");
const orderTable = document.querySelector(".order-table");
const paymentTable = document.querySelector("#payment-table");

showPaymentsBtn.addEventListener("click", getAllPayments);

function getAllPayments() {
  request
    .getwithUrl("./" + userID + "/getUsersAllPayments")
    .then((response) => {
      console.log(response);
      ui.showNotification(response.success, response.message);
      ui.addPaymentsToTable(paymentTable, response.data);
      handlePaymentEditBtn();
    })
    .catch((err) => {
      console.log(err);
      ui.showNotification(false, err.message);
    });
}

// get all operations

const showOperationsBtn = document.querySelector(".show-content.operations");
showOperationsBtn.addEventListener("click", getAllOperations);
let allOperations = {};
function getAllOperations() {
  request
    .getwithUrl("./" + userID + "/getUsersAllOperations")
    .then((response) => {
      console.log(response);
      allOperations = response;
      ui.addResponseToTable(orderTable, response.data);

      handleOperationEditBtn();
      handleİmageBtn();
      handleshowSessionsBtn();
      showImagesBtn();
      editDatasBtn();
    })
    .catch((err) => {
      ui.showNotification(false, err.message);
    });
}

// order modal processes

const orderModalBtn = document.querySelector("#order_btn");

orderModalBtn.addEventListener("click", () => {
  modalOrders.classList.remove("hidden");
});

// add order section

const addOperationForm = document.querySelector("#add-operation");

addOperationForm.addEventListener("submit", () => {
  let data = {
    selectedOperations,
    discount: Number(percentDiscount.value),
  };

  request
    .postWithUrl("./" + userID + "/addOperation", data)
    .then((response) => {
      ui.showNotification(response.succes, response.message);
      modalOrders.classList.add("hidden");
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
      modalImage.classList.remove("hidden");
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
              ui.showNotification(response.succes, response.message);

              getAllOperations();
            })
            .catch((err) => ui.showNotification(false, err.message));
        }
      }

      if (
        e.target.options[e.target.options.selectedIndex].value === "add-data"
      ) {
        addDataModal.classList.toggle("hidden");

        addDataForm.dataset.operationid =
          e.target.parentElement.parentElement.dataset.operationid;
      }
      if (
        e.target.options[e.target.options.selectedIndex].value === "add-session"
      ) {
        addSessionModal.classList.remove("hidden");

        addSessionForm.dataset.operationid =
          e.target.parentElement.parentElement.dataset.operationid;
      }

      if (
        e.target.options[e.target.options.selectedIndex].value ===
        "add-discount"
      ) {
        addDiscountModal.classList.remove("hidden");

        addDiscountForm.dataset.operationid =
          e.target.parentElement.parentElement.dataset.operationid;
      }
      if (
        e.target.options[e.target.options.selectedIndex].value ===
        "show-all-sessions"
      ) {
        request
          .getwithUrl("./" + userID + "/getSessionsofOperation/" + operationId)
          .then((response) => {
            console.log(response);
            ui.showNotification(response.succes, response.message);
            allSessionsofOperationModalContent.innerHTML = "";
            response.data.sessionOfOperation.map((element) => {
              allSessionsofOperationModalContent.innerHTML += `
                        <tr>
                            <td>${new Date(
                              element.sessionDate
                            ).toLocaleDateString()}</td>
                            <td>${element.sessionState}</td>
                            <td>${element.sessionDatas}</td>
                        </tr>
                        `;
            });
          })
          .catch((err) => ui.showNotification(false, err.message));
        allSessionsofOperationModal.classList.toggle("hidden");
      }
      e.target.selectedIndex = 0;
    });
  });
}

const paymentCreditCartRatio = document.querySelector(
  "#modal_edit_payment  #credit_card_ratio_edit"
);
const paymentCCashRatio = document.querySelector(
  "#modal_edit_payment  #cash_ratio_edit"
);
const paymentUserEdit = document.querySelector(
  "#modal_edit_payment  #payment_user_edit input"
);
const paymentDescriptionEdit = document.querySelector(
  "#modal_edit_payment  #description_for_edit"
);
const editPaymentForm = document.querySelector(
  "#modal_edit_payment #edit-payment-form"
);

function handlePaymentEditBtn() {
  const editSelectBtns = document.querySelectorAll(".payments-edit-select");

  editSelectBtns.forEach((element, index) => {
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
              ui.showNotification(response.succes, response.message);
              calculateTotalPriceforEdit();
              getAllPayments();
            })
            .catch((err) => ui.showNotification(false, err.message));
        }
      }
      if (
        e.target.options[e.target.options.selectedIndex].value ===
        "edit-payment"
      ) {
        selectedPaymentIndex = index + 1;
        handleEditPaymentModal(e);
      }
      e.target.selectedIndex = 0;
    });
  });
}

selected_proccess_type_edit.addEventListener("input", (e) => {
  if (e.target.classList.contains("product-quantity")) {
    let index = selectedProductsforEdit.findIndex(
      (item) => item._id === e.target.parentElement.parentElement.dataset.id
    );
    console.log(index);
    console.log(selectedProductsforEdit);
    selectedProductsforEdit[index].quantity = Number(e.target.value);
    selectedProductsforEdit[index].paymentValue =
      selectedProductsforEdit[index].quantity *
      selectedProductsforEdit[index].price;
    e.target.parentElement.parentElement.children[6].children[0].value =
      selectedProductsforEdit[index].paymentValue;
    calculateTotalPriceforEdit();
  }
  
  if (e.target.classList.contains("discount")) {
    let index = selectedProductsforEdit.findIndex(
      (item) =>
        item._id === e.target.parentElement.parentElement.dataset.id
    );
    
    
    selectedProductsforEdit[index].discount = Number(e.target.value);
    selectedProductsforEdit[index].paymentValue =
    selectedProductsforEdit[index].quantity * selectedProductsforEdit[index].price -
    selectedProductsforEdit[index].discount;
  e.target.parentElement.parentElement.children[6].children[0].value =
  selectedProductsforEdit[index].paymentValue;
    
    calculateTotalPriceforEdit();
  }
});

const selected_proccess_table_edit = document.querySelector(
  ".selected_proccess_table_edit tbody"
);

function handleEditPaymentModal(e) {
  console.log("burası");
  editedPayment = e.target.parentElement.parentElement.dataset.paymentid;
  let editPaymentForm = document.querySelector("#edit-payment-form");

  request
    .getwithUrl("../payments/" + editedPayment)
    .then((response) => {
      console.log(response);
      selectedOperationsforEdit = response.data;
      editPaymentModal.classList.remove("hidden");
      selected_proccess_table_edit.innerHTML = "";

      if (response.data.cashOrCard === "nakit") {
        paymentCCashRatio.checked = true;
      } else {
        paymentCreditCartRatio.checked = true;
      }

      if (!response.data.fromUser) {
        editPaymentForm.dataset.userid = "";
        paymentUserEdit.value = "";
      } else {
        editPaymentForm.dataset.userid = response.data.fromUser._id;
        paymentUserEdit.value =
          response.data.fromUser.name + " " + response.data.fromUser.surname;
      }
      paymentDescriptionEdit.value = response.data.description;

      response.operationsDetails.forEach((element, index) => {
        selected_proccess_table_edit.innerHTML += `
        <tr data-id="${response.data.operations[index]._id}" data-price="${
          response.data.operations[index].paymentValue
        }" data-type="operation">
            <td>${element.operationName}</td>
                
            <td>
           
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
              <input class="payment_value tdInputs" value=" ${
                response.data.operations[index].paymentValue
              }" placeholder="${
          response.data.operations[index].paymentValue
        }"></input>
            </td>
            
            <td><i class="fa-solid fa-trash delete_operation_from_basket"></i></td>
        </tr>
           
            `;
      });
      response.data.products.forEach((element, index) => {
        selected_proccess_table_edit.innerHTML += `
        <tr data-id="${element._id}" data-price="${element.price}" data-type="product" >
             <td>${element.productId.name}</td>
                  <td>
                  <input class="tdInputs product-quantity" type="number" min="0" value="${element.quantity}" >
                  </td>
                  <td>
                  <input class="tdInputs deactive" type="number" min="0" value="${element.price}" readonly >
                  </td>
                  <td>
                  <input class="tdInputs discount" type="number" min="0" value="${element.discount}" >
                  </td>
                  <td>
                  <input class="tdInputs percentDiscount" type="number" min="0" value="${element.percentDiscount}" >
                  </td>
                  <td>
                  <input class="tdInputs deactive"  type="number" min="0" value="${element.paymentValue}" readonly >
                  </td>
                 
                  <td>
                  <input class="payment_value tdInputs" type="number" min="0"
                    max=""
                    value="${element.paymentValue}"
                    step="1" disabled>
                  </td>
            
            <td><i class="fa-solid fa-trash delete_product_from_basket"></i></td>
        </tr>
           
            `;
      });
      selectedOperationsforEdit = [];
      selectedProductsforEdit = [];
      response.data.operations.forEach((element) => {
        selectedOperationsforEdit.push(element);
      });
      response.data.products.forEach((element) => {
        selectedProductsforEdit.push({
          _id: element._id,
          quantity: element.quantity,
          price: element.price,
          paymentValue: element.paymentValue,
          discount: element.discount,
          percentDiscount: element.percentDiscount,
          productId: element.productId._id,
        });
      });
      console.log(selectedOperationsforEdit);
      console.log(selectedProductsforEdit);

      calculateTotalPriceforEdit();
    })
    .catch((err) => {
      console.log(err);
    });
}

selected_proccess_table_edit.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete_operation_from_basket")) {
    let index = selectedOperationsforEdit.findIndex(
      (item) => item._id === e.target.parentElement.parentElement.dataset.id
    );
    selectedOperationsforEdit.splice(index, 1);
    e.target.parentElement.parentElement.remove();
    calculateTotalPriceforEdit();
    console.log(selectedOperationsforEdit);
  }

  if (e.target.classList.contains("delete_product_from_basket")) {
    // remove selected options
    let index = selectedProductsforEdit.findIndex(
      (item) => item.productId === e.target.parentElement.parentElement.dataset.id
    );
    console.log(index);
    selectedProductsforEdit.splice(index, 1);
    e.target.parentElement.parentElement.remove();
    console.log(selectedProductsforEdit);
    calculateTotalPriceforEdit();
  }
  if (e.target.classList.contains("delete_items_from_basket")) {
    let index = selectedOperationsforEdit.findIndex(
      (item) => item._id === e.target.parentElement.parentElement.dataset.id
    );
    selectedOperationsforEdit.splice(index, 1);
    e.target.parentElement.parentElement.remove();
    calculateTotalPriceforEdit();
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
      calculateTotalPriceforEdit();
    });
  }
});

function calculateTotalPriceforEdit() {
  console.log("calculating2");
  let totalValueforEdit = document.querySelector("#total_value_edit");
  let paymentValues = 0;
  let productPaymentValues = 0;
  if (selectedOperationsforEdit.length !== 0) {
    paymentValues = selectedOperationsforEdit.map(
      (element) => element.paymentValue
    );
    paymentValues = paymentValues.reduce((a, b) => a + b).toFixed();
  }
  if (selectedProductsforEdit.length !== 0) {
    selectedProductsforEdit.forEach((element) => {
      productPaymentValues += element.paymentValue;
    });
    productPaymentValues = productPaymentValues;
  }

  totalValueforEdit.textContent =
    Number(paymentValues) + Number(productPaymentValues);
}

editPaymentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let data = {
    paymentId: editedPayment,
    cashOrCard: editPaymentForm.cashOrCard.value,
    description: editPaymentForm.description.value,
    operations: selectedOperationsforEdit,
    products: selectedProductsforEdit,
  };
  console.log(data);

  request
    .postWithUrl("../payments/" + editedPayment + "/editPayment", data)
    .then((response) => {
      console.log(response);
      ui.showNotification(true, response.message);
      editPaymentModal.classList.add("hidden");
      paymentTable.rows[selectedPaymentIndex].children[1].innerHTML=`
      ${response.data.cashOrCard}
    `
      paymentTable.rows[selectedPaymentIndex].children[2].innerHTML = `
      ${response.data.products
        .map(
          (item, i) => `
        <div data-dataId="${item._id}" data-dataName="${item.dataName}">
        ${item.quantity}x${item.productId.name}=${item.paymentValue} <br>
        </div>
        `
        )
        .join("")}
    `;
      paymentTable.rows[selectedPaymentIndex].children[3].innerHTML = `
      ${response.data.operations
        .map(
          (item, i) => `
        <div>
        ${item.operationId.operationName}=${item.paymentValue} <br>
      </div>
      `
        )
        .join("")}
    `;
      paymentTable.rows[selectedPaymentIndex].children[4].innerHTML = `
      ${response.data.totalPrice}
    `;
      paymentTable.rows[selectedPaymentIndex].children[5].innerHTML = `
      ${response.data.description}
    `;
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
          ui.showNotification(true, response.message);

          getAllAppointments();
        })
        .catch((err) => ui.showNotification(false, err.message));
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
              ui.showNotification(true, response.message);

              getAllAppointments();
            })
            .catch((err) => ui.showNotification(false, err.message));
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
            ui.showNotification(true, response.message);

            getAllAppointments();
          })
          .catch((err) => ui.showNotification(false, err.message));
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
    data:
      datasOptionsSelectInput.selectedIndex !== -1
        ? datasOptionsSelectInput.options[datasOptionsSelectInput.selectedIndex]
            .value
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
      ui.showNotification(response.success, response.message);
      addDataModal.classList.add("hidden");
      addDataModal.classList.remove("showed_modal");
      getAllOperations();
    })
    .catch((err) => ui.showNotification(false, err.message));
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
      ui.showNotification(true, response.message);
      addSessionModal.classList.remove("showed_modal");
      getAllOperations();
    })
    .catch((err) => ui.showNotification(false, err.message));
});

// show pics
const operationName = document.querySelector(".operation-name");

function showImagesBtn() {
  const showImagesBtns = document.querySelectorAll(".fa-regular.fa-images");
  showImagesBtns.forEach((element) => {
    element.addEventListener("click", (e) => {
      getOperationImages(
        e.target.parentElement.parentElement.dataset.operationid
      );
      modalSlider.classList.remove("hidden");
      operationName.textContent =
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
      ui.showNotification(response.success, response.message);
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
      modalEditData.classList.remove("hidden");
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
          console.log(response);
          let indexcontrol = response.serviceDatas.findIndex(
            (item) => item.dataName === e.target.parentElement.dataset.dataname
          );
          response.serviceDatas[indexcontrol].dataOptions.forEach((element) => {
            editDatasOptionSelect.innerHTML += `
              <option value="${element}">${element}</option>
              `;
          });
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
            ui.showNotification(true, response.message);
            modalEditData.classList.add("hidden");
            getAllOperations();
          })
          .then((err) => console.log(err));
      });
    });
  });
}

// close the slider modal

const xBtn = document.querySelector("#modal_slider i.fa-solid.fa-xmark");
xBtn.addEventListener("click", () => {
  modalSlider.classList.add("hidden");
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
      modalImage.classList.add("hidden");
      ui.showNotification(true, response.message);
      uploadFiles = [];
      imageInput.value = "";
      addPictureForm.uploadTime.value = "";
      getAllOperations();
    })
    .catch((err) => {
      ui.showNotification(false, err);
      console.log(err);
    });

  e.preventDefault();
}

async function getUserNotifications() {
  let notificationsArea=document.querySelector("#notifications-area")
  console.log(notificationsArea)
  await request
    .getwithUrl(document.location.pathname + "/getUserNotifications")
    .then((response) => {
      console.log(response);
      ui.showNotification(response.success, "Bildirim izinleri başarıyla çekildi");

      response.data.allNotifications.notifications.forEach((element) => {
        element.ispermitted = false;
      });
     
      response.data.userNotifications?.forEach((element) => {
        let index = response.data.allNotifications.notifications.findIndex(
          (item) => item.key === element
        );

        response.data.allNotifications.notifications[index].ispermitted = true;
      });
      notificationsArea.innerHTML = "";
      response.data.allNotifications.notificationGroups.forEach((element, index) => {
        notificationsArea.innerHTML += `
        <button class="accordion">
            <span>${element.name}</span>
            <i class="fa-solid fa-chevron-up"></i>
        </button>
        <div class="panel">
            <table class="table notifications-table">
                    <thead>
                        <th>Bildirim</th>
                        <th>Durum</th>
                    </thead>
                    <tbody>
                        
                        ${response.data.allNotifications.notifications.map(function(item){
                            if (item.category==="USERS"&&item.group===element.id) {
                              return `
                              <tr>
                              <td>${item.name}</td>
                            <td>
                                <label class="switch" name="notification-checkboxes" data-notificationkey="${item.key}">
                                <input type="checkbox"${(() => {
                                    if (item.ispermitted === true) {
                                      return `checked`;
                                    } else {
                                      return ``;
                                    }
                                  })()}>
                                <span class="slider round"></span>
                              </label>
                            </td>
                            </tr>
                              `
                            }
                        }
                          ).join("")}
                           
                        
                    </tbody>
                </table>
        </div>
    `;
    accordionHandle()
      });
    })
    .catch((err) => console.log(err));
}


// switches for notifications
notificationsArea.addEventListener("change",(e)=>{
  console.log("haho")
  console.log(e.target.parentElement)
  

  let data = { notificationkey: e.target.parentElement.dataset.notificationkey };
  request
    .postWithUrl(
      document.location.pathname + "/updateUserNotifications",
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
})


// accordion Menu
function accordionHandle(params) {
  var acc = document.getElementsByClassName("accordion");
            
  var i;
  
  for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
     
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      var icon = this.children[1];
      console.log(icon)
      if (panel.style.display === "block") {
          
      panel.style.display = "none";
      icon.style=`transform:rotate(0deg)`
      } else {
          console.log("burası2")
      panel.style.display = "block";
      icon.style=`transform:rotate(180deg)`
      }
  });
  }
}
