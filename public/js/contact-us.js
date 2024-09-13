import { Request } from "./requests.js";
const request = new Request();
const successPopup = document.querySelector(".success_popup_wrapper")
const messageModal = document.querySelector(".res-message");
const loader = document.querySelector(".loader_wrapper.hidden");

console.log("burası")
const form = document.getElementById("contact")
form.addEventListener("submit", (e) => {
    e.preventDefault()
    // message modal resetting
    messageModal.style = "display:none"
    messageModal.textContent = "";
    // 
    const captchaResponse = grecaptcha.getResponse()
    const fd = new FormData(e.target)
    const params = new URLSearchParams(fd)
    loader.classList.toggle("showed");
    request.postWithUrlformData("/contactEmail", params)
        .then(response => {
            console.log(response)
            loader.classList.toggle("showed");
            if (response.success) {
                successPopup.classList.add("showed")
                e.target.reset();
            } else {
                messageModal.style = "display:block"
                messageModal.textContent = response.message;
            }

        })
        .catch(err => {
            messageModal.style = "display:block"
            messageModal.textContent = err.message;
        })
})