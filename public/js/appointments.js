import { Request } from "./requests.js";
const request = new Request();

import { UI } from "./ui.js";
const ui = new UI();
ui.closeNotification();

const cancelBtns = document.querySelectorAll(".btn.cancel.form-btn");
const deleteBtn = document.querySelector("#cancel-apppointment");

cancelBtns.forEach((element) => {
  element.addEventListener("click", () => {
    ui.closeAllModals();
  });
});

const loader = document.querySelector(".loader_wrapper.hidden");
const smallModal = document.querySelector(".small_modal");

let calendarHead = document.querySelector(".calendar-head"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn");

const appointmentListDate = document.querySelector(".appointment-list");
const addUserBtn = document.querySelector("#add-user-btn");
const addUserModal = document.querySelector("#add_customer");
const addUserForm = document.querySelector("#add-user-form");
const userSelect = document.querySelector("#user-select");
const userSelectForEdit = document.querySelector("#user-select-for-edit");
const doctorSelect = document.querySelector("#doctor-select-for-add");

const dataList = document.querySelector("#user-names");
const modalAddAppointment = document.querySelector("#modal_add_appointment");
const modalEditAppointment = document.querySelector("#modal_edit_appointment");
const formEditAppointment = document.querySelector("#edit-appointment-form");

let userID = "";
let doctorID = "";
let useremail = "";
let selectedAppointment = "";
let selectedAppointmentForEdit = "";
let appointmentsDiv;
let resizing = false;
let isResizing = false;

let workHours = "";

let APPOINTMENT_STATUS = [];
let slotDuration = "";
let scheduleStart = ""; // 08:00 in minutes

let today = new Date();
let activeDay = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();
let selectedDate = today.toString();
selectedDate = year + "-" + (month + 1) + "-" + activeDay;
let allAppointments = {};
console.log(selectedDate);

showDatesAtPage();
getAllSessions();
initCalender();

addUserBtn.addEventListener("click", () => {
  addUserModal.classList.remove("hidden");
});

deleteBtn.addEventListener("click", (e) => {
  modalEditAppointment.classList.remove("hidden");
  request
    .getwithUrl(
      "./appointments/" + selectedAppointmentForEdit._id + "/deleteAppointment"
    )
    .then((response) => {
      console.log(response);
      ui.showNotification(true, response.message);
      console.log("silme başarılı");
      getAllSessions();
    })
    .catch((err) => ui.showNotification(false, err));
});


addUserForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let data = {
    name: addUserForm.name.value,
    surname: addUserForm.surname.value,
    email: addUserForm.email.value,
    phone: addUserForm.phone.value,
    sex: addUserForm.sex.value,
    birthDate: addUserForm.birthDate.value,
    address: addUserForm.address.value,
    billingAddress: addUserForm.billingAddress.value,
  };

  request
    .postWithUrl("./users/createUser", data)
    .then((response) => {
      console.log(response);
      ui.showNotification(response.success, response.message);
      dataList.innerHTML += `
    <option data-userid="${response.data._id}" data-userdata="${
        response.data.name + response.data.surname
      }" value="${response.data.name + "" + response.data.surname}"></option>
    `;
      addUserModal.classList.add("hidden");
    })
    .catch((err) => console.log(err));
});

