
import { Request } from "./requests.js";
import {UI} from './ui.js'


const request = new Request();
const ui = new UI();


const addDataButton = document.querySelector("#add_data_btn")

const cancelBtns= document.querySelectorAll(".btn.cancel")
const addServiceOptionBtn= document.querySelectorAll(".add_serviceOption")

const modalDataAdd = document.querySelector("#add_data")
const modalOptionAdd = document.querySelector("#add_option")
const modalOptionEdit = document.querySelector("#edit_option")
const modalOptionEditBtns = document.querySelectorAll(".fa-pen-to-square")
const addDataForm = document.querySelector("#dataOption_form")
const editDataForm = document.querySelector("#dataEdit_form")



addDataButton.addEventListener("click", ()=>{
  modalDataAdd.classList.remove("hidden")
})

cancelBtns.forEach(element => {
  element.addEventListener("click",()=>{
    ui.closeAllModals()
  })
});

addServiceOptionBtn.forEach(element => {
  element.addEventListener("click", openAddOptionModal)
});

modalOptionEditBtns.forEach(element => {
  element.addEventListener("click", openEditModal)
});



function openEditModal(e) {
  console.log(e.target.parentElement.textContent.trim())
  modalOptionEdit.classList.remove("hidden")
  editDataForm.action="/admin/datas/editOption/"+e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.id+"/"+e.target.parentElement.textContent.trim()
  editDataForm.dataOption.value=e.target.parentElement.textContent.trim()
}

function openAddOptionModal(e) {
  console.log(e.target.parentElement.parentElement.dataset.id)
  modalOptionAdd.classList.remove("hidden")
  addDataForm.action="/admin/datas/addOptiontoData/"+e.target.parentElement.parentElement.dataset.id
}




