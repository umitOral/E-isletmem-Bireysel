


const showContentsBtn = document.querySelectorAll(".show-content")
const contents = document.querySelectorAll(".userInformationsContent")



const editBtn = document.querySelector(".edit-informations-btn")
const editUserButton = document.getElementById("edit-user")

const cancelModal = document.querySelectorAll(".modal .cancel_button")

// modals
const modalUser = document.querySelector(".modal_user")



import { Request } from "./requests.js";
const request = new Request("http://127.0.0.1:3000/api/users")





eventListeners()

function eventListeners() {
    
    
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







