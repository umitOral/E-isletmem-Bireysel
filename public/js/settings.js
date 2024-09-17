
import {UI} from './ui.js'
const ui=new UI()
ui.closeNotification()


const showContentsBtns = document.querySelectorAll(".show-content")
const contents = document.querySelectorAll(".userInformationsContent")
const userID = document.querySelector(".userID").dataset.user



const editBtn = document.querySelector(".edit-informations-btn")
const changePassworForm = document.getElementById("change-password-form")

const informationForm = document.getElementById("informations-form")
const cancelBtns = document.querySelectorAll(".cancel.form-btn")

// modals
const modalUser = document.querySelector("#modal_user")

import { Request } from "./requests.js";
const request = new Request()


eventListeners()

function eventListeners() {
    
    editBtn.addEventListener("click", ()=>modalUser.classList.remove("hidden"))
    changePassworForm.addEventListener("submit", changePassword)
    informationForm.addEventListener("submit", changeInformations)
    
}

cancelBtns.forEach(element => {
    element.addEventListener("click",()=>{
ui.closeAllModals()
    })
    
});


function changePassword(e) {
    e.preventDefault();

    request.postWithUrl("./settings/"+userID+"/updateCompanyPassword", {
        
        password:changePassworForm.password.value,
        password2:changePassworForm.password2.value
        
    })
        .then(response => {
           
           ui.showNotification(true,response.messageBox)
           changePassworForm.password.value=""
           changePassworForm.password2.value=""

        })
        .catch(err => console.log("hata:"+err))

    
}
function changeInformations(e) {
    e.preventDefault();

    request.postWithUrl("./settings/"+userID+"/updateCompanyInformations", {
        
        brandName:informationForm.brandName.value,
        companyName:informationForm.companyName.value,
        email:informationForm.email.value,
        phone:informationForm.phone.value,
        address:informationForm.address.value,
        billingAddress:informationForm.billingAddress.value,
        workStart:informationForm.workStart.value,
        workEnd:informationForm.workEnd.value,
        workPeriod:Number(informationForm.workPeriod.value),
        
        
    })
        .then(response => {
            
            modalUser.classList.remove("hidden")
            ui.showNotification(true,response.message)
        
        })
        .catch(err => console.log("hata:"+err))

    
}




showContentsBtns.forEach((element, index) => {
    element.addEventListener("click",()=>{
        
        showContentsBtns.forEach(element => {
            
            element.classList.remove("active")
            
        });
        element.classList.add("active")

        contents.forEach(element => {
            element.classList.remove("showed_content")
            
        });
        
        element.parentElement.nextElementSibling.children[0].children[index].classList.add("showed_content")
    })

});

// images area ----------------

const imagesSmall = document.querySelectorAll(".userInformationsContent.images .small_images img")
const imageBig = document.querySelector(".userInformationsContent.images #big_image_wrapper img ")

imagesSmall.forEach(element => {
    element.onclick = () => {
        imagesSmall.forEach(element => {
            element.classList.remove("focused")
        })
        element.classList.add("focused")
        let src = element.getAttribute("src")

        imageBig.setAttribute("src", src)

    }
})