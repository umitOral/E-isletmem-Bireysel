
import { Request } from "./requests.js";
import {UI} from './ui.js'


const request = new Request();
const ui = new UI();


const saveButtons = document.querySelectorAll(".input_save_buttons");

const cancelButtonModal = document.querySelectorAll(".cancel_button");








//modal actions


const addDataButton = document.querySelector("#add_data_btn")
const allModals = document.querySelectorAll(".modal")

const modalCancelBtn= document.querySelectorAll(".cancel_button")
const addServiceOptionBtn= document.querySelectorAll(".add_serviceOption")

const modalDataAdd = document.querySelector(".add_data")
const modalOptionAdd = document.querySelector(".add_option")
const modalOptionEdit = document.querySelector(".edit_option")
const modalOptionEditBtns = document.querySelectorAll(".fa-pen-to-square")
const addDataForm = document.querySelector("#dataOption_form")
const editDataForm = document.querySelector("#dataEdit_form")



addDataButton.addEventListener("click", showModalAddData)

modalCancelBtn.forEach(element => {
  element.addEventListener("click", closeModal)
});

addServiceOptionBtn.forEach(element => {
  element.addEventListener("click", openAddOptionModal)
});

modalOptionEditBtns.forEach(element => {
  element.addEventListener("click", openEditModal)
});



function openEditModal(e) {
  console.log(e.target.parentElement.textContent.trim())
  modalOptionEdit.classList.add("showed_modal")
  editDataForm.action="/admin/datas/editOption/"+e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.id+"/"+e.target.parentElement.textContent.trim()
  editDataForm.dataOption.value=e.target.parentElement.textContent.trim()
}

function openAddOptionModal(e) {
  console.log(e.target.parentElement.parentElement.dataset.id)
  modalOptionAdd.classList.add("showed_modal")
  addDataForm.action="/admin/datas/addOptiontoData/"+e.target.parentElement.parentElement.dataset.id
  
}
function showModalAddData() {
  modalDataAdd.classList.add("showed_modal")
}

function closeModal(e) {
  e.preventDefault()
  allModals.forEach(element => {
    element.classList.remove("showed_modal")
  });
    
}


