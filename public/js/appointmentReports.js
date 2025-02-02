$(".chosen-select").chosen({ width: "100%" });


$(".chosen-select").chosen({ width: "100%" });

import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();

const cancelBtns = document.querySelectorAll(".btn.cancel.form-btn");
const operationTypeSelect = document.getElementById("operationType");
let paginationBtns = document.querySelectorAll(".pagination-buttons");

const checkAll = document.getElementById("check-all");

cancelBtns.forEach((element) => {
  element.addEventListener("click", () => {
    ui.closeAllModals();
  });
});

const table = document.querySelector("#appointment-report-table");
const searchForm = document.querySelector("#appointment-reports-search");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  getAppointments();
});

function getAppointments(page) {
  let options = searchForm.status.selectedOptions;
  var values = Array.from(options).map(({ value }) => value);
  
  
  let data = {
    page: page || 1,
    startDate: searchForm.startDate.value,
    endDate: searchForm.endDate.value,
    personelInput: Array.from(searchForm.personelInput.selectedOptions).map(
      ({ value }) => value
    ),
    status: Array.from(searchForm.status.selectedOptions).map(
      ({ value }) => value
    ),
  };
  request
    .postWithUrl("./appointmentsReportsPage", data)
    .then((response) => {
      ui.showNotification(response.success, response.message);
      
      datasToTable(response.data);
      datasToPagination(response.data.pagination);
    })
    .catch((err) => {
      ui.showNotification(false, err.message);
      
    });
}

function datasToTable(data) {
  let tableBody = document.querySelector("#appointment-report-table tbody");
  let lastpage = document.querySelector("#lastpage");
  let total = document.querySelector("#total");

  
  while (tableBody.children[0]) {
    tableBody.children[0].remove();
  }
  data.reports.forEach((element, index) => {
    tableBody.innerHTML += `
    <tr data-userId="${element._id}">
                                       
                                       <td>
                                        <div style="display: flex; align-items: center; justify-content: center; gap:0.5rem;">
                                              <label for="">${
                                                (data.pagination.page - 1) *
                                                  data.pagination.limit +
                                                index +
                                                1
                                              }</label>
                                              <input type="checkbox" name="" id="">
                                          </div>
                                       
                                       </td>
                                       <td>
                                       ${new Date(
                                         element.date
                                       ).toLocaleDateString()}
                                       </td>
                                       <td>
                                       ${element.startHour}-${element.endHour}
                                      
                                       </td>
                                       <td>
                                       ${
                                         element.user.name +
                                         " " +
                                         element.user.surname
                                       }
                                       </td>
                                       <td>
                                       ${
                                         element.doctor.name +
                                         " " +
                                         element.doctor.surname
                                       }
                                       </td>
                                          <td>
                                       ${element.description}
                                       </td>
                                       <td>
                                       ${element.appointmentState}
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
      <span class="pagination-buttons" data-pageNumber="${pagination.page - 1}">
       <i class="fa-solid fa-angle-left"></i>
      </span>
    
  `;
  }

  if (pagination.page > 1) {
    paginationArea.innerHTML += `
        <span class="pagination-buttons" data-pageNumber="${
          pagination.page - 1
        }">
        ${pagination.page - 1}
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
        ${pagination.page + 1}
        </span>
     
 `;
  }
  if (pagination.next) {
    paginationArea.innerHTML += `
           
               <span class="pagination-buttons" data-pageNumber="${
                 pagination.page + 1
               }">
                  <i class="fa-solid fa-angle-right"></i>
               </span>
            
        `;
  }
  paginatioButtonsHandle();
}

function paginatioButtonsHandle() {
  let paginationBtns = document.querySelectorAll(".pagination-buttons");
  paginationBtns.forEach((element) => {
    element.addEventListener("click", (e) => {
      
      getAppointments(e.target.dataset.pagenumber);
    });
  });
}


checkAll.addEventListener("click", (e) => {
  ui.tableRowSelection(table);
});

let selectedUsers = [];
// bulk operations

operationTypeSelect.addEventListener("change", () => {
  selectedUsers = [];

  const checkBoxes = table.querySelectorAll(
    "input[type=checkbox]:not(:first-child):checked"
  );

  checkBoxes.forEach((element) => {
    selectedUsers.push(
      element.parentElement.parentElement.parentElement.dataset.userid
    );
  });
  
  let operationType =
    operationTypeSelect.options[operationTypeSelect.options.selectedIndex]
      .value;

  operationTypeSelect.options.selectedIndex = 0;
  if (selectedUsers.length === 0) {
    ui.showNotification(false, "listeden hasta seçiniz");
  } else {
    if (operationType === "sendMessage") {
    }
  }
});
