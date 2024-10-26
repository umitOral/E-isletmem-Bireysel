$(".chosen-select").chosen({ width: "100%" });

console.log("reports");
$(".chosen-select").chosen({ width: "100%" });

import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();

const cancelBtns = document.querySelectorAll(".btn.cancel.form-btn");
const operationTypeSelect = document.getElementById("operationType");
let paginationBtns = document.querySelectorAll(".pagination-buttons");
let editPaymentModal=document.querySelector("#modal_edit_payment")
const checkAll = document.getElementById("check-all");


const selected_proccess_type_edit = document.querySelector(
  ".selected_proccess_type_edit"
);
const selected_proccess_table = document.querySelector(
  ".selected_proccess_table tbody"
);
const paymentsTable = document.querySelector("#payments_table");


let editedPayment = "";

let selectedOperations = [];
let selectedPaymentIndex;

cancelBtns.forEach((element) => {
  element.addEventListener("click", () => {
    ui.closeAllModals();
  });
});

const table = document.querySelector("#product-report-table");
const searchForm = document.querySelector("#product-reports-search");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  getPayments();
});

function getPayments(page) {
 console.log("burası")
  let data = {
    page:page||1,
    startDate: searchForm.startDate.value,
    endDate: searchForm.endDate.value,
    products: Array.from(searchForm.userInput.selectedOptions).map(
      ({ value }) => value
    ),
  
    
  };
 
  request
    .postWithUrl("./getProductReports", data)
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
  let tableBody = document.querySelector("#product-report-table tbody");
  let lastpage = document.querySelector("#lastpage");
  let total = document.querySelector("#total");


  while (tableBody.children[0]) {
    tableBody.children[0].remove();
  }
  data.reports.forEach((element, index) => {
    tableBody.innerHTML += `
    <tr data-paymentId="${element._id}">
                                       
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
                                         element.createdAt
                                       ).toLocaleDateString()}
                                       </td>
                                      
                                       <td>
                                       ${element.barcodes
                                       }
                                       </td>
                                       <td>
                                       ${element.brand ||"-"
                                       }
                                       </td>
                                       <td>
                                       ${element.name
                                       }
                                       </td>
                                       <td>
                                       ${element.price
                                       } tl
                                       </td>
                                       
                                          <td>
                                       ${element.totalStock}
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
      console.log(e.target.dataset.pagenumber);
      getPayments(e.target.dataset.pagenumber);
    });
  });
}



checkAll.addEventListener("click", (e) => {
  ui.tableRowSelection(table);
});




