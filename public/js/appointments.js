import { Request } from "./requests.js";
const request = new Request();

import { UI } from "./ui.js";
const ui = new UI();

const loader = document.querySelector(".loader_wrapper.hidden");
const calendar = document.querySelector(".calendar"),
  calendarHead = document.querySelector(".calendar-head"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input");

const messageBox = document.querySelector(".information-modal");

const eventDay = document.querySelector(".event-day");
const appointmentListDate = document.querySelector(".appointment-list");

const addEventSubmit = document.querySelector(".add-event-btn");
const addEventType = document.querySelector(".proccess_type");
const deleteEvent = document.querySelector(".fa-trash");
const eventsWrapper = document.querySelector(".events");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();
let selectedDate = today.toDateString();
console.log(selectedDate);

showDatesAtPage();
getAllSessions();

function showDatesAtPage(params) {
  if (params) {
    console.log(params)
    calendarHead.textContent = new Date(params).toLocaleDateString("locale", {
      month: "long",
      year: "numeric",
    });
    // appointmentListDate.textContent = new Date(params).toLocaleDateString([], {
    //   weekday: "long",
    //   day: "2-digit",
    //   month: "2-digit",
    //   year: "2-digit",
    // });
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

function getAllSessions() {
  
  request
    .getwithUrl("/api/getSingleDayAllDoctorSessions/" + selectedDate)
    .then((response) => {
      console.log(response);
      const allDoctorAllSessions = response.allDoctorAllSessions;
      const AllDoctor = response.doctors;
      const workHours = response.workHours;
      
      //array

      let allTimesAllDoctor = [];
      
      allDoctorAllSessions.forEach((singleDoctorData) => {
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
            timeIndex: index,
            startHour: addMinutes(index * workPeriod),
            endHour: addMinutes((index + 1) * workPeriod),
          };
        }
        function addMinutes(minutes) {
          const date = new Date(`${selectedDate},${workStartTime}`);
          date.setMinutes(date.getMinutes() + minutes);

          return date;
        }
        
        

       singleDoctorData.sessionsofdoctorforactualDay.forEach((element, index) => {
         
          times.splice(
            element.timeIndexes[0],
            element.timeIndexes[1] - element.timeIndexes[0] + 1,
            element
          );
        });
        
        allTimesAllDoctor.push(times);
      });
      console.log(allTimesAllDoctor)
      
      ui.showAllSessionToUI(allTimesAllDoctor, AllDoctor);
      

      changeState();
    })

    .catch((err) => console.log(err));
}

async function dayFullOrNight() {

  let responseData={}
 await  request.getwithUrl("/api/getDaysFullorNot/" + selectedDate)
    .then((response) => {
      responseData=response.sessionsFullorNot
  })
  .catch(err=>console.log(err))

  return responseData
}

function changeState() {
  const sessionOptionsModalOptions = document.querySelectorAll(
    ".session-options-modal span"
  );

  sessionOptionsModalOptions.forEach((element) => {
    element.addEventListener("click", (e) => {
      console.log(e.target);
      if (e.target.classList.contains("delete-session")) {
        console.log("burası");
        request
          .deleteSession(
            "./appointments/" +
              e.target.parentElement.parentElement.parentElement.dataset
                .session +
              "/deleteAppointment"
          )
          .then((response) => {
            console.log(response);
            ui.showModal(true, response.message);
            console.log("silme başarılı");
            getAllSessions();
          })
          .catch((err) =>  ui.showModal(false, err));
      }

      if (e.target.classList.contains("save-edit-button")) {
      }

      if (e.target.classList.contains("change-state")) {
        request
          .updateStateSession(
            "./appointments/" +
              e.target.parentElement.parentElement.parentElement.dataset
                .session +
              "/updateStateAppointment?state=" +
              e.target.textContent
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
  const fullorNot= await  dayFullOrNight()
  console.log(fullorNot)

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

      if (fullorNot[i-1]===true) {
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
      if (fullorNot[i-1]===true) {
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
  console.log(selectedDate)
  showDatesAtPage(selectedDate)
  initCalender();
}

function nextMonth() {
  
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }

  selectedDate = year + "-" + (month + 1) + "-" + activeDay;
  showDatesAtPage(selectedDate)
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

dateInput.addEventListener("input", (e) => {
  // allow only numbers
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  // add / character after 2
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  // dont allow more than 7 character
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }

  // if backspace pressed
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", function goToDate() {
  const dateArr = dateInput.value.split("/");
  if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length == 4) {
    month = dateArr[0] - 1;
    year = dateArr[1];
    initCalender();
  }
});

// todo section --------------------------------------

const closeAddSessionBtns = document.querySelectorAll(".cancel_button");

const modalAddSession = document.querySelector(".modal_add_session");

const doctorIDs = document.querySelectorAll(".doctor-id");

const timeindexes = document.querySelectorAll(".timeIndex");

const startHour = document.querySelector(".startHour");
const endHour = document.querySelectorAll(".endHour");
const doctorNames = document.querySelectorAll(".doctor-name");
const dates = document.querySelectorAll(".event-date-from");
const userUpdate = document.querySelector("#user_update");
const sessionID = document.querySelector(".sessionID");

closeAddSessionBtns.forEach((element) => {
  element.addEventListener("click", () => {
    modalAddSession.classList.remove("showed_modal");
    modalUpdateSession.classList.remove("showed_modal");
  });
});

function addListener() {
  const days = document.querySelectorAll(".day");
  days.forEach((element) => {
    element.addEventListener("click", (e) => {
      // set current day active
      
      let activeDay = e.target.textContent.trim();

      const activeDate = new Date(year, month, activeDay);

      selectedDate = year + "-" + (month + 1) + "-" + activeDay;
      
      ui.selectedDatetoAppointmentUI(selectedDate);
      ui.deleteAllSessionFromUI();
      getAllSessions(selectedDate);
      
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
              console.log(element)
              element.classList.add("active");
            }
          });
        }, 100);
      }
      // remaining current month days
      else {
        e.target.classList.add("active");
      }
    });
  });
}

//convert time  --------------
function convertTime(time) {
  let timeArr = time.split(":");

  let timeHour = timeArr[0];
  let timeMinute = timeArr[1];  
  time = timeHour + ":" + timeMinute;

  return time;
}

// edit session modal area -----------------------------------------------------********----------
const addSessionBtn = document.querySelector("#add-session-btn");
const addSessionForm = document.getElementById("add-session-form");

addSessionBtn.addEventListener("click", function (e) {
  const checkBoxes = document.querySelectorAll(".event input[type='checkbox']");

  let checkedElements = [];
  checkBoxes.forEach((element, index) => {
    if (element.checked) {
      checkedElements.push(element);
    }
  });

  if (checkedElements.length === 0) {
    ui.showAlert("lütfen randevu saati seçiniz");
  } else {
    modalAddSession.classList.add("showed_modal");

    showAddEventModal(checkedElements);
  }
});

const rightSection = document.querySelector(".right");

rightSection.addEventListener("click", sessionEditButtonHandled);

function sessionEditButtonHandled(e) {
  const sessionOptionsModalOptions = document.querySelectorAll(
    ".session-options-modal"
  );

  if (e.target.classList.contains("edit-session")) {
    sessionOptionsModalOptions.forEach((element) => {
      element.classList.remove("showed_modal");
    });
    e.target.nextSibling.nextSibling.classList.toggle("showed_modal");
  } else {
    sessionOptionsModalOptions.forEach((element) => {
      element.classList.remove("showed_modal");
    });
  }

  if (e.target.classList.contains("edit-session-btn")) {
    showEditModal(e);
  }
}

function showAddEventModal(e) {
  timeindexes[0].value = e[0].parentElement.parentElement.dataset.time;
  timeindexes[1].value =
    e[e.length - 1].parentElement.parentElement.dataset.time;

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

  modalAddSession.classList.add("showed_modal");
}


const modalUpdateSession = document.querySelector(".modal_update_session");
let selectedValues = [];

function showEditModal(e) {
  const sessionID = modalUpdateSession.querySelector(".sessionID");
  const description = modalUpdateSession.querySelector(".description");
  const user = modalUpdateSession.querySelector(".user");
  
  request
    .getwithUrl(
      "./appointments/" +
        e.target.parentElement.parentElement.parentElement.dataset.session +
        "/getAppointment"
    )
    .then((response) => {
      console.log(response);
      
      sessionID.value=response.data._id
      description.value=response.data.description
      userUpdate.value=response.data.user._id
      console.log(response.data.user._id)
      selectedValues.forEach(element => {
        element.remove()
      });
      response.data.services.map(element=>selectedValues.push(element))

      //add response services to UI ************************************************

      selectedValues.forEach(element => {
        const proccessDiv = document.createElement("div");
      const nodeinput = document.createElement("input");
      
      
      nodeinput.setAttribute("name", "services");
      nodeinput.setAttribute("disabled", "");
      nodeinput.setAttribute("type", "text");
      nodeinput.setAttribute("class", "selected_proccess");
      nodeinput.setAttribute(
        "value",element
      );
  
      const deleteButton = document.createElement("i");
  
      deleteButton.classList.add("ph");
      deleteButton.classList.add("ph-x");
  
      proccessDiv.appendChild(nodeinput);
      proccessDiv.appendChild(deleteButton);
      selected_proccess_type_update.appendChild(proccessDiv);
      });
      

      const selectedProcess = document.querySelectorAll(
        ".selected_proccess_type_update div i"
      );
      console.log(selectedProcess)
      selectedProcess.forEach((element) => {
        element.addEventListener("click", (e) => {
          
          selectedValues.pop(element.previousElementSibling.value)
          element.parentElement.remove();
          console.log(selectedValues)
        });
      });
      
      
      
    })
    .catch((err) => console.log(err));
  
   

    

  modalUpdateSession.classList.toggle("showed_modal");
}

// **********************************************************************add session modal actions

const proccessType = document.querySelector(".proccess_type_add");
const proccessTypeUpdate = document.querySelector(".proccess_type_update");

const modalAddSessionSave = document.querySelector(".save_button");
const modalUpdateSessionSave = document.querySelector(".save_update_button");

const selected_proccess_type_add = document.querySelector(
  ".selected_proccess_type_add"
);
const selected_proccess_type_update = document.querySelector(
  ".selected_proccess_type_update"
);

modalAddSessionSave.addEventListener("click", (e) => {
  const selectedDate = year + "-" + (month + 1) + "-" + activeDay;

  const services = [];

  addSessionForm.querySelectorAll(".selected_proccess").forEach((element) => {
    services.push(element.value);
  });

  console.log(services);

  let data = {
    services: services,
    user: addSessionForm.user.value,
    timeIndexes: [
      addSessionForm.timeIndexes[0].value,
      addSessionForm.timeIndexes[1].value,
    ],
    startHour: addSessionForm.startHour.value,
    endHour: addSessionForm.endHour.value,
    doctor: addSessionForm.doctor.value,
    date: addSessionForm.date.value,
    description: addSessionForm.description.value,
  };
  request
    .postWithUrl("./appointments/createAppointment", data)
    .then((response) =>{ui.showModal(true, response.message)})
    .then((response) => getAllSessions(selectedDate))
    
    .catch((err) => console.log(err));
  modalAddSession.classList.remove("showed_modal");
});


proccessType.addEventListener("change", () => {
  console.log("hizmet seçildi");
  let selectedValues = [];
  if (
    !selectedValues.includes(
      proccessType.options[
        proccessType.options.selectedIndex
      ].textContent.trim()
    )
  ) {
    selectedValues.push(
      proccessType.options[
        proccessType.options.selectedIndex
      ].textContent.trim()
    );
    const proccessDiv = document.createElement("div");
    const nodeinput = document.createElement("input");
    nodeinput.value =
      proccessType.options[
        proccessType.options.selectedIndex
      ].textContent.trim();
    nodeinput.setAttribute("name", "services");
    nodeinput.setAttribute("disabled", "");
    nodeinput.setAttribute("type", "text");
    nodeinput.setAttribute("class", "selected_proccess");
    nodeinput.setAttribute(
      "value",
      proccessType.options[
        proccessType.options.selectedIndex
      ].textContent.trim()
    );

    const deleteButton = document.createElement("i");

    deleteButton.classList.add("ph");
    deleteButton.classList.add("ph-x");

    proccessDiv.appendChild(nodeinput);
    proccessDiv.appendChild(deleteButton);
    selected_proccess_type_add.appendChild(proccessDiv);
  } else {
    console.log("hizmet zatern var");
  }

  const selectedProcess = document.querySelectorAll(
    ".selected_proccess_type_add div i"
  );
  selectedProcess.forEach((element) => {
    element.addEventListener("click", (e) => {
      
      selectedValues.pop(element.previousElementSibling.value)
      element.parentElement.remove();
      console.log(selectedValues)
    });
  });
  
});


proccessTypeUpdate.addEventListener("change", () => {
  console.log("hizmet seçildi");
  
  if (
    !selectedValues.includes(
      proccessTypeUpdate.options[
        proccessTypeUpdate.options.selectedIndex
      ].textContent.trim()
    )
  ) {
    selectedValues.push(
      proccessTypeUpdate.options[
        proccessTypeUpdate.options.selectedIndex
      ].textContent.trim()
    );
    const proccessDiv = document.createElement("div");
    const nodeinput = document.createElement("input");
    nodeinput.value =
    proccessTypeUpdate.options[
      proccessTypeUpdate.options.selectedIndex
      ].textContent.trim();
    nodeinput.setAttribute("name", "services");
    nodeinput.setAttribute("disabled", "");
    nodeinput.setAttribute("type", "text");
    nodeinput.setAttribute("class", "selected_proccess");
    nodeinput.setAttribute(
      "value",
      proccessTypeUpdate.options[
        proccessTypeUpdate.options.selectedIndex
      ].textContent.trim()
    );

    const deleteButton = document.createElement("i");

    deleteButton.classList.add("ph");
    deleteButton.classList.add("ph-x");

    proccessDiv.appendChild(nodeinput);
    proccessDiv.appendChild(deleteButton);
    selected_proccess_type_update.appendChild(proccessDiv);
  } else {
    console.log("hizmet zaten var");
  }

  const selectedProcess = document.querySelectorAll(
    ".selected_proccess_type_update div i"
  );
  selectedProcess.forEach((element) => {
    element.addEventListener("click", (e) => {
      
      selectedValues.pop(element.previousElementSibling.value)
      element.parentElement.remove();
      console.log(selectedValues)
    });
  });
  console.log(selectedValues)
});

modalUpdateSessionSave.addEventListener("click", (e) => {
  e.preventDefault();

  let data = {
    description: e.target.parentElement.parentElement.description.value,
    services:selectedValues,
    user:userUpdate.options[userUpdate.options.selectedIndex].value
  };
  request
    .postWithUrl(
      "./appointments/" +
        e.target.parentElement.parentElement.sessionID.value +
        "/updateAppointment",
      data
    )
    .then((response) => {
      ui.showModal(true, response.message);
      modalUpdateSession.classList.toggle("showed_modal");
      getAllSessions()
    })
    .catch((err) => console.log(err));
});
