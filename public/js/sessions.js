import { Request } from "./requests.js";
const request = new Request();

import { UI } from "./ui.js";
const ui = new UI();

const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date1"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input");
const eventDay = document.querySelector(".event-day");
const eventDate = document.querySelector(".event-date");

const addEventSubmit = document.querySelector(".add-event-btn");
const addEventType = document.querySelector(".proccess_type");
const deleteEvent = document.querySelector(".fa-trash");
const eventsWrapper = document.querySelector(".events");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "ocak",
  "şubat",
  "mart",
  "nisan",
  "mayıs",
  "haziran",
  "temmuz",
  "ağustos",
  "eylül",
  "ekim",
  "kasım",
  "aralık",
];
window.addEventListener("load", () => {
  eventDay.textContent = today.toLocaleDateString("locale", {
    weekday: "long",
  });
  eventDate.textContent = today.toLocaleDateString();
});
function getAllSessions(selectedDate) {
  if (selectedDate.length===9) {
    selectedDate=selectedDate.slice(0,8)+"0"+selectedDate.slice(8)
  }
  console.log(selectedDate)
  request
    .getwithUrl("/api/getSingleDaySingleDoctorSessions/" + selectedDate)
    .then((response) => {
      console.log(response);
      const sessionsAllDoctor = response.sessionsAllDoctor;
      const AllDoctor = response.doctors;
      const workHours = response.workHours;
      //array

      let allTimesofSingleDoctor = [];

      sessionsAllDoctor.forEach((singleDoctorData) => {
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
            startHour: addMinutes(index*workPeriod),
            endHour: addMinutes(((index+1)*workPeriod))
          };
        }
        function addMinutes(minutes) {
          const date = new Date(`${selectedDate},${workStartTime}`);
          date.setMinutes(date.getMinutes() + minutes);
        
          return date;
        }
       
        singleDoctorData.sessionsofdoctor.forEach((element, index) => {
          times.splice(
            element.timeIndexes[0],
            element.timeIndexes[1] - element.timeIndexes[0]+1,
            element
          );
        });

        allTimesofSingleDoctor.push(times);
      });
      
      
      ui.showAllSessionToUI(allTimesofSingleDoctor, AllDoctor);

     

      changeState(selectedDate);
      deneme();
    })

    .catch((err) => console.log(err));
}

function deneme() {
  const checkBoxes = document.querySelectorAll("input[type='checkbox']");

  checkBoxes.forEach((element, index) => {
    element.addEventListener("change", () => {
      if (element.checked) {
        console.log("checked");
      }
    });
  });
}




function changeState(selectedDate) {
 
  const sessionOptionsModalOptions = document.querySelectorAll(
    ".session-options-modal span"
  );
  sessionOptionsModalOptions.forEach((element) => {
    element.addEventListener("click", (e) => {
      console.log(e.target);
      if (e.target.classList.contains("delete-session")) {
        request
          .deleteSession(
            "./sessions/" +
              e.target.parentElement.parentElement.parentElement.dataset
                .session +
              "/deleteSession"
          )
          .then((response) => {
            console.log(response);
            getAllSessions(selectedDate);
          })
          .catch((err) => console.log(err));
      }

      if (e.target.classList.contains("save-edit-button")) {
      }

      if (e.target.classList.contains("change-state")) {
        request
          .updateStateSession(
            "./sessions/" +
              e.target.parentElement.parentElement.parentElement.dataset
                .session +
              "/updateStateSession?state=" +
              e.target.textContent
          )
          .then((response) => {
            console.log(response);
            getAllSessions(selectedDate);
          })
          .catch((err) => console.log(err));
      }
    });
  });
}
initCalender();
// calendar  ---------------------------------
function initCalender() {
  const firstDay = new Date(year, month, 1); //mevcut ayın ilk gün tarihi
  const lastDay = new Date(year, month + 1, 0); //mevcut ayın son gün tarihi
  const prevLastDay = new Date(year, month, 0); //önceki ayın son gün tarihini

  const prevDays = prevLastDay.getDate(); // önceki ayın son günü
  const lastDate = lastDay.getDate(); // önceki ayın son günü
  const day = firstDay.getDay() - 1; // ilk gün değiştirilmiş hali

  const nextDays = 7 - lastDay.getDay();

  date.innerHTML = months[month] + " " + year;

  let days = "";

  // prev days ----------------------------------------------------------------

  for (let x = day; x > 0; x--) {
    days += `
            <div class="day prev-date">${prevDays - x + 1}</div>`;
  }
  // current day and remaining day ----------------------------------------------------------------

  for (let i = 1; i <= lastDate; i++) {
    let event = false;

    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;

      getActiveDay(i);

      if (event) {
        days += `
                <div class="day today event active">${i}</div> `;
      } else {
        days += `
                <div class="day today active">${i}</div> `;
      }
    } else {
      if (event) {
        days += `
                <div class="day event">${i}</div> `;
      } else {
        days += `
                <div class="day">${i}</div> `;
      }
    }
  }

  // --next day ----------------------------------------------------------------

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  addListener();
}

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalender();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
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

// todayBtn.addEventListener("click", () => {
//   today = new Date();
//   month = today.getMonth();
//   year = today.getFullYear();
//   initCalender();
// });

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
const addEventTitle = document.querySelector(".event-name");
const addEventFromTos = document.querySelectorAll(".event-date-from");
const addEventTo = document.querySelector(".event-time-to");
const modalAddSession = document.querySelector(".modal_add_session");
const modalUpdateSession = document.querySelector(".modal_update_session");
const doctorIDs = document.querySelectorAll(".doctor-id");
const timeindexes = document.querySelectorAll(".timeIndex");

