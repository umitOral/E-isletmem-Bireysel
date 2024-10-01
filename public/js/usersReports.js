console.log("reports")
$(".chosen-select").chosen({ width: "100%" })

import { Request } from "./requests.js";
const request = new Request()
import { UI } from "./ui.js";
const ui = new UI()
import { Print } from "./inner_modules/print.js";
const print = new Print();
import { Tables } from "./inner_modules/tables.js";
const tables = new Tables();

const pdf_btn = document.querySelector(".to_pdf");
const xlsx_btn = document.querySelector(".to_xlsx");

const table = document.querySelector("table");
const searchForm = document.querySelector("#user-reports-search");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault()
  let data = {
    startDate: searchForm.startDate.value,
    endDate: searchForm.endDate.value,
    birthDate: searchForm.birthDate.value,
    sex: searchForm.sex.options[searchForm.sex.selectedIndex].value,
    firstAppointment: searchForm.firstAppointment.options[searchForm.firstAppointment.selectedIndex].value,

  }
  request.postWithUrl("./userReportsPage", data)
    .then(response => {
      ui.showNotification(response.success, response.message)
      console.log(response)
      datasToTable(response.data)

    })
    .catch(err => {
      ui.showNotification(false, err.message)
      console.log(err)
    })
})

function datasToTable(data) {
  let tableBody = document.querySelector("#user-report-table tbody")
  console.log(table)
  while (tableBody.children[0]) {
    tableBody.children[0].remove()
  }
  data.reports.forEach(element => {
    tableBody.innerHTML +=
   
    `
    <tr data-userId="${element._id}">
                                       <td>
                                          <input type="checkbox" name="" id="">
                                       </td>
                                       <td>
                                       ${new Date(element.createdAt).toLocaleDateString()}
                                       </td>
                                       <td>
                                       ${element.name}
                                       </td>
                                       <td>
                                       ${element.surname}
                                       </td>
                                       
                                      
                                       ${(()=>{
                                        if (element.sex==="female") {
                                          return `<td>Kadın</td>`
                                        } else {
                                          return `<td>Erkek</td>`
                                        }
                                       })()}
                                       
                                       <td>
                                       ${element.phone}
                                       </td>
                                       <td>
                                       ${element.email}
                                       </td>
                                       <td>
                                       
                                       ${(()=>{
                                        if (element.firstAppointment) {
                                          if (element.firstAppointment=false) {
                                            return `yok`
                                          } else {
                                            return `var`
                                          }
                                        } else {
                                          return `-`
                                        }
                                        
                                       })()}
                                       </td>
                                       <td>
                                       ${new Date(element.birthDate).toLocaleDateString()||"-"}
                                       </td>
                                   </tr>
`
  });

}

pdf_btn.onclick = () => {
  console.log("dadad")
  print.toPDF(table);
};

xlsx_btn.onclick = () => {
  const xlsx_doc = print.toXLS(table);
  print.downloadFile(xlsx_doc, "xlsx", "e-isletmem.xls");
};

const tableElements = document.querySelectorAll("table");

tableElements.forEach((table) => {
  table.querySelectorAll("thead th i").forEach((head, columnIndex) => {
    head.addEventListener("click", () => {
      console.log("xxx")
      tables.sortingStart(table, columnIndex + 1)

    })
  });
});



