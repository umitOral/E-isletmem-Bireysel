


const showContentsBtn = document.querySelectorAll(".show-content")
const contents = document.querySelectorAll(".userInformationsContent")


const proccessType = document.querySelector(".proccess_type")
const selected_proccess_type_div = document.querySelector(".selected_proccess_type")
const editBtn = document.querySelector(".edit-informations-btn")
const editUserButton = document.getElementById("edit-user")

const cancelModal = document.querySelectorAll(".modal .cancel_button")

// modals
const modalUser = document.querySelector(".modal_user")
const modalSession = document.querySelector(".modal_session")
const modalPayment = document.querySelector(".modal_payment")
const modalImage = document.querySelector(".modal_image")
const modalProccess = document.querySelector(".modal_proccess")


import { Request } from "./requests.js";
const request = new Request("http://127.0.0.1:3000/api/users")





eventListeners()

function eventListeners() {
    proccessType.addEventListener("change", addUıProccesType)
    selected_proccess_type_div.addEventListener("click", removeUıProccesType)
    editUserButton.addEventListener("click", editUser)
    editBtn.addEventListener("click", showInformationsModal)
    
}

cancelModal.forEach(element => {
    element.addEventListener("click",()=>{
        console.log(element.parentElement.parentElement)
    element.parentElement.parentElement.classList.remove("showed_modal")
    })
    
});


const userName = document.getElementById("user-name")
const usersurName = document.getElementById("user-surname")


function editUser() {
    const name=userName.value ||userName.placeholder
    const surName=usersurName.value ||usersurName.placeholder
   
    request.put(userID, {
        name: name,
        surname: surName
        
    })
        .then(response => console.log(response))
        .catch(err => console.log(err))

    e.preventDefault();
}




showContentsBtn.forEach((element, index) => {
    element.addEventListener("click",()=>{
        
        showContentsBtn.forEach(element => {
            
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


addSession.onclick = () => {
    modalSession.classList.add("showed_modal")
    modalUser.classList.remove("showed_modal")
    modalPayment.classList.remove("showed_modal")
    modalPayment.classList.remove("showed_image")
    modalProccess.classList.remove("showed_image")

}
addPayment.onclick = () => {

    modalPayment.classList.add("showed_modal")
    modalUser.classList.remove("showed_modal")
    modalSession.classList.remove("showed_modal")
    modalImage.classList.remove("showed_modal")
    modalProccess.classList.remove("showed_modal")

}
editInformation.onclick = () => {
    modalUser.classList.add("showed_modal")
    modalPayment.classList.remove("showed_modal")
    modalSession.classList.remove("showed_modal")
    modalImage.classList.remove("showed_modal")
    modalProccess.classList.remove("showed_modal")

}
addImage.onclick = () => {

    modalImage.classList.add("showed_modal")
    modalUser.classList.remove("showed_modal")
    modalPayment.classList.remove("showed_modal")
    modalSession.classList.remove("showed_modal")
    modalProccess.classList.remove("showed_modal")


}
addProccess.onclick = () => {

    modalProccess.classList.add("showed_modal")
    modalUser.classList.remove("showed_modal")
    modalPayment.classList.remove("showed_modal")
    modalSession.classList.remove("showed_modal")
    modalImage.classList.remove("showed_modal")


}

cancelModal.forEach(element => {
    element.addEventListener("click", (e)=>{
        e.preventDefault()
        modalUser.classList.remove("showed_modal")
        modalSession.classList.remove("showed_modal")
        modalPayment.classList.remove("showed_modal")
        modalImage.classList.remove("showed_modal")
        modalUser.classList.remove("showed_modal")
        modalProccess.classList.remove("showed_modal")
        console.log("dada")
    })
});
saveModal.forEach(element => {
    element.onclick = () => {
        modalUser.classList.remove("showed_modal")
        modalSession.classList.remove("showed_modal")
        modalPayment.classList.remove("showed_modal")
    }
});


// add-session -------------------------














function removeUıProccesType(e) {

    if (e.target.classList == "fa-solid fa-x") {
        e.target.parentElement.remove()
    }

}

function addUıProccesType() {
    
    // const node = document.createElement("div")
    const nodeinput = document.createElement("input")
    nodeinput.value=proccessType.options[proccessType.options.selectedIndex].textContent.trim()
    nodeinput.setAttribute("name","services")
    nodeinput.setAttribute("disabled","")
    nodeinput.setAttribute("value",proccessType.options[proccessType.options.selectedIndex].textContent.trim())
    


    const deleteButton = document.createElement("i")
    deleteButton.classList.add("fa-solid")
    deleteButton.classList.add("fa-x")

    
    // node.appendChild(nodeinput)
    // node.appendChild(deleteButton)
    selected_proccess_type_div.appendChild(nodeinput)
}


// upload images preview   -----------
function getImagePreview(e) {
    var imageSrc = URL.createObjectURL(e.target.files[0])
    const object1 = e.target.files
    let imageDiv = document.querySelector(".uploaded_images_preview")

    console.log(imageDiv)

    const imagesArray = Object.values(object1)


    imagesArray.forEach(element => {

        let newimage = document.createElement("img")
        newimage.src = URL.createObjectURL(element)
        imageDiv.appendChild(newimage)
    });




}


