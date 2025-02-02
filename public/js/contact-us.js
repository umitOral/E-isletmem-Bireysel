import { Request } from "./requests.js";
const request = new Request();
const successPopup = document.querySelector(".success_popup_wrapper")

const alertMessage = document.querySelector(".res-message");
const loader = document.querySelector(".loader_wrapper.hidden");
const g_recaptcha = document.querySelector(".g-recaptcha")

console.log("burası")
const form = document.getElementById("contact-form")
form.addEventListener("submit", (e) => {
    e.preventDefault()
    
    alertMessage.classList.add("d-none")
    const fd = new FormData(e.target)
    const params = new URLSearchParams(fd)
    loader.classList.toggle("showed");
    request.postWithUrlformData("/contactEmail", params)
        .then(response => {
            console.log(response)
            loader.classList.toggle("showed");
            if (response.success===true) {
                successPopup.classList.add("showed")
                e.target.reset();
            } else {
              alertMessage.textContent=response.message
              alertMessage.classList.remove("d-none")
            }

        })
        .catch(err => {
             alertMessage.textContent=err.message
              alertMessage.style.display="block"
        })
})