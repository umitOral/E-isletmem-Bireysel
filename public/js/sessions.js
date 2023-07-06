// table values proccessing
const td = document.querySelectorAll("tbody tr td:not(:first-child) ")

// for (let i = 0; i < td.length; i++) {
//     const iElementAdd = document.createElement("i")
//     iElementAdd.setAttribute("class", "fa-solid fa-add")
//     const iElementEdit = document.createElement("i")
//     iElementEdit.setAttribute("class", "fa-solid fa-edit")


//     if (td[i].textContent === "") {
//         td[i].classList.add("continue")
//         td[i].appendChild(iElementAdd)
//     } else {
//         td[i].classList.add("finish")
//         td[i].appendChild(iElementEdit)
//     }

// }

// get current date

const currentDate =document.querySelector(".current_date")
var date= new Date()

const days =["pazar","pazartesi","salı","çarşamba","perşembe","cuma","cumartesi","pazar","pazartesi","salı","çarşamba","perşembe","cuma","cumartesi"]
const months =["ocak","şubat","mart","nisan","mayıs","haziran","temmuz","ağustos","eylül","ekim","kasım","aralık"]

const node=document.createElement("div")
node.innerHTML=`
${days[date.getDay()]}+${date.getFullYear()}+${months[date.getMonth()]}+${date.getDay()}
`
currentDate.appendChild(node)

// thead proccessing

const tableHeads=document.querySelectorAll("th:not(:first-child)")




for (let i = 0; i < tableHeads.length; i++) {
    tableHeads[i].innerHTML=`
    ${date.getDay()+i}   ${months[date.getMonth()]} <br> ${days[date.getDay()+i]}
    `
    
}