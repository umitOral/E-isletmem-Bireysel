
const modalPayment = document.querySelector(".modal_payment")
const modalExpenses = document.querySelector(".expenses_payment")
const filterPaymentsButton = document.querySelector(".payments-filter-button")
const addPaymentButton = document.querySelector(".payments-add-button")
const addExpensesButton = document.querySelector(".expenses-add-button")
const cancelButtons = document.querySelectorAll(".cancel_button")
const editPaymentModal = document.querySelector(".modal_edit_payment")




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


const body = document.querySelector("body")

body.addEventListener("click", handledEditButton)


const deletePaymentButtons = document.querySelectorAll(".delete-payment")
const editPaymentButtons = document.querySelectorAll(".edit-payment-btn")



deletePaymentButtons.forEach(element => {
    element.addEventListener("click", (e) => {
        if (confirm("silinecek onaylıyor musunuz?")) {

            request.deletePayment("./payments/" + e.target.value + "/deletePayment")
                .then(response => ui.deletePaymentFromUI(e.target.parentElement.parentElement.parentElement))
                .catch(err => console.log(err))
        } else {
            console.log("vazgeçildi")
        }
    })
});

const paymentValue = document.querySelector("#payment-value")
const paymentDescription = document.querySelector("#description")
const paymentCreditCartRatio = document.querySelector("#credit_card_ratio")
const paymentCCashRatio = document.querySelector("#cash_ratio")
const editPaymentForm = document.querySelector("#edit-payment-form")


editPaymentButtons.forEach(element => {
    element.addEventListener("click", (e) => {
        editPaymentModal.classList.add("showed_modal")
        const paymentURL="./payments/"+e.target.value+"/editPayment"
        paymentValue.value =e.target.parentElement.parentElement.parentElement.children[3].innerHTML.trim()
        paymentDescription.value =e.target.parentElement.parentElement.parentElement.children[2].innerHTML.trim()
        editPaymentForm.setAttribute("action",paymentURL)
        if (e.target.parentElement.parentElement.parentElement.children[4].innerHTML.trim()==="Nakit") {
            paymentCCashRatio.checked=true
        } else {
            paymentCreditCartRatio.checked=true
        }
    })
});




function  handledEditButton (e)  {
    const smallModals = document.querySelectorAll(".edit_payment_small_modal")

    if (e.target.classList.contains("edit_payment")) {
        smallModals.forEach(modal => {
            modal.classList.remove("showed_modal")
            console.log(e.target.nextSibling.nextSibling)
        });
        
        e.target.nextSibling.nextSibling.classList.toggle("showed_modal")


    } else {
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
    editPaymentModal.classList.remove("showed_modal")

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