
const modalPayment = document.querySelector(".modal_payment")
const modalExpenses = document.querySelector(".expenses_payment")
const filterPaymentsButton = document.querySelector(".payments-filter-button")
const addPaymentButton = document.querySelector(".payments-add-button")
const addExpensesButton = document.querySelector(".expenses-add-button")
const cancelButtons = document.querySelectorAll(".cancel_button")

const smallModals = document.querySelectorAll(".edit_payment_small_modal")
const startDate = document.querySelector(".startDate")
const endDate = document.querySelector(".endDate")




import { Request } from "./requests.js";
import { UI } from "./ui.js";

const request = new Request()
const ui = new UI()





eventListeners()

function eventListeners() {

    addPaymentButton.addEventListener("click", addPaymentModalShow)
    addExpensesButton.addEventListener("click", addExpensesModalShow)
   
    
    filterPaymentsButton.addEventListener("click", filterPayment)
    startDate.addEventListener("change", dateRange)

}
cancelButtons.forEach(cancelbutton => {
    cancelbutton.addEventListener("click", cancelAddAction)
});


function filterPayment(e) {
    request.getwithUrl(`/admin/payments/getSearchedPayments?startDate=${startDate.value}&endDate=${endDate.value}`)
        .then(response => ui.showAllPaymensToUI(response))
        .catch(err => console.log(err))
    e.preventDefault()
}

const body=document.querySelector("body")

    body.addEventListener("click", handledEditButton)




function handledEditButton(e) {

 

    if (e.target.classList.contains("edit_payment")) {
        e.target.nextSibling.nextSibling.classList.toggle("showed_modal")
        
        
    }else{
        smallModals.forEach(modal => {
            modal.classList.remove("showed_modal")
        });
    }
    

    
    

}

function addPaymentModalShow() {
    
    modalPayment.classList.add("showed_modal")
}
function addExpensesModalShow() {
    
    modalExpenses.classList.add("showed_modal")
}

function cancelAddAction(e) {
    e.preventDefault()
    modalPayment.classList.remove("showed_modal")
    modalExpenses.classList.remove("showed_modal")
    
}



// start date
function startingDate() {

    startDate.valueAsDate = new Date()
    endDate.valueAsDate = new Date()

}

startingDate()

function dateRange() {
    const value = startDate.value
    endDate.setAttribute("min", value)

}