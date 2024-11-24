import { Request } from "./requests.js";
const request = new Request();

import { UI } from "./ui.js";
const ui = new UI();
ui.closeNotification();


const cancelBtns = document.querySelectorAll(".btn.cancel.form-btn");

cancelBtns.forEach((element) => {
  element.addEventListener("click", () => {
    ui.closeAllModals();
  });
});

const loader = document.querySelector(".loader_wrapper.hidden");
const calendar = document.querySelector(".calendar"),
  calendarHead = document.querySelector(".calendar-head"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn");

const appointmentListDate = document.querySelector(".appointment-list");
const addUserBtn = document.querySelector("#add-user-btn");
const addUserModal = document.querySelector("#add_customer");
const addUserForm = document.querySelector("#add-user-form");
const userSelect = document.querySelector("#user-select");
const dataList = document.querySelector("#user-names");

let userID = "";
let useremail = "";

let APPOINTMENT_STATUS = [];
let slotDuration = "";
let scheduleStart = ""; // 08:00 in minutes
let scheduleEnd = ""; // 14:00 in minutes

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();
let selectedDate = today.toDateString();
let allAppointments = {};

showDatesAtPage();
getAllSessions();

addUserBtn.addEventListener("click", () => {
  addUserModal.classList.remove("hidden");
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
console.log(eventArea);
function createTimeline(workHours) {
  const times = [];
  const workStartTime = workHours.workStart;
  const workFinishTime = workHours.workEnd;
  const workPeriod = workHours.workPeriod;

  let beginHour = Number(workStartTime.split(":")[0]);
  let endHour = Number(workFinishTime.split(":")[0]);
  console.log(beginHour);
  console.log(endHour);
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
  console.log(times);
  times.forEach((element) => {
    eventArea.innerHTML += `
    <div class="time-div prevent-select" data-startHour="" data-endHour="">
    <span>
        ${new Date(element.startHour).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}

    </span>
    <div></div>
    </div>
 `;
  });
}

function getAllSessions() {
  request
    .getwithUrl(
      "/api/getSingleDayAllDoctorSessions/" + selectedDate.replaceAll("/", "-")
    )
    .then((response) => {
      console.log(response);
      const allDoctorDatas = response.allDoctorDatas;
      allAppointments = response.allDoctorDatas;
      slotDuration = response.workHours.workPeriod;
      scheduleStart = response.workHours.workStart.split(":")[0]*60;
      APPOINTMENT_STATUS = Object.values(response.APPOINTMENT_STATUS);

      if (response.allDoctorDatas.length === 0) {
        ui.showNotification(
          false,
          "Personel bulunamadı. Sol menüden kullanıcı ekleyin."
        );
      }
      //array

      createTimeline(response.workHours);

      ui.showAllSessionToUI(
        allDoctorDatas,
        response.workHours,
        APPOINTMENT_STATUS
      );
      
      appointmentUpdate();
      handleResize();
      changeState();
      getSessions();
    })

    .catch((err) => console.log(err));
}

function handleResize() {
  console.log("burası");
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
    element.addEventListener("mousedown", (e) =>
    {
      console.log("burası1");
      console.log(e.target);
      startResize(e, e.target.parentElement, "end")
    }
      
    );
  });
}

async function getSessions() {
  userSelect.addEventListener("change", () => {
    console.log(userSelect.value);
    let value = userSelect.value.replaceAll(" ", "");
    console.log(value);
    userID = document.querySelector(
      `#user-names option[data-userdata=${value}]`
    ).dataset.userid;
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
}

async function dayFullOrNight() {
  let responseData = {};
  await request
    .getwithUrl("/api/getDaysFullorNot/" + selectedDate)
    .then((response) => {
      responseData = response.sessionsFullorNot;
    })
    .catch((err) => console.log(err));

  return responseData;
}

function changeState() {
  const sessionOptionsModalOptions = document.querySelectorAll(
    ".session-options-modal span"
  );

  sessionOptionsModalOptions.forEach((element) => {
    element.addEventListener("click", (e) => {
      console.log(e.target);
      if (e.target.classList.contains("delete-session")) {
        request
          .deleteSession(
            "./appointments/" +
              e.target.parentElement.parentElement.parentElement.dataset
                .session +
              "/deleteAppointment"
          )
          .then((response) => {
            console.log(response);
            ui.showNotification(true, response.message);
            console.log("silme başarılı");
            getAllSessions();
          })
          .catch((err) => ui.showNotification(false, err));
      }

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
initCalender();
// calendar  ---------------------------------
async function initCalender() {
  loader.classList.toggle("showed");
  const fullorNot = await dayFullOrNight();

  const firstDay = new Date(year, month, 1); //mevcut ayın ilk gün tarihi
  const lastDay = new Date(year, month + 1, 0); //mevcut ayın son gün tarihi
  const prevLastDay = new Date(year, month, 0); //önceki ayın son gün tarihini

  const prevDays = prevLastDay.getDate(); // önceki ayın son günü
  const lastDate = lastDay.getDate(); // önceki ayın son günü
  const day = firstDay.getDay() - 1; // ilk gün değiştirilmiş hali

  const nextDays = 7 - lastDay.getDay();

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

const closeAddSessionBtn = document.querySelector("#cancel-add-appointment");

const modalAddAppointment = document.querySelector("#modal_add_session");

const doctorIDs = document.querySelectorAll(".doctor-id");

const startHour = document.querySelector(".startHour");
const endHour = document.querySelectorAll(".endHour");
const doctorNames = document.querySelectorAll(".doctor-name");
const dates = document.querySelectorAll(".event-date-from");
const userUpdate = document.querySelector("#user_update");
const sessionID = document.querySelector(".sessionID");

closeAddSessionBtn.addEventListener("click", () => {
  while (selected_proccess_type_new.firstChild) {
    selected_proccess_type_new.firstChild.remove();
  }
  while (selected_proccess_type_add.firstChild) {
    selected_proccess_type_add.firstChild.remove();
  }

  selectedOperations = {
    oldOperations: [],
    newOperations: [],
  };
  userSelect.value = "";
  proccessTypeNew.innerHTML += `<option value="" selected hidden disable>İşlem Seçiniz</option>`;
  orderSelect.innerHTML = `
    <option value="" selected hidden disable>Önce hasta seçiniz</option>
    `;
});

function addListener() {
  const days = document.querySelectorAll(".day");
  days.forEach((element) => {
    element.addEventListener("click", (e) => {
      // set current day active

      let activeDay = e.target.textContent.trim();

      selectedDate = year + "/" + (month + 1) + "/" + activeDay;

      ui.selectedDatetoAppointmentUI(selectedDate);
      ui.deleteAllSessionFromUI();
      getAllSessions();

      days.forEach((element) => {
        element.classList.remove("active");
      });
      // if prev month days clicked
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        setTimeout(() => {
          days.forEach((element) => {
            if (
              !element.classList.contains("prev-date") &&
              element.innerHTML === e.target.innerHTML
            ) {
              element.classList.add("active");
            }
          });
        }, 1000);
      }
      // if next mont days clicked
      else if (e.target.classList.contains("next-date")) {
        nextMonth();
        setTimeout(() => {
          days.forEach((element) => {
            if (
              !element.classList.contains("next-date") &&
              element.innerHTML === e.target.innerHTML
            ) {
              console.log(element);
              element.classList.add("active");
            }
          });
        }, 1000);
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
 
    modalAddAppointment.classList.remove("hidden");

    showAddEventModal(checkedElements);
  
});



     
function appointmentUpdate() {
  let appointments = document.querySelectorAll(".event");
  appointments.forEach(element => {
    element.addEventListener("click",()=>{
      modalEdit.classList.remove("hidden");
    })
  });
  
}

function showAddEventModal(e) {
  doctorIDs[0].value =
    e[0].parentElement.parentElement.parentElement.parentElement.dataset.doctorid;

  doctorNames[0].value =
    e[0].parentElement.parentElement.parentElement.previousSibling.previousSibling.textContent.trim();

  startHour.value = new Date(
    e[0].parentElement.parentElement.dataset.starthour
  ).toLocaleTimeString();

  endHour[0].value = new Date(
    e[e.length - 1].parentElement.parentElement.dataset.endhour
  ).toLocaleTimeString();

  dates[0].valueAsDate = new Date(
    e[0].parentElement.parentElement.dataset.starthour
  );

  modalAddAppointment.classList.remove("hidden");
}

let selectedValuesUpdate = [];

// **********************************************************************add session modal actions

const proccessType = document.querySelector(".proccess_type_add");
const proccessTypeNew = document.querySelector(".proccess_type_new");
const proccessTypeUpdate = document.querySelector(".proccess_type_update");

const modalUpdateSessionSave = document.querySelector(".save_update_button");

const selected_proccess_type_add = document.querySelector(
  ".selected_proccess_type_add"
);
const selected_proccess_type_new = document.querySelector(
  ".selected_proccess_type_new"
);
const selected_proccess_type_update = document.querySelector(
  ".selected_proccess_type_update"
);

addSessionForm.addEventListener("submit", (e) => {
  console.log("burası");
  const selectedDate = year + "-" + (month + 1) + "-" + activeDay;

  const services = [];

  addSessionForm.querySelectorAll(".selected_proccess").forEach((element) => {
    services.push(element.value);
  });

  let data = {
    operations: selectedOperations,
    appointmentData: {
      user: userID,
      startHour: addSessionForm.startHour.value,
      endHour: addSessionForm.endHour.value,
      doctor: addSessionForm.doctor.value,
      date: addSessionForm.date.value,
      description: addSessionForm.description.value,
    },
    userEmail: useremail,
  };
  console.log(data);
  request
    .postWithUrl("./appointments/createAppointment", data)
    .then((response) => {
      ui.showNotification(true, response.message);
      while (selected_proccess_type_add.firstChild) {
        selected_proccess_type_add.firstChild.remove();
      }
      while (selected_proccess_type_new.firstChild) {
        selected_proccess_type_new.firstChild.remove();
      }
      selectedOperations = {
        oldOperations: [],
        newOperations: [],
      };
      userSelect.value = "";
      proccessTypeNew.innerHTML += `<option value="" selected hidden disable>İşlem Seçiniz</option>`;
    })
    .then((response) => {
      console.log(response);
      getAllSessions(selectedDate);
    })

    .catch((err) => console.log(err));
  modalAddAppointment.classList.add("hidden");
});

// ///////////////////////////////////

let selectedOperations = {
  oldOperations: [],
  newOperations: [],
};
proccessType.addEventListener("change", (e) => {
  console.log("hizmet seçildi");

  selectedOperations.oldOperations.push({
    operationID:
      proccessType.options[proccessType.options.selectedIndex].dataset.id,
    nextSessionNumber:
      proccessType.options[proccessType.options.selectedIndex].dataset
        .nextsessionnumber,
  });
  console.log(selectedOperations);

  const proccessDiv = document.createElement("div");
  const nodeinput = document.createElement("input");
  nodeinput.value =
    proccessType.options[proccessType.options.selectedIndex].textContent.trim();
  nodeinput.setAttribute("name", "services");
  nodeinput.setAttribute("disabled", "");
  nodeinput.setAttribute("type", "text");
  nodeinput.setAttribute("class", "selected_proccess");
  nodeinput.setAttribute(
    "data-id",
    proccessType.options[proccessType.options.selectedIndex].dataset.id
  );
  nodeinput.setAttribute(
    "data-price",
    proccessType.options[proccessType.options.selectedIndex].dataset.price
  );

  nodeinput.setAttribute(
    "value",
    proccessType.options[proccessType.options.selectedIndex].textContent.trim()
  );
  nodeinput.setAttribute(
    "data-nextsessionnumber",
    proccessType.options[proccessType.options.selectedIndex].dataset
      .nextsessionnumber
  );

  proccessType.options[proccessType.options.selectedIndex].remove();

  const deleteButton = document.createElement("i");

  deleteButton.classList.add("ph");
  deleteButton.classList.add("ph-x");

  proccessDiv.appendChild(nodeinput);
  proccessDiv.appendChild(deleteButton);
  selected_proccess_type_add.appendChild(proccessDiv);
});
proccessTypeNew.addEventListener("change", (e) => {
  console.log("yeni hizmet seçildi");

  selectedOperations.newOperations.push({
    operationName:
      proccessTypeNew.options[proccessTypeNew.options.selectedIndex].value,
    operationPrice:
      proccessTypeNew.options[proccessTypeNew.options.selectedIndex].dataset
        .price,
    totalAppointments: 1,
    appointments: [],
  });
  console.log(selectedOperations);

  selected_proccess_type_new.innerHTML += `
          <div>
          <input name="services" disabled="" type="text" class="selected_proccess"
          data-id="${
            proccessTypeNew.options[proccessTypeNew.options.selectedIndex]
              .dataset.id
          }"
          data-price="${
            proccessTypeNew.options[proccessTypeNew.options.selectedIndex]
              .dataset.price
          }"
          value="${proccessTypeNew.options[
            proccessTypeNew.options.selectedIndex
          ].textContent.trim()}"><i class="ph ph-x">
          </i></div>
          `;
});

const orderSelect = document.getElementById("proccess_type_add");

selected_proccess_type_add.addEventListener("click", (e) => {
  if (e.target.classList.contains("ph-x")) {
    // add back to selectedbox

    let opt = document.createElement("option");
    opt.setAttribute(
      "data-price",
      e.target.previousElementSibling.dataset.price
    );
    opt.setAttribute(
      "data-nextsessionnumber",
      e.target.previousElementSibling.dataset.nextsessionnumber
    );
    opt.setAttribute("data-id", e.target.previousSibling.dataset.id);

    opt.value = e.target.previousElementSibling.value;
    opt.textContent = e.target.previousElementSibling.value;
    orderSelect.add(opt);

    // remove selected options
    selectedOperations.oldOperations.pop(e.target.previousElementSibling.value);
    e.target.parentElement.remove();
  }
});
selected_proccess_type_new.addEventListener("click", (e) => {
  if (e.target.classList.contains("ph-x")) {
    // remove selected options
    selectedOperations.newOperations.pop(e.target.previousElementSibling.value);
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
  console.log(rect)
  console.log(offsetY)
  console.log(timeIndex)
  console.log(scheduleStart)
  console.log(slotDuration)
  console.log(newTime)
  console.log(hours)
  console.log(minutes)
  console.log(newTimeString)
  
  if (dragType === "start") {
    console.log("deneme1")
    if (toMinutes(newTimeString) >= toMinutes(currentDrag.dataset.endhour)) return; // Prevent overlap
    currentDrag.dataset.startHour = newTimeString;
    currentDrag.style.top = `${timeIndex * 50}px`;
    
  } else if (dragType === "end") {
    
    if (toMinutes(newTimeString) <= toMinutes(currentDrag.dataset.starthour))
      {console.log("xxx")
      return; }// Prevent overlap
      console.log("xxx1")
    currentDrag.dataset.endhour = newTimeString;
    const height =
      ((toMinutes(currentDrag.dataset.endhour) -
        toMinutes(currentDrag.dataset.starthour)) /
        slotDuration) *
      50;
    currentDrag.style.height = `${height}px`;
  }
console.log(currentDrag)
  updateAppointmentLabel(currentDrag);
}

// Stop resizing
function stopResize() {
  if (currentDrag) {
    // Save changes to data
    // const result = allAppointments.flatMap(item => item.sessionsofdoctorforactualDay)
    // .find(session => session._id === appointment);
    console.log(currentDrag)
    const doctorId = currentDrag.parentElement.dataset.doctorid;
    console.log(doctorId)
    console.log(allAppointments)
    let indexcontrol=allAppointments.findIndex(
      (item)=>item.doctorInformations._id===doctorId
    )

    console.log(indexcontrol)
    const appointments = allAppointments[indexcontrol];
    const index = appointments.sessionsofdoctorforactualDay.findIndex(
      (app) =>
        app._id === currentDrag.dataset.session 
    );
    console.log(index)
    if (index !== -1) {
      appointments.sessionsofdoctorforactualDay[index].startHour = currentDrag.dataset.starthour;
      appointments.sessionsofdoctorforactualDay[index].endHour = currentDrag.dataset.endhour;
    }
  }

  currentDrag = null;
  dragType = null;
  document.removeEventListener("mousemove", resizeAppointment);
  document.removeEventListener("mouseup", stopResize);
}

// Update appointment label
function updateAppointmentLabel(appointment) {
  const content = appointment.querySelectorAll(".center span")[0];
  content.textContent = `${appointment.dataset.starthour} - ${appointment.dataset.endhour}`;
}

// @@TODO hemen buranın aşağısına bak önemli

// document.getElementById("edit-form").addEventListener("submit", (e) => {
//   e.preventDefault();
//   const updatedData = new FormData(e.target);
//   updateAppointment(appointment.id, Object.fromEntries(updatedData.entries()));
// });

// proccessTypeUpdate.addEventListener("change", (e) => {
//   if (
//     !selectedValuesUpdate.includes(
//       proccessTypeUpdate.options[
//         proccessTypeUpdate.options.selectedIndex
//       ].textContent.trim()
//     )
//   ) {
//     selectedValuesUpdate.push(
//       proccessTypeUpdate.options[
//         proccessTypeUpdate.options.selectedIndex
//       ].textContent.trim()
//     );
//     const proccessDiv = document.createElement("div");
//     const nodeinput = document.createElement("input");
//     nodeinput.value =
//       proccessTypeUpdate.options[
//         proccessTypeUpdate.options.selectedIndex
//       ].textContent.trim();
//     nodeinput.setAttribute("name", "services");
//     nodeinput.setAttribute("disabled", "");
//     nodeinput.setAttribute("type", "text");
//     nodeinput.setAttribute("class", "selected_proccess");
//     nodeinput.setAttribute(
//       "value",
//       proccessTypeUpdate.options[
//         proccessTypeUpdate.options.selectedIndex
//       ].textContent.trim()
//     );

//     const deleteButton = document.createElement("i");

//     deleteButton.classList.add("ph");
//     deleteButton.classList.add("ph-x");

//     proccessDiv.appendChild(nodeinput);
//     proccessDiv.appendChild(deleteButton);

//     selected_proccess_type_update.appendChild(proccessDiv);
//   } else {
//     console.log("hizmet zaten var");
//   }

//   const selectedProcess = document.querySelectorAll(
//     ".selected_proccess_type_update div i"
//   );
//   selectedProcess.forEach((element) => {
//     element.addEventListener("click", (e) => {
//       selectedValuesUpdate.pop(element.previousElementSibling.value);
//       element.parentElement.remove();
//     });
//   });
// });

// modalUpdateSessionSave.addEventListener("click", (e) => {
//   e.preventDefault();

//   let data = {
//     description: e.target.parentElement.parentElement.description.value,
//     services: selectedValuesUpdate,
//     user: userUpdate.options[userUpdate.options.selectedIndex].value,
//   };
//   request
//     .postWithUrl(
//       "./appointments/" +
//         e.target.parentElement.parentElement.sessionID.value +
//         "/updateAppointment",
//       data
//     )
//     .then((response) => {
//       ui.showNotification(true, response.message);
//       modalUpdateAppointment.classList.toggle("showed_modal");
//       getAllSessions();
//     })
//     .catch((err) => console.log(err));
// });
