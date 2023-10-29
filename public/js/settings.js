
console.log(    "dada")


const showContentsBtns = document.querySelectorAll(".show-content")
const contents = document.querySelectorAll(".userInformationsContent")
const userID = document.querySelector(".userID").dataset.user
const messageBox = document.querySelector(".information-modal")


const editBtn = document.querySelector(".edit-informations-btn")
const changePassworForm = document.getElementById("change-password-form")

const informationForm = document.getElementById("informations-form")


const cancelModal = document.querySelectorAll(".modal .cancel_button")

// modals
const modalUser = document.querySelector(".modal_user")



import { Request } from "./requests.js";
const request = new Request("http://127.0.0.1:3000/api/users")





eventListeners()

function eventListeners() {
    
    editBtn.addEventListener("click", showInformationsModal)
    changePassworForm.addEventListener("submit", changePassword)
    informationForm.addEventListener("submit", changeInformations)
    
}

cancelModal.forEach(element => {
    element.addEventListener("click",()=>{
        console.log(element.parentElement.parentElement)
    element.parentElement.parentElement.classList.remove("showed_modal")
    })
    
});









function changePassword(e) {
    e.preventDefault();

    request.postWithUrl("./settings/"+userID+"/updateCompanyPassword", {
        
        password:changePassworForm.password.value,
        password2:changePassworForm.password2.value
        
    })
        .then(response => {
            console.log(response)
            messageBox.textContent=response.message
            messageBox.style.display="block"
            
            setTimeout(() => {
                messageBox.style.display="none"
            }, 3000);
        })
        .catch(err => console.log("hata:"+err))

    
}
function changeInformations(e) {
    e.preventDefault();

    request.postWithUrl("./settings/"+userID+"/updateCompanyInformations", {
        
        authorizedName:informationForm.authorizedName.value,
        companyName:informationForm.companyName.value,
        email:informationForm.email.value,
        phone:informationForm.phone.value,
        address:informationForm.address.value,
        billingAddress:informationForm.billingAddress.value,
        workStart:informationForm.workStart.value,
        workEnd:informationForm.workEnd.value
        
    })
        .then(response => {
            console.log(response)
            modalUser.classList.remove("showed_modal")
            messageBox.textContent=response.message
            messageBox.style.display="block"
            
            setTimeout(() => {
                location.reload();
            }, 1000);
            
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

// user details modal -----------------
const editInformation = document.getElementById("edit_informations")
const addSession = document.getElementById("add_session")
const addPayment = document.getElementById("add_payment")
const addImage = document.getElementById("add_image")
const addProccess = document.getElementById("add_proccess")


const saveModal = document.querySelectorAll(".modal .save_button")




function showInformationsModal(e) {
    console.log("dada")
    modalUser.classList.add("showed_modal")
}
function notshowInformationsModal(e) {
   modalUser.classList.remove("showed_modal")
   console.log("dadad")
    e.preventDefault();
}








cancelModal.forEach(element => {
    element.addEventListener("click", (e)=>{
        e.preventDefault()
        modalUser.classList.remove("showed_modal")
        
        console.log("dada")
    })
});
saveModal.forEach(element => {
    element.onclick = () => {
        modalUser.classList.remove("showed_modal")
        
    }
});







