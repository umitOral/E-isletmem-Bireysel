
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
const eventDay = document.querySelector(".event-day")
const eventDate = document.querySelector(".event-date")
const addEventSubmit = document.querySelector(".add-event-btn")
const addEventType = document.querySelector(".proccess_type")
const deleteEvent = document.querySelector(".fa-trash")
const eventsWrapper = document.querySelector(".events")





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
]




let eventArray = []

function getAllSessions(selectedDate) {

    request.getdeneme("/api/getSingleDaySingleDoctorSessions/" + selectedDate)
        .then(response => {
            const AllSessions = response.sessionsAllDoctor
              //array

            console.log(AllSessions)
            let allTimesofSingleDoctor = []
            
            
            AllSessions.forEach(singleDoctorData=> {

                const times = [{ doctorName:singleDoctorData.doctorName },{ time: 0, value: "6:00-6:15" }, { time: 1, value: "6:15-6:30" }, { time: 2, value: "6:30-6:45" }, { time: 3, value: "6:45-7:00" }, { time: 4, value: "7:00-7:15" }]

                singleDoctorData.sessionsofdoctor.forEach((element, index) => {
                    times.splice(element.time, 1, element)

                });

                allTimesofSingleDoctor.push(times)


            });

            console.log(allTimesofSingleDoctor)



            ui.showAllSessionToUI(allTimesofSingleDoctor)


        })
        .catch(err => console.log(err))

}





// calender  ---------------------------------
function initCalender() {
    const firstDay = new Date(year, month, 1); //mevcut ayın ilk gün tarihi
    const lastDay = new Date(year, month + 1, 0);  //mevcut ayın son gün tarihi
    const prevLastDay = new Date(year, month, 0);  //önceki ayın son gün tarihini 

    const prevDays = prevLastDay.getDate();  // önceki ayın son günü
    const lastDate = lastDay.getDate();  // önceki ayın son günü
    const day = firstDay.getDay() - 1; // ilk gün değiştirilmiş hali

    const nextDays = 7 - lastDay.getDay();




    date.innerHTML = months[month] + " " + year

    let days = ""

    //event control


    // prev days ----------------------------------------------------------------

    for (let x = day; x > 0; x--) {

        days += `
            <div class="day prev-date">${prevDays - x + 1}</div>`

    }
    // current day and remaining day ----------------------------------------------------------------

    for (let i = 1; i <= lastDate; i++) {
        let event = false;


        eventArray.forEach(element => {
            if (element.day === i &&
                element.month === month + 1 &&
                element.year === year
            ) {
                event = true;

            }
        });

        if (i === new Date().getDate() &&
            year === new Date().getFullYear() &&
            month === new Date().getMonth()
        ) {

            activeDay = i;

            getActiveDay(i)



            if (event) {
                days += `
            <div class="day today event active">${i}</div> `
            }
            else {
                days += `
            <div class="day today active">${i}</div> `
            }
        } else {
            if (event) {
                days += `
            <div class="day event">${i}</div> `
            }
            else {
                days += `
            <div class="day">${i}</div> `
            }
        }

    }

    // --next day ----------------------------------------------------------------

    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next-date">${j}</div>`;


    }

    daysContainer.innerHTML = days
    addListener()

}


initCalender()

function prevMonth() {
    month--;
    if (month < 0) {
        month = 11
        year--;
    }
    initCalender()
}
function nextMonth() {
    month++;
    if (month > 11) {
        month = 0
        year++;
    }
    initCalender()
}

prev.addEventListener("click", prevMonth)
next.addEventListener("click", nextMonth)

// today   --------------------
todayBtn.addEventListener("click", () => {
    today = new Date()
    month = today.getMonth()
    year = today.getFullYear()
    initCalender()
})
dateInput.addEventListener("input", (e) => {
    // allow only numbers
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, "")
    // add / character after 2
    if (dateInput.value.length === 2) {
        dateInput.value += "/";

    }
    // dont allow more than 7 character
    if (dateInput.value.length > 7) {
        dateInput.value = dateInput.value.slice(0, 7)

    }

    // if backspace pressed
    if (e.inputType === "deleteContentBackward") {
        if (dateInput.value.length === 3) {
            dateInput.value = dateInput.value.slice(0, 2)
        }
    }
})