function showDatesAtPage(params) {
  if (params) {
    console.log(params);
    calendarHead.textContent = new Date(params).toLocaleDateString("locale", {
      month: "long",
      year: "numeric",
    });
  } else {
    calendarHead.textContent = today.toLocaleDateString([], {
      month: "long",
      year: "numeric",
    });
    appointmentListDate.textContent = today.toLocaleDateString([], {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  }
}

const eventArea = document.querySelector(".time-line-area");

function createTimeline(workHours, alldoctorDatas) {
  console.log(alldoctorDatas);
  const times = [];
  const workStartTime = workHours.workStart;
  const workFinishTime = workHours.workEnd;
  const workPeriod = workHours.workPeriod;

  let beginHour = Number(workStartTime.split(":")[0]);
  let endHour = Number(workFinishTime.split(":")[0]);

  for (
    let index = 0;
    index < (endHour - beginHour) * (60 / workPeriod);
    index++
  ) {
    //

    times[index] = {
      startHour: addMinutes(index * workPeriod),
      endHour: addMinutes((index + 1) * workPeriod),
    };
  }
  function addMinutes(minutes) {
    const date = new Date(`${selectedDate},${workStartTime}`);
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }

  eventArea.innerHTML = "";
  times.forEach((element) => {
    eventArea.innerHTML += `
    <div class="time-div prevent-select" data-startHour="${new Date(
      element.startHour
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}" data-endHour="${new Date(element.endHour).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}">
    <span>
        ${new Date(element.startHour).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}

    </span>
    ${alldoctorDatas
      .map((item) => {
        return `
          <div data-doctorid="${item.doctorInformations._id}"></div>
          `;
      })
      .join("")}
    
    </div>
 `;

    let timeSlots = document.querySelectorAll(".time-div");
    timeSlots.forEach((element) => {
      element.addEventListener("click", (e) => {
        handleAddAppointmentModal(element, e.target);
      });
    });
  });
}

function handleAddAppointmentModal(element, target) {
  modalAddAppointment.classList.remove("hidden");
  addSessionForm.startHour.value = element.dataset.starthour;
  addSessionForm.endHour.value = element.dataset.endhour;

  const [year, month, day] = selectedDate.split("-");

  const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  addSessionForm.date.value = isoDate;
  addSessionForm.doctor.options.selectedIndex = allAppointments.findIndex(
    (item) => item.doctorInformations._id === target.dataset.doctorid
  );
  doctorID = target.dataset.doctorid;
}

function getAllSessions() {
  request
    .getwithUrl(
      "/api/getSingleDayAllDoctorSessions/" + selectedDate.replaceAll("/", "-")
    )
    .then((response) => {
      console.log(response);
      allAppointments = response.allDoctorDatas;
      slotDuration = response.workHours.workPeriod;
      workHours = response.workHours;
      scheduleStart = response.workHours.workStart.split(":")[0] * 60;
      APPOINTMENT_STATUS = Object.values(response.APPOINTMENT_STATUS);

      if (response.allDoctorDatas.length === 0) {
        ui.showNotification(
          false,
          "Personel bulunamadı. Sol menüden kullanıcı ekleyin."
        );
      }
      //array

      createTimeline(response.workHours, response.allDoctorDatas);

      ui.showAllSessionToUI(
        allAppointments,
        response.workHours,
        APPOINTMENT_STATUS
      );
       appointmentsDiv = document.querySelectorAll(".event");
      appointmentEdit();
      handleResize();
      // changeState();
    })

    .catch((err) => console.log(err));
}

function handleResize() {
  let resizeTops = document.querySelectorAll(".resize-handle.top");
  resizeTops.forEach((element) => {
    element.addEventListener("mousedown", (e) => {
      console.log("burası1");
      console.log(e.target);
      startResize(e, e.target.parentElement, "start");
    });
  });

  let resizeBottoms = document.querySelectorAll(".resize-handle.bottom");
  resizeBottoms.forEach((element) => {
    element.addEventListener("mousedown", (e) => {
      console.log("burası1");
      console.log(e.target);
      startResize(e, e.target.parentElement, "end");
    });
  });
}

userSelect.addEventListener("change", () => {
  console.log(userSelect.value);
  let value = userSelect.value.replaceAll(" ", "");
  console.log(value);
  userID = document.querySelector(`#user-names option[data-userdata=${value}]`)
    .dataset.userid;
  useremail = document.querySelector(
    `#user-names option[data-userdata=${value}]`
  ).dataset.useremail;

  request
    .getwithUrl("./users/" + userID + "/getUsersContinueOperations")
    .then((response) => {
      console.log(response);
      ui.addOperationstoUI(response.operations);
    })
    .catch((err) => console.log(err));
});

userSelectForEdit.addEventListener("change", () => {
  let value = userSelectForEdit.value.replaceAll(" ", "");
  console.log(value);
  userID = document.querySelector(`#user-names option[data-userdata=${value}]`)
    .dataset.userid;
  useremail = document.querySelector(
    `#user-names option[data-userdata=${value}]`
  ).dataset.useremail;

  request
    .getwithUrl("./users/" + userID + "/getUsersContinueOperations")
    .then((response) => {
      console.log(response);

      ui.addOperationstoUIForEdit(response.operations, selectedAppointment);
    })
    .catch((err) => console.log(err));
});

doctorSelect.addEventListener("change", () => {
  console.log(doctorSelect.value);
  let value = doctorSelect.value.replaceAll(" ", "");
  console.log(value);
  doctorID =
    doctorSelect.options[doctorSelect.options.selectedIndex].dataset.doctorid;
});

async function dayFullOrNight() {
  let responseData = {};
  // await request
  //   .getwithUrl("/api/getDaysFullorNot/" + selectedDate)
  //   .then((response) => {
  //     responseData = response.sessionsFullorNot;
  //   })
  //   .catch((err) => console.log(err));

  return responseData;
}

function changeState() {
  const sessionOptionsModalOptions = document.querySelectorAll(
    ".session-options-modal span"
  );

  sessionOptionsModalOptions.forEach((element) => {
    element.addEventListener("click", (e) => {
      console.log(e.target);

      if (e.target.classList.contains("save-edit-button")) {
      }

      if (e.target.classList.contains("change-state")) {
        console.log(e.target.textContent);
        request
          .updateStateSession(
            "./appointments/" +
              e.target.parentElement.parentElement.parentElement.dataset
                .session +
              "/updateStateAppointment?state=" +
              e.target.textContent.toLowerCase()
          )
          .then((response) => {
            console.log(response);
            getAllSessions();
          })
          .catch((err) => console.log(err));
      }
    });
  });
}

// calendar  ---------------------------------
async function initCalender() {
  loader.classList.toggle("showed");
  const fullorNot = await dayFullOrNight();

  const firstDay = new Date(year, month, 1); //mevcut ayın ilk gün tarihi
  const lastDay = new Date(year, month + 1, 0); //mevcut ayın son gün tarihi
  const prevLastDay = new Date(year, month, 0); //önceki ayın son gün tarihini

  const prevDays = prevLastDay.getDate(); // önceki ayın son günü
  const lastDate = lastDay.getDate(); // önceki ayın son günü
  let day = firstDay.getDay() - 1; // ilk gün değiştirilmiş hali

  const nextDays = 7 - lastDay.getDay();
  if (day < 0) {
    day = day + 7;
  }
  let days = "";

  // prev days ----------------------------------------------------------------

  for (let x = day; x > 0; x--) {
    days += `
            <div class="day prev-date">${prevDays - x + 1}</div>`;
  }
  // current day and remaining day ----------------------------------------------------------------

  for (let i = 1; i <= lastDate; i++) {
    let full = false;

    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;

      if (fullorNot[i - 1] === true) {
        days += `
                <div class="day today active">${i}
                <div class="full-day"></div>
                </div> `;
      } else {
        days += `
                <div class="day today active">${i}
                <div class="empty-day"></div>
                </div> `;
      }
    } else {
      if (fullorNot[i - 1] === true) {
        days += `
                <div class="day">${i}
                <div class="full-day"></div>
                </div> `;
      } else {
        days += `
                <div class="day">${i}
                <div class="empty-day"></div>
                </div> `;
      }
    }
  }

  // --next day ----------------------------------------------------------------

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  loader.classList.toggle("showed");
  addListener();
}

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  selectedDate = year + "-" + (month + 1) + "-" + activeDay;
  console.log(selectedDate);
  showDatesAtPage(selectedDate);
  initCalender();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }

  selectedDate = year + "-" + (month + 1) + "-" + activeDay;
  console.log(selectedDate);
  showDatesAtPage(selectedDate);
  initCalender();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

