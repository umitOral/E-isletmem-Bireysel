import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();



const getSexStaticsBtn = document.querySelector(".sex-statics_btn")
const getPaymentStaticsBtn = document.querySelector(".payments_btn")
const getNewUsersStaticsBtn = document.querySelector(".new-users-statics_btn")
const getSexStaticsFilterBtn = document.querySelector(".sex-statics-filter-button")
const getNewUserSStaticsFilterBtn = document.querySelector(".new-users-statics-filter-button")


const startDate = document.querySelector(".start-date")
const endDate = document.querySelector(".end-date")





eventListeners()

function eventListeners() {

    getSexStaticsBtn.addEventListener("click", getSexStaticswithFilter)
    getPaymentStaticsBtn.addEventListener("click", getPaymentStaticsWithFilter)
    getNewUsersStaticsBtn.addEventListener("click", getNewUserStaticswithFilter)
    getSexStaticsFilterBtn.addEventListener("click", getSexStaticswithFilter)
    getNewUserSStaticsFilterBtn.addEventListener("click", getNewUserStaticswithFilter)
    startDate.addEventListener("change", dateRange)
}





function getSexStaticswithFilter(e) {
    request.getwithUrl(`/admin/statics/getSexStaticsWithFilter?startDate=${startDate.value}&endDate=${endDate.value}`)
        .then(response => {
            ui.showModal(true,response.message)
            ui.createChart(response)})
        .catch(err => console.log(err))
    e.preventDefault()
}

function getPaymentStaticsWithFilter(e) {
    request.getwithUrl(`/admin/statics/getPaymentStaticsWithFilter?startDate=${startDate.value}&endDate=${endDate.value}`)
        .then(response => {
            ui.showModal(true,response.message)
            ui.createChart(response)})
        .catch(err => console.log(err))
    e.preventDefault()
}

function getNewUserStaticswithFilter(e) {
    request.getwithUrl(`../getNewUserStaticswithFilter?startDate=${startDate.value}&endDate=${endDate.value}`)
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

const staticsBtn = document.querySelectorAll(".statics-menu ul li")
const everyFilterButtons = document.querySelectorAll(".buttons")
console.log(everyFilterButtons)

staticsBtn.forEach((element, index) => {

    element.addEventListener("click", () => {
        
        staticsBtn.forEach(element => {
            element.classList.remove("showed")
        });
        
        element.classList.add("showed")
        document.querySelector(".sub-header-statics h2").innerHTML=element.textContent

        everyFilterButtons.forEach(button => {
            button.style.display="none"
        });

        everyFilterButtons[index].style.display="block"
    })

    
    
    


});