
// eventListeners()

// function eventListeners() {
//     document.addEventListener("DOMContentLoaded", getAllUsers)

// }

// function getAllUsers() {
//     request.getwithUrl("api/getAllUsers")
//         .then(response => ui.showAllUsersToUI(response))
//         .catch(err => console.log(err))
// }

// add costumer modal

const addCustomerButton = document.querySelector(".add_customer_btn")
const modalCustomerAdd = document.querySelector(".add_customer")
const modalCustomerCancel = document.querySelector(".cancel_button")

addCustomerButton.addEventListener("click", showModalAddCostumer)
modalCustomerCancel.addEventListener("click", closeModalAddCostumer)

function showModalAddCostumer() {
    modalCustomerAdd.classList.add("showed_modal")
}
function closeModalAddCostumer() {
    modalCustomerAdd.classList.remove("showed_modal")
}