// today   --------------------
todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalender();
});

// todo section --------------------------------------

const closeAddAppointmentBtn = document.querySelector(
  "#cancel-add-appointment"
);
const closeEditAppointmentnBtn = document.querySelector(
  "#cancel-edit-appointment"
);

closeAddAppointmentBtn.addEventListener("click", () => {
  while (selected_proccess.firstChild) {
    selected_proccess.firstChild.remove();
  }

  newAppointment.plannedOperations = [];
  userSelect.value = "";
  proccessTypeNew.innerHTML += `<option value="" selected hidden disable>İşlem Seçiniz</option>`;
  proccessType.innerHTML = `
    <option value="" selected hidden disable>Önce hasta seçiniz</option>
    `;
});

closeEditAppointmentnBtn.addEventListener("click", () => {
  while (selected_proccess_type_new_for_edit.firstChild) {
    selected_proccess_type_new_for_edit.firstChild.remove();
  }
  while (selected_proccess_type_add_for_edit.firstChild) {
    selected_proccess_type_add_for_edit.firstChild.remove();
  }

  selectedOperationsForEdit = {
    oldOperations: [],
    newOperations: [],
  };
  userSelectForEdit.value = "";
  proccessTypeNewForEdit.innerHTML += `<option value="" selected hidden disable>İşlem Seçiniz</option>`;
  proccessTypeForEdit.innerHTML = `
    <option value="" selected hidden disable>Önce hasta seçiniz</option>
    `;
});