gotoBtn.addEventListener("click", goToDate)

function goToDate() {
    const dateArr = dateInput.value.split("/")
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length == 4) {
        month = dateArr[0] - 1;
        year = dateArr[1]
        initCalender()
    }

}


// todo section --------------------------------------


const closeAddSessionBtn = document.querySelector(".cancel_button")
const addEventTitle = document.querySelector(".event-name")
const addEventFromTo = document.querySelector(".event-time-from")
const addEventTo = document.querySelector(".event-time-to")
const modalAddSession = document.querySelector(".modal_session")
const doktorName = document.querySelector(".doktor-name")




closeAddSessionBtn.addEventListener("click", closeAddEventModal)



function closeAddEventModal() {


    modalAddSession.classList.remove("showed_modal")
}






function addListener() {
    const days = document.querySelectorAll(".day")
    days.forEach(element => {
        element.addEventListener("click", (e) => {
            // set current day active
            activeDay = Number(e.target.innerHTML)
            const activedate = Date()

            getActiveDay(activeDay)
            const activeDate = new Date(year, month, activeDay)
            if (month.toString().length == 1) {
                month = month + 1
                month = "0" + month
            }


            const selectedDate = year + "-" + month + "-" + activeDay

            ui.deleteAllSessionFromUI()
            getAllSessions(selectedDate)



            days.forEach(element => {
                element.classList.remove("active")
            });
            // if prev month days clicked
            if (e.target.classList.contains("prev-date")) {
                prevMonth()
                setTimeout(() => {
                    const days = document.querySelectorAll(".day")

                    days.forEach(element => {
                        if (!element.classList.contains("prev-date") &&
                            element.innerHTML === e.target.innerHTML
                        ) {
                            element.classList.add("active")
                        }
                    });
                }, 100);
            }
            // if next mont days clicked
            else if (e.target.classList.contains("next-date")) {
                nextMonth()
                setTimeout(() => {
                    const days = document.querySelectorAll(".day")

                    days.forEach(element => {
                        if (!element.classList.contains("next-date") &&
                            element.innerHTML === e.target.innerHTML
                        ) {
                            element.classList.add("active")
                        }
                    });
                }, 100);
            }
            // remaining current month days
            else {
                e.target.classList.add("active")

            }


        });
    });

}


// showing active days at top



function getActiveDay(i) {

    const day = new Date(year, month, i)
    const dayName = day.toString().split(" ")[0]

    const dayNameTurkish = dayToTurkish(dayName)

    eventDay.innerHTML = dayNameTurkish;
    eventDate.innerHTML = i + " " + months[month - 1] + " " + year

}

function dayToTurkish(dayName) {

    const daysTurkish = {
        Mon: "Pazartesi", Tue: "Salı", Wed: "Çarşamba", Thu: "Perşembe", Fri: "Cuma", Sat: "Cumartesi", Sun: "Pazar"

    }

    return daysTurkish[dayName]

}










//convert time  --------------
function convertTime(time) {

    let timeArr = time.split(":");

    let timeHour = timeArr[0]
    let timeMinute = timeArr[1]
    time = timeHour + ":" + timeMinute

    return time

}



// deneme kısmı -------------------------------------

const events = document.querySelectorAll(".right .event")

events.forEach(element => {
    element.addEventListener("click", () => {

        if (element.children[0].checked == false) {
            element.children[0].checked = true
            element.classList.add("active")

        } else {
            element.children[0].checked = false
            element.classList.remove("active")
        }
    })
})


// edit session modal area

const rightSection =document.querySelector(".right")


rightSection.addEventListener("click",sessionEditButtonHandled)

function sessionEditButtonHandled(e) {
    
    if (e.target.classList.contains("edit-session")) {
        
        e.target.nextSibling.nextSibling.classList.toggle("showed_modal")
    } else {
        
    }

    if (e.target.classList.contains("add-session")) {
        showAddEventModal(e)
    } else {
        
    }
   
}

function showAddEventModal(e) {
    
    doktorName.value=e.target.parentElement.parentElement.previousSibling.previousSibling.textContent.trim()
    modalAddSession.classList.add("showed_modal")
    
}