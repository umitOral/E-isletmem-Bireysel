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





const eventArray = [
    {
        day: 22,
        month: 05,
        year: 2023,
        events: [
            {
                title: "ahmet bozkuş",
                time: "11:30-12:00",
                type: "bakım"
            },
            {
                title: "Mehmet Bekir",
                time: "12:00-12:30",
                type: "mezoterapi"
            }
        ]
    },
    {
        day: 23,
        month: 05,
        year: 2023,
        events: [
            {
                title: "Ayşe Hızma",
                time: "11:30-12:00",
                type: "saç ekimi"
            }
        ]
    },
    {
        day: 25,
        month: 05,
        year: 2023,
        events: [
            {
                title: "Ebru Dindar",
                time: "11:30-12:00",
                type: "Mezo"
            }
        ]
    }
]



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
            updateEvents(i)

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
const addSessionBtn = document.querySelector(".add-session")
const addEventWrapper = document.querySelector(".add-event-wrapper")
const closeAddSessionBtn = document.querySelector(".fa-close")
const addEventTitle = document.querySelector(".event-name")
const addEventFromTo = document.querySelector(".event-time-from")
const addEventTo = document.querySelector(".event-time-to")

addSessionBtn.addEventListener("click", showAddEventModal)
closeAddSessionBtn.addEventListener("click", closeAddEventModal)

function showAddEventModal() {
    addEventWrapper.classList.add("active")
}
function closeAddEventModal() {
    addEventWrapper.classList.remove("active")
}

// click outside of wrapper
document.addEventListener("click", (e) => {
    if (e.target !== addSessionBtn && !addEventWrapper.contains(e.target)) {
        addEventWrapper.classList.remove("active")
    }
})


addEventFromTo.addEventListener("input", (e) => {
    addEventFromTo.value = addEventFromTo.value.replace(/[^0-9:]/g, "")
    addEventFromTo.value = addEventFromTo.value.slice(0, 5)

    if (addEventFromTo.value.length == 2) {
        addEventFromTo.value += ":"
    }
    if (e.inputType === "deleteContentBackward") {
        if (addEventFromTo.value.length === 3) {
            addEventFromTo.value = addEventFromTo.value.slice(0, 2)
        }
    }

})

function addListener() {
    const days = document.querySelectorAll(".day")
    days.forEach(element => {
        element.addEventListener("click", (e) => {
            // set current day active
            activeDay = Number(e.target.innerHTML)

            getActiveDay(activeDay)
            updateEvents(Number(e.target.innerHTML))

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


function getActiveDay(number) {

    const day = new Date(year, month, number)
    const dayName = day.toString().split(" ")[0]

    const dayNameTurkish = dayToTurkish(dayName)

    eventDay.innerHTML = dayNameTurkish;
    eventDate.innerHTML = number + " " + months[month] + " " + year
}

function dayToTurkish(dayName) {

    const daysTurkish = {
        Mon: "Pazartesi", Tue: "Salı", Wed: "Çarşamba", Thu: "Perşembe", Fri: "Cuma", Sat: "Cumartesi", Sun: "Pazar"

    }

    return daysTurkish[dayName]

}

// show events -----------------------------------------------------------------

function updateEvents(date) {

    const days = document.querySelectorAll(".day")
    const lastDay = new Date(year, month + 1, 0);
    const lastDate = lastDay.getDate();

    let events = ""

    eventArray.forEach(event => {
        if (event.day === date &&
            event.month === month + 1 &&
            event.year === year
        ) {
            event.events.forEach(element => {
                events += `
                            <div class="event">
                                <div class="title">
                                    <i class="fa-solid fa-edit"></i>
                                    <i class="fa-solid fa-trash"></i>
                                    <span>${element.title}</span>
                                </div>
                                <div class="event-time">${element.time}</div>
                                <div class="event-time">${element.type}</div>
                            </div>
                            
                            
                `
            })

        }
    });

    if (events === "") {
        events += `
        <div class="no-event">
            <h3>No Event </h3>
        </div>
    `
    }
    eventsWrapper.innerHTML = events

}

// add event ------------------------------------------------------------------------------------------

addEventSubmit.addEventListener("click", () => {
    let eventTitle = addEventTitle.value,
        eventType = addEventType.options[addEventType.selectedIndex].textContent

    eventTimeFrom = addEventFromTo.value,
        eventTimeTo = addEventTo.value
    if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
        alert("Lütfen gerekli alanları doldurunuz.")
    }

    const timeFrom = convertTime(eventTimeFrom)
    const timeTo = convertTime(eventTimeTo)
    const newEvent = {
        title: eventTitle,
        time: timeFrom + "-" + timeTo,
        type: eventType
    }

    let eventAdded = false
    // check if eventArray is not emty

    if (eventArray.length > 0) {
        eventArray.forEach(item => {
            if (item.day === activeDay &&
                item.month === month + 1 &&
                item.year === year
            ) {
                eventArray.push(newEvent)
                eventAdded: true
            }
        })
    }
    // if eventAarray empty
    if (!eventAdded) {
        eventArray.push({
            day: activeDay,
            month: month + 1,
            year: year,
            events: [newEvent]
        })
    }

    addEventWrapper.classList.remove("active")
    addEventTitle.value = ""
    addEventFromTo.value = ""
    addEventTo.value = ""

    updateEvents(activeDay)

    const activeDayElement = document.querySelector(".day.active")
    if (!activeDayElement.classList.contains("event")) {
        activeDayElement.classList.add("event")
    }
})


function convertTime(time) {

    let timeArr = time.split(":");

    let timeHour = timeArr[0]
    let timeMinute = timeArr[1]
    time = timeHour + ":" + timeMinute

    return time

}

eventsWrapper.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-trash")) {
        const eventTitle = e.target.parentNode.lastElementChild.innerHTML

        eventArray.forEach(element => {
            if (element.day === activeDay &&
                element.month == month + 1 &&
                element.year === year
            ) {
                element.events.forEach((item, index) => {
                    if (item.title === eventTitle) {
                        element.events.splice(index, 1)
                    }
                })

                if (element.events.length === 0) {
                    eventArray.splice(eventArray.indexOf(element), 1)
                    const activeDayElement = document.querySelector(".day.active")
                    if (activeDayElement.classList.contains("event")) {
                        activeDayElement.classList.remove("event")
                    }

                }
            }
        })
    }
    updateEvents(activeDay)

})