function addListener() {
  const days = document.querySelectorAll(".day");
  days.forEach((element) => {
    element.addEventListener("click", (e) => {
      // set current day active
      console.log(element);
      activeDay = e.target.textContent.trim();
      console.log(activeDay);
      selectedDate = year + "-" + (month + 1) + "-" + activeDay;

      ui.selectedDatetoAppointmentUI(selectedDate);
      getAllSessions();

      days.forEach((element) => {
        element.classList.remove("active");
      });
      // if prev month days clicked
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        setTimeout(() => {
          let days = document.querySelectorAll(".day");
          days.forEach((element) => {
            if (
              !element.classList.contains("prev-date") &&
              element.textContent.trim() === e.target.textContent.trim()
            ) {
              element.classList.add("active");
            }
          });
        }, 300);
      }
      // if next mont days clicked
      else if (e.target.classList.contains("next-date")) {
        nextMonth();

        setTimeout(() => {
          let days = document.querySelectorAll(".day");
          days.forEach((element) => {
            if (
              !element.classList.contains("next-date") &&
              element.textContent.trim() === e.target.textContent.trim()
            ) {
              console.log(element);
              element.classList.add("active");
            }
          });
        }, 300);
      }
      // remaining current month days
      else {
        e.target.classList.add("active");
      }
    });
  });
}

// edit session modal area -----------------------------------------------------********----------
const addSessionBtn = document.querySelector("#add-session-btn");
const addSessionForm = document.getElementById("add-session-form");

addSessionBtn.addEventListener("click", function (e) {
  const [year, month, day] = selectedDate.split("-");

  const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  addSessionForm.date.value = isoDate;

  modalAddAppointment.classList.remove("hidden");
});

function appointmentEdit() {

  appointmentsDiv.forEach((element) => {
    element.addEventListener("click", (e) => {
      if (isResizing) {
        // Prevent modal from showing during resize
        isResizing = false;
        return;
      }
      e.stopPropagation()
      console.log(e.target)
      if (!e.target.classList.contains("resize-handle")) {
        selectedAppointmentForEdit = allAppointments
          .flatMap((item) => item.sessionsofdoctorforactualDay)
          .find((appointment) => appointment._id === element.dataset.session);

        console.log(selectedAppointmentForEdit);
        smallModal.dataset.appointmentid=element.dataset.session
        smallModal.classList.remove("hidden");
        smallModal.style.left = `${e.pageX}px`;
        smallModal.style.top = `${e.pageY}px`;
       
      }
    
    });

  });
}

document.addEventListener("click", (e) => {
  console.log(e.target)
  smallModal.classList.add("hidden")
  
});

smallModal.addEventListener("click", (e) => {
  // e.stopPropagation();
  if (e.target.classList.contains("edit-appointment")) {
    editModalHandle();
    
    modalEditAppointment.classList.remove("hidden");
  }
});