const timeValues = document.querySelectorAll(".timeValue");
const startHour = document.querySelectorAll(".startHour");
const endHour = document.querySelectorAll(".endHour");
const doctorNames = document.querySelectorAll(".doctor-name");

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
      
      let activeDay = Number(e.target.innerHTML);
      
      const activedate = Date();

      getActiveDay(activeDay);
      const activeDate = new Date(year, month, activeDay);
      if (month.toString().length == 1) {
        month = month + 1;
        month = month;
      }

      const selectedDate = year + "-" + (month+1) + "-" + activeDay;
      ui.selectedDatetoUI(selectedDate);
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

// showing active days at top

function getActiveDay(i) {
  const day = new Date(year, month, i);
  const dayName = day.toString().split(" ")[0];

  const dayNameTurkish = dayToTurkish(dayName);

  eventDay.innerHTML = dayNameTurkish;
}

function dayToTurkish(dayName) {
  const daysTurkish = {
    Mon: "Pazartesi",
    Tue: "Salı",
    Wed: "Çarşamba",
    Thu: "Perşembe",
    Fri: "Cuma",
    Sat: "Cumartesi",
    Sun: "Pazar",
  };

  return daysTurkish[dayName];
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

addSessionBtn.addEventListener("click", function () {
  const addSessionForm = document.getElementById("add-session-form");
  const checkBoxes = document.querySelectorAll(".event input[type='checkbox']");
  
  let checkedElements = [];
  checkBoxes.forEach((element, index) => {
    if (element.checked) {
      checkedElements.push(element);
    }
  });

  modalAddSession.classList.add("showed_modal");

  showAddEventModal(checkedElements, addSessionForm);
});

const rightSection = document.querySelector(".right");

rightSection.addEventListener("click", sessionEditButtonHandled);

function sessionEditButtonHandled(e) {
  const sessionOptionsModalOptions = document.querySelectorAll(
    ".session-options-modal"
  );

  if (e.target.classList.contains("edit-session")) {
    sessionOptionsModalOptions.forEach(element => {
      element.classList.remove("showed_modal")
    });
    e.target.nextSibling.nextSibling.classList.toggle("showed_modal");
  }else{
    
    
     
    sessionOptionsModalOptions.forEach(element => {
      element.classList.remove("showed_modal")
    });
  }

  if (e.target.classList.contains("edit-session-btn")) {
    showEditModal(e);
  }
}

function showAddEventModal(e, addSessionForm) {
  

 
  timeindexes[0].value = e[0].parentElement.parentElement.dataset.time;
  timeindexes[1].value =
    e[e.length - 1].parentElement.parentElement.dataset.time;

  doctorIDs[0].value =
    e[0].parentElement.parentElement.parentElement.parentElement.dataset.doctorid;

  doctorNames[0].value =
    e[0].parentElement.parentElement.parentElement.previousSibling.previousSibling.textContent.trim();

  timeValues[0].value = new Date(e[0].parentElement.dataset.hour);

  startHour[0].value = new Date(
    e[0].parentElement.parentElement.dataset.starthour
  ).toLocaleTimeString();
    
  endHour[0].value = new Date(
    e[e.length - 1].parentElement.parentElement.dataset.endhour
  ).toLocaleTimeString();

  addEventFromTos[0].valueAsDate = new Date(year, month, activeDay + 1);

  modalAddSession.classList.add("showed_modal");
}

function showEditModal(e) {
  modalUpdateSession.children[1].setAttribute(
    "action",
    "./sessions/" +
      e.target.parentElement.parentElement.parentElement.dataset.session +
      "/updateSession"
  );
  modalUpdateSession.classList.toggle("showed_modal");

  timeindexes[1].value =
    e.target.parentElement.parentElement.parentElement.dataset.timeindex;

  doctorIDs[1].value =
    e.target.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.doctorid;
  doctorNames[1].value =
    e.target.parentElement.parentElement.parentElement.parentElement.previousSibling.previousSibling.textContent.trim();
  timeValues[1].value = new Date(
    e.target.parentElement.parentElement.parentElement.dataset.timevalue
  );
  startHour[1].value = new Date(
    e.target.parentElement.parentElement.parentElement.dataset.timevalue
  ).toLocaleTimeString();
  addEventFromTos[1].valueAsDate = new Date(year, month - 1, activeDay + 1);
}


//add session modal actions

const proccessType = document.querySelector(".proccess_type");
const selected_proccess_type = document.querySelector(".selected_proccess_type");

proccessType.addEventListener("change",()=>{
    console.log("başarılı")
    const proccessDiv = document.createElement("div");
    const nodeinput = document.createElement("input");
    nodeinput.value =
      proccessType.options[proccessType.options.selectedIndex].textContent.trim();
    nodeinput.setAttribute("name", "services");
    nodeinput.setAttribute("disabled", "");
    nodeinput.setAttribute(
      "value",
      proccessType.options[proccessType.options.selectedIndex].textContent.trim()
    );
  
    const deleteButton = document.createElement("i");
    
    deleteButton.classList.add("ph");
    deleteButton.classList.add("ph-x");

    proccessDiv.appendChild(nodeinput);
    proccessDiv.appendChild(deleteButton)
    selected_proccess_type.appendChild(proccessDiv)

    const selectedProcess = document.querySelectorAll(".selected_proccess_type div i");
    selectedProcess.forEach(element => {
      element.addEventListener("click",(e)=>{
        element.parentElement.remove()
      })
    });  
})

