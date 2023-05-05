const tabs =document.querySelectorAll(".user_informations")
const content =document.querySelectorAll(".userInformationsContent")



tabs.forEach((element,index) => {
    element.onclick=()=>{
        
        tabs.forEach(element=>{
            element.classList.remove("showed")
            element.childNodes[1].classList.remove("showed_content")
        })
        element.classList.add("showed")
        element.childNodes[1].classList.add("showed_content")
       

    }
});