function editModalHandle() {
  console.log(selectedAppointment);
  formEditAppointment.startHour.value = selectedAppointmentForEdit.startHour;
  formEditAppointment.endHour.value = selectedAppointmentForEdit.endHour;
  formEditAppointment.date.value =
    selectedAppointmentForEdit.date.split("T")[0];
  formEditAppointment.description.value =
    selectedAppointmentForEdit.description;
  formEditAppointment.doctor.options.selectedIndex = allAppointments.findIndex(
    (item) =>
      item.doctorInformations._id === selectedAppointmentForEdit.doctor._id
  );
}

let selectedValuesUpdate = [];

// **********************************************************************add session modal actions

const proccessType = document.querySelector(".proccess_type_add");
const proccessTypeNew = document.querySelector(".proccess_type_new");

const proccessTypeForEdit = document.querySelector(
  ".proccess_type_add_for_edit"
);
const proccessTypeNewForEdit = document.querySelector(
  ".proccess_type_new_for_edit"
);

const selected_proccess = document.querySelector(".selected_proccess");
const selected_proccess_type_new = document.querySelector(
  ".selected_proccess_type_new"
);
const selected_proccess_type_add_for_edit = document.querySelector(
  ".selected_proccess_type_add_for_edit"
);
const selected_proccess_type_new_for_edit = document.querySelector(
  ".selected_proccess_type_new_for_edit"
);

addSessionForm.addEventListener("submit", (e) => {
  console.log("burası");
  const selectedDate = year + "-" + (month + 1) + "-" + activeDay;

  const services = [];

  addSessionForm.querySelectorAll(".selected_proccess").forEach((element) => {
    services.push(element.value);
  });

  let data = {
    appointmentData: {
      plannedOperations: newAppointment.plannedOperations,
      user: userID,
      startHour: addSessionForm.startHour.value,
      endHour: addSessionForm.endHour.value,
      doctor: doctorID,
      date: selectedDate,
      description: addSessionForm.description.value,
    },
    userEmail: useremail,
  };
  console.log(data);
  request
    .postWithUrl("./appointments/createAppointment", data)
    .then((response) => {
      ui.showNotification(true, response.message);
      while (selected_proccess.firstChild) {
        selected_proccess.firstChild.remove();
      }

      newAppointment.plannedOperations = [];
      userSelect.value = "";
      proccessTypeNew.innerHTML += `<option value="" selected hidden disable>İşlem Seçiniz</option>`;

      let indexcontrol1 = allAppointments.findIndex(
        (item) =>
          item.sessionsofdoctorforactualDay._id === response.data.doctor._id
      );

      allAppointments[indexcontrol1].sessionsofdoctorforactualDay.push(
        response.data
      );

      proccessType.innerHTML = `
      <option value="" selected hidden disable>Önce hasta seçiniz</option>
      `;
      addSessionForm.reset();
      getAllSessions();
    })

    .catch((err) => console.log(err));
  modalAddAppointment.classList.add("hidden");
});

// ///////////////////////////////////

let newAppointment = {
  plannedOperations: [],
};
let selectedOperationsForEdit = null;

proccessType.addEventListener("change", (e) => {
  console.log("hizmet seçildi");

  newAppointment.plannedOperations.push(
    proccessType.options[proccessType.options.selectedIndex].textContent.trim()
  );
  console.log(newAppointment);

  let proccessDiv = document.createElement("div");
  proccessDiv.innerHTML = `
  
        <input type="text"
          disabled
          name="services"
          class="selected_proccess"
          data-type="old"
          value="${proccessType.options[
            proccessType.options.selectedIndex
          ].textContent.trim()}"
        >
        <i class="ph ph-x"></i>
  
  `;

  proccessType.options[proccessType.options.selectedIndex].remove();

  selected_proccess.appendChild(proccessDiv);
});

