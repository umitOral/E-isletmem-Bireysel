
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






function getAllSessions(selectedDate) {
    

    request.getwithUrl("/api/getSingleDaySingleDoctorSessions/" + selectedDate)
        .then(response => {
            
            const sessionsAllDoctor = response.sessionsAllDoctor
            const AllDoctor = response.doctors
            const workHours = response.workHours
            //array


            let allTimesofSingleDoctor = []



            sessionsAllDoctor.forEach(singleDoctorData => {
                const times = []
                const begin = workHours.workStart
                const end = workHours.workEnd

                let beginHour = Number(begin.split(":")[0])
                let endHour = Number(end.split(":")[0])

                for (let index = 0; index < (endHour - beginHour) * 4; index++) {
                    const date = new Date(`${selectedDate},${begin}`);
                    // 
                    let newDate = addMinutes(date, index * 15)
                    times[index] = { "time": index, "value": date }
                }



                singleDoctorData.sessionsofdoctor.forEach((element, index) => {

                    times.splice((element.timeIndex), 1, element)


                });


                allTimesofSingleDoctor.push(times)


            });





            ui.showAllSessionToUI(allTimesofSingleDoctor, AllDoctor)

            changeState(selectedDate)


        })

        .catch(err => console.log(err))



}

function addMinutes(date, minutes) {

    date.setMinutes(date.getMinutes() + minutes);

    return date;
}

function changeState(selectedDate) {
    const sessionOptionsModalOptions = document.querySelectorAll(".session-options-modal span")

    sessionOptionsModalOptions.forEach(element => {
        element.addEventListener("click", (e) => {
                console.log(e.target)
            if (e.target.classList.contains("delete-session")) {

                request.deleteSession("./sessions/" + e.target.parentElement.parentElement.parentElement.dataset.session + "/deleteSession")
                    .then(response => {
                        console.log(response)
                        getAllSessions(selectedDate)
                    })
                    .catch(err => console.log(err))
            }

            if (e.target.classList.contains("save-edit-button")) {
                
                
            }

            if (e.target.classList.contains("change-state")) {

                request.updateStateSession("./sessions/" + e.target.parentElement.parentElement.parentElement.dataset.session + "/updateStateSession?state=" + e.target.textContent)
                    .then(response => {
                        console.log(response)
                        getAllSessions(selectedDate)
                    })
                    .catch(err => console.log(err))
            }

        })
    });
}







// calendar  ---------------------------------
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


const closeAddSessionBtns = document.querySelectorAll(".cancel_button")
const addEventTitle = document.querySelector(".event-name")
const addEventFromTos = document.querySelectorAll(".event-date-from")
const addEventTo = document.querySelector(".event-time-to")
const modalAddSession = document.querySelector(".modal_add_session")
const modalUpdateSession = document.querySelector(".modal_update_session")
const doctorIDs = document.querySelectorAll(".doctor-id")
const timeIndexs = document.querySelectorAll(".timeIndex")
const timeValues = document.querySelectorAll(".timeValue")
const hourValues = document.querySelectorAll(".hourValue")
const doctorNames = document.querySelectorAll(".doctor-name")





closeAddSessionBtns.forEach(element => {
    element.addEventListener("click", () => {
        modalAddSession.classList.remove("showed_modal")
        modalUpdateSession.classList.remove("showed_modal")
        
        
    })
});




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
            ui.selectedDatetoUI(selectedDate)
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
                }, 1000);
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






// edit session modal area

const rightSection = document.querySelector(".right")


rightSection.addEventListener("click", sessionEditButtonHandled)

function sessionEditButtonHandled(e) {

    if (e.target.classList.contains("edit-session")) {
        
        e.target.nextSibling.nextSibling.classList.toggle("showed_modal")
    }

    if (e.target.classList.contains("add-session")) {
        showAddEventModal(e)
    }
    if (e.target.classList.contains("edit-session-btn")) {
        showEditModal(e)
        
    }
    

}


function showAddEventModal(e) {
    

   

    timeIndexs[0].value = e.target.parentElement.dataset.time
    doctorIDs[0].value =e.target.parentElement.parentElement.parentElement.dataset.doctorid
    
    doctorNames[0].value = e.target.parentElement.parentElement.previousSibling.previousSibling.textContent.trim()

    timeValues[0].value = new Date(e.target.parentElement.dataset.hour)
    hourValues[0].value = new Date(e.target.parentElement.dataset.hour).toLocaleTimeString()

    addEventFromTos[0].valueAsDate = new Date(year, month - 1, activeDay + 1)
    modalAddSession.classList.add("showed_modal")
    console.log(typeof(timeIndexs[0].value))

}

function showEditModal(e) {
   
    modalUpdateSession.children[1].setAttribute("action","./sessions/"+e.target.parentElement.parentElement.parentElement.dataset.session+"/updateSession")
    modalUpdateSession.classList.toggle("showed_modal")

    timeIndexs[1].value = e.target.parentElement.parentElement.parentElement.dataset.timeindex
    
    doctorIDs[1].value = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.doctorid
    doctorNames[1].value=e.target.parentElement.parentElement.parentElement.parentElement.previousSibling.previousSibling.textContent.trim()
    timeValues[1].value =new Date(e.target.parentElement.parentElement.parentElement.dataset.timevalue)
    hourValues[1].value =new Date(e.target.parentElement.parentElement.parentElement.dataset.timevalue).toLocaleTimeString()
    addEventFromTos[1].valueAsDate = new Date(year, month - 1, activeDay + 1)

}

