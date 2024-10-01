console.log("reports");
$(".chosen-select").chosen({ width: "100%" });

import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();
import { Print } from "./inner_modules/print.js";
const print = new Print();
import { Tables } from "./inner_modules/tables.js";
const tables = new Tables();

const pdf_btn = document.querySelector(".to_pdf");
const xlsx_btn = document.querySelector(".to_xlsx");

const table = document.querySelector("table");
const searchForm = document.querySelector("#user-reports-search");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  getReports();
});

function getReports(page) {
  let data = {
    page: page || 1,
    startDate: searchForm.startDate.value,
    endDate: searchForm.endDate.value,
    birthDate: searchForm.birthDate.value,
    sex: searchForm.sex.options[searchForm.sex.selectedIndex].value,
    firstAppointment:
      searchForm.firstAppointment.options[
        searchForm.firstAppointment.selectedIndex
      ].value,
  };
  request
    .postWithUrl("./userReportsPage", data)
    .then((response) => {
      ui.showNotification(response.success, response.message);
      console.log(response);
      datasToTable(response.data);
      datasToPagination(response.data.pagination);
    })
    .catch((err) => {
      ui.showNotification(false, err.message);
      console.log(err);
    });
}

function datasToTable(data) {
  let tableBody = document.querySelector("#user-report-table tbody");
  let lastpage = document.querySelector("#lastpage");
  let total = document.querySelector("#total");

  console.log(table);
  while (tableBody.children[0]) {
    tableBody.children[0].remove();
  }
  data.reports.forEach((element,index) => {
    tableBody.innerHTML += `
    <tr data-userId="${element._id}">
                                       
                                       <td>
                                        <div style="display: flex; align-items: center; justify-content: center; gap:0.5rem;">
                                              <label for="">${(data.pagination.page-1)*data.pagination.limit+index+1}</label>
                                              <input type="checkbox" name="" id="">
                                          </div>
                                       
                                       </td>
                                       <td>
                                       ${new Date(
                                         element.createdAt
                                       ).toLocaleDateString()}
                                       </td>
                                       <td>
                                       ${element.name}
                                       </td>
                                       <td>
                                       ${element.surname}
                                       </td>
                                       
                                      
                                       ${(() => {
                                         if (element.sex === "female") {
                                           return `<td>Kadın</td>`;
                                         } else {
                                           return `<td>Erkek</td>`;
                                         }
                                       })()}
                                       
                                       <td>
                                       ${element.phone}
                                       </td>
                                       <td>
                                       ${element.email}
                                       </td>
                                       <td>
                                       
                                       ${(() => {
                                         if (element.firstAppointment) {
                                           if (
                                             (element.firstAppointment = false)
                                           ) {
                                             return `yok`;
                                           } else {
                                             return `var`;
                                           }
                                         } else {
                                           return `-`;
                                         }
                                       })()}
                                       </td>
                                       <td>
                                       ${
                                         new Date(
                                           element.birthDate
                                         ).toLocaleDateString() || "-"
                                       }
                                       </td>
                                   </tr>
`;
    lastpage.innerHTML = `${data.pagination.lastpage}`;
    total.innerHTML = data.total;
  });
}
function datasToPagination(pagination) {
  let paginationArea = document.getElementById("pagination");
  // reset
  paginationArea.innerHTML = "";
  // create
  if (pagination.previous) {
    paginationArea.innerHTML += `
      <span class="pagination-buttons" data-pageNumber="${pagination.page-1}">
      Önceki Sayfa<<
      </span>
    
  `;
  }

  if (pagination.page > 1) {
    paginationArea.innerHTML += `
        <span class="pagination-buttons" data-pageNumber="${pagination.page-1}">
        ${pagination.page-1}
          </span>
        
      `;
  }

  paginationArea.innerHTML += `
      <span class="pagination-buttons page-active" data-pageNumber="${pagination.page}">
              ${pagination.page}
            </span>
    `;

  if (pagination.page < pagination.lastpage) {
        paginationArea.innerHTML += `
           
        <span class="pagination-buttons" data-pageNumber="${
          pagination.page + 1
        }">
        ${pagination.page+1}
        </span>
     
 `;
  }
  if (pagination.next) {
    paginationArea.innerHTML += `
           
               <span class="pagination-buttons" data-pageNumber="${
                 pagination.page + 1
               }">
                  >>Sonraki Sayfa
               </span>
            
        `;
  }

  paginatioButtonsHandle();
}

function paginatioButtonsHandle() {
  let paginationBtns = document.querySelectorAll(".pagination-buttons");
  paginationBtns.forEach((element) => {
    element.addEventListener("click", (e) => {
      console.log(e.target.dataset.pagenumber);
      getReports(e.target.dataset.pagenumber);
    });
  });
}

pdf_btn.onclick = () => {
  console.log("dadad");
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
      console.log("xxx");
      tables.sortingStart(table, columnIndex + 1);
    });
  });
});