proccessTypeForEdit.addEventListener("change", (e) => {
  console.log("hizmet seçildi");

  selectedOperationsForEdit.oldOperations.push({
    type: "old",
    operationID:
      proccessTypeForEdit.options[proccessTypeForEdit.options.selectedIndex]
        .dataset.id,
    nextSessionNumber:
      proccessTypeForEdit.options[proccessTypeForEdit.options.selectedIndex]
        .dataset.nextsessionnumber,
  });
  console.log(selectedOperationsForEdit);
  let proccessDiv = document.createElement("div");
  proccessDiv.innerHTML = `
  <input type="text"
          value="${proccessTypeForEdit.options[
            proccessTypeForEdit.options.selectedIndex
          ].textContent.trim()}"
          disabled
          name="services"
          data-type="new"
          class="selected_proccess"
          data-id="${
            proccessTypeForEdit.options[
              proccessTypeForEdit.options.selectedIndex
            ].dataset.id
          }"
          data-price="${
            proccessTypeForEdit.options[
              proccessTypeForEdit.options.selectedIndex
            ].dataset.price
          }"
          data-nextsessionnumber="${
            proccessTypeForEdit.options[
              proccessTypeForEdit.options.selectedIndex
            ].dataset.nextsessionnumber
          }">
        <i class="ph ph-x"></i>
  
  `;
  proccessTypeForEdit.options[proccessType.options.selectedIndex].remove();

  selected_proccess_type_add_for_edit.appendChild(proccessDiv);
});

proccessTypeNew.addEventListener("change", (e) => {
  console.log("yeni hizmet seçildi");
  console.log(newAppointment);

  newAppointment.plannedOperations.push(
    proccessTypeNew.options[proccessTypeNew.options.selectedIndex].value
  );
  console.log(selectedAppointment);

  selected_proccess.innerHTML += `
          <div>
          <input name="services" disabled="" type="text" class="selected_proccess"
          value="${proccessTypeNew.options[
            proccessTypeNew.options.selectedIndex
          ].textContent.trim()}"><i class="ph ph-x">
          </i></div>
          `;
});
proccessTypeNewForEdit.addEventListener("change", (e) => {
  console.log("yeni hizmet seçildi");
  console.log(selectedAppointmentForEdit);

  selectedAppointmentForEdit.push({
    newOperations: {
      type: "new",
      operationName:
        proccessTypeNewForEdit.options[
          proccessTypeNewForEdit.options.selectedIndex
        ].value,
      operationPrice:
        proccessTypeNewForEdit.options[
          proccessTypeNewForEdit.options.selectedIndex
        ].dataset.price,
      totalAppointments: 1,
      appointments: [],
    },
  });
  console.log(selectedAppointmentForEdit);

  selected_proccess_type_new_for_edit.innerHTML += `
          <div>
          <input name="services" disabled="" type="text" class="selected_proccess"
          data-id="${
            proccessTypeNewForEdit.options[
              proccessTypeNewForEdit.options.selectedIndex
            ].dataset.id
          }"
          data-price="${
            proccessTypeNewForEdit.options[
              proccessTypeNewForEdit.options.selectedIndex
            ].dataset.price
          }"
          value="${proccessTypeNewForEdit.options[
            proccessTypeNewForEdit.options.selectedIndex
          ].textContent.trim()}"><i class="ph ph-x">
          </i></div>
          `;
});

selected_proccess.addEventListener("click", (e) => {
  if (e.target.classList.contains("ph-x")) {
    // add back to selectedbox
    console.log(e.target);
    console.log(e.target.previousElementSibling);
    let opt = document.createElement("option");
    opt.value = e.target.previousElementSibling.value;
    opt.textContent = e.target.previousElementSibling.value;
    if (e.target.previousElementSibling.dataset.type === "old") {
      proccessType.add(opt);
    }

    // remove selected options
    let indexcontrol = newAppointment.plannedOperations.findIndex(
      (item) => item === e.target.textContent.trim()
    );
    newAppointment.plannedOperations.splice(indexcontrol, 1);
    e.target.parentElement.remove();
  }
});

// Global variables for drag state
let currentDrag = null;
let dragType = null;

// Render appointments with resize handlers

