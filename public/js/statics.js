import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();



const getSexStaticsBtn = document.querySelector(".sex-statics_btn")
const getNewUsersStaticsBtn = document.querySelector(".new-users-statics_btn")
const getSexStaticsFilterBtn = document.querySelector(".sex-statics-filter-button")
const getNewUserSStaticsFilterBtn = document.querySelector(".new-users-statics-filter-button")


const startDate = document.querySelector(".start-date")
const endDate = document.querySelector(".end-date")





eventListeners()

function eventListeners() {

    getSexStaticsBtn.addEventListener("click", getSexStaticswithFilter)
    getNewUsersStaticsBtn.addEventListener("click", getNewUserStaticswithFilter)
    getSexStaticsFilterBtn.addEventListener("click", getSexStaticswithFilter)
    getNewUserSStaticsFilterBtn.addEventListener("click", getNewUserStaticswithFilter)
    startDate.addEventListener("change", dateRange)
}





function getSexStaticswithFilter(e) {
    request.getwithUrl(`/admin/statics/getSexStaticsWithFilter?startDate=${startDate.value}&endDate=${endDate.value}`)
        .then(response => ui.createChart(response))
        .catch(err => console.log(err))
    e.preventDefault()
}

function getNewUserStaticswithFilter(e) {
    request.getwithUrl(`/admin/statics/getNewUserStaticswithFilter?startDate=${startDate.value}&endDate=${endDate.value}`)
        .then(response =>ui.createChart(response) )
        .catch(err => console.log(err))
    e.preventDefault()
}


function startingDate() {

    startDate.valueAsDate = new Date()
    endDate.valueAsDate = new Date()

}

startingDate()

function dateRange() {
    const value = startDate.value
    endDate.setAttribute("min", value)

}

//statics menu and showed buttons

const everyStatics = document.querySelectorAll(".statics-menu ul li")
const everyFilterButtons = document.querySelectorAll(".buttons")
console.log(everyFilterButtons)

everyStatics.forEach((element, index) => {

    element.addEventListener("click", () => {
        
        everyStatics.forEach(element => {
            element.style.backgroundColor = "white"
        });
        
        element.style.backgroundColor = "green"
        document.querySelector(".sub-header-statics h2").innerHTML=element.textContent

        everyFilterButtons.forEach(button => {
            button.style.display="none"
        });

        everyFilterButtons[index].style.display="block"
    })

    
    
    


});