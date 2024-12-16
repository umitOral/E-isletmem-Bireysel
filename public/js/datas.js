
import { Request } from "./requests.js";
import { UI } from './ui.js'


const request = new Request();
const ui = new UI();
ui.closeNotification()


const addDataButton = document.querySelector("#add_data_btn")
const addOptionButtons = document.querySelectorAll(".add_option_btn")

const cancelBtns = document.querySelectorAll(".btn.cancel")


const modalDataAdd = document.querySelector("#add_data")
const modalOptionAdd = document.querySelector("#add_option")
const modalOptionEdit = document.querySelector("#edit_option")
const modalOptionEditBtns = document.querySelectorAll(".fa-pen-to-square")
const modalOptionDeleteBtns = document.querySelectorAll(".fa-trash")
const addDataForm = document.querySelector("#dataOption_form")
const editDataForm = document.querySelector("#dataEdit_form")



addDataButton.addEventListener("click", () => {
  modalDataAdd.classList.remove("hidden")
})

cancelBtns.forEach(element => {
  element.addEventListener("click", () => {
    ui.closeAllModals()
  })
});

addOptionButtons.forEach(element => {
  element.addEventListener("click",(e)=>{
    modalOptionAdd.classList.remove("hidden")
    addOptionsModalHandle(e)
  })
});



modalOptionEditBtns.forEach(element => {
  element.addEventListener("click", openEditModal)
});

modalOptionDeleteBtns.forEach(element => {
  element.addEventListener("click", (e) => {
    if (confirm("opsiyon silinecek onaylıyor musunuz?")) {
      request.getwithUrl("/admin/datas/deleteOptionofData/"+e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.id +
        "/" + e.target.parentElement.textContent.trim()
      )
        .then(response => {
          console.log(response)
          ui.showNotification(response.success, response.message)
          setTimeout(() => {
            window.location.reload();
          }, 800);
        })
        .catch(err => {
          console.log(err)
          ui.showNotification(err.success, err.message)
        })
    }
  })
});




function openEditModal(e) {
  console.log(e.target.parentElement.textContent.trim())
  modalOptionEdit.classList.remove("hidden")
  editDataForm.action = "/admin/datas/editOption/" + e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.id + "/" + e.target.parentElement.textContent.trim()
  editDataForm.dataOption.value = e.target.parentElement.textContent.trim()
}

function addOptionsModalHandle(e) {
  console.log(e.target.parentElement.parentElement.dataset.id)
  addDataForm.action = "/admin/datas/addOptiontoData/" + e.target.parentElement.parentElement.dataset.id
}