function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Start resizing
function startResize(event, appointment, type) {
  event.stopPropagation();
  console.log("start");
  resizing = true;
  isResizing = true;
  currentDrag = appointment;
  dragType = type;
  document.addEventListener("mousemove", resizeAppointment);
  document.addEventListener("mouseup", stopResize);
}

// Resize logic
function resizeAppointment(event) {
  if (!currentDrag) return;

  const rect = currentDrag.parentElement.getBoundingClientRect();

  const offsetY = event.clientY - rect.top;
  const timeIndex = Math.round(offsetY / 50); // Each slot is 50px tall
  const newTime = Number(scheduleStart) + timeIndex * slotDuration;
  const hours = String(Math.floor(newTime / 60)).padStart(2, "0");
  const minutes = String(newTime % 60).padStart(2, "0");
  const newTimeString = `${hours}:${minutes}`;
  // console.log(rect);
  // console.log(offsetY);
  // console.log(timeIndex);
  // console.log(scheduleStart);
  // console.log(slotDuration);
  // console.log(newTime);
  // console.log(hours);
  // console.log(minutes);
  // console.log(newTimeString);

  if (dragType === "start") {
    console.log("start");
    if (toMinutes(newTimeString) >= toMinutes(currentDrag.dataset.endhour))
      return; // Prevent overlap
    currentDrag.dataset.starthour = newTimeString;
    const height =
      ((toMinutes(currentDrag.dataset.endhour) -
        toMinutes(currentDrag.dataset.starthour)) /
        slotDuration) *
      50;
    currentDrag.style.height = `${height}px`;
    currentDrag.style.top = `${timeIndex * 50}px`;
  } else if (dragType === "end") {
    if (toMinutes(newTimeString) <= toMinutes(currentDrag.dataset.starthour)) {
      return;
    } // Prevent overlap

    currentDrag.dataset.endhour = newTimeString;
    const height =
      ((toMinutes(currentDrag.dataset.endhour) -
        toMinutes(currentDrag.dataset.starthour)) /
        slotDuration) *
      50;
    currentDrag.style.height = `${height}px`;
  }
}

// Stop resizing
async function stopResize() {
  if (currentDrag) {
    document.removeEventListener("mousemove", resizeAppointment);
    document.removeEventListener("mouseup", stopResize);
    resizing = false;
    setTimeout(() => {
      isResizing = false; // Reset resizing flag after a short delay
    }, 100);
    console.log(currentDrag);
    const doctorId = currentDrag.parentElement.dataset.doctorid;
    let indexcontrol = allAppointments.findIndex(
      (item) => item.doctorInformations._id === doctorId
    );

    console.log(indexcontrol);
    const appointments = allAppointments[indexcontrol];
    const index = appointments.sessionsofdoctorforactualDay.findIndex(
      (app) => app._id === currentDrag.dataset.session
    );
    let appointment = appointments.sessionsofdoctorforactualDay[index];
    console.log(index);
    if (
      currentDrag.dataset.starthour !== appointment.startHour ||
      currentDrag.dataset.endhour !== appointment.endHour
    ) {
      appointment.startHour = currentDrag.dataset.starthour;
      appointment.endHour = currentDrag.dataset.endhour;
      currentDrag.querySelector(
        ".center div span"
      ).textContent = `${currentDrag.dataset.starthour}-${currentDrag.dataset.endhour}`;

      await request
        .postWithUrl(
          "./appointments/" + appointment._id + "/updateAppointment",
          appointment
        )
        .then((response) => {
          if (response.success === true) {
            ui.showNotification(true, response.message);
            console.log(response);
            console.log("güncellendi");
            appointment = response.data;
            console.log(allAppointments);
          } else {
            ui.showNotification(false, response.message);
            getAllSessions();
          }
        })
        .catch((err) => {
          console.log(err);
          ui.showNotification(false, err);
        });

      currentDrag = null;
      dragType = null;
    }
   
  }
}

// Update appointment label

// @@TODO hemen buranın aşağısına bak önemli

// document.getElementById("edit-form").addEventListener("submit", (e) => {
//   e.preventDefault();
//   const updatedData = new FormData(e.target);
//   updateAppointment(appointment.id, Object.fromEntries(updatedData.entries()));
// });
