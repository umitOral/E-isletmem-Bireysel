console.log("sms reports");
$(".chosen-select").chosen({ width: "100%" });

import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();


const cancelBtns = document.querySelectorAll(".btn.cancel.form-btn");
const operationTypeSelect = document.getElementById("operationType");
const modalPackageDetails = document.getElementById("package-details-modal");
const modalContent = document.querySelector(".modal_content");

const checkAll = document.getElementById("check-all");

cancelBtns.forEach((element) => {
  element.addEventListener("click", () => {
    ui.closeAllModals();
  });
});



const table = document.querySelector("#sms-report-table");
const searchForm = document.querySelector("#sms-reports-search");
const sendSmsModal = document.querySelector("#send_sms_modal");



searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  getReports();
});

function getReports(page) {
  let data = {
    page: page || 1,
    startDate: searchForm.startDate.value,
    finishDate: searchForm.endDate.value,
  };
  request
    .postWithUrl("./getSmsReports", data)
    .then((response) => {
      ui.showNotification(response.success, response.message);
      console.log(response);
      datasToTable(response.data.data,response.SMS_PACKAGE_STATUS,response.pagination);
      datasToPagination(response.pagination);
    })
    .catch((err) => {
      ui.showNotification(false, err.message);
      console.log(err);
    });
}

function datasToTable(data,SMS_PACKAGE_STATUS,pagination) {
  let tableBody = document.querySelector("#sms-report-table tbody");
  let lastpage = document.querySelector("#lastpage");
  let total = document.querySelector("#total");

  console.log(data);
  while (tableBody.children[0]) {
    tableBody.children[0].remove();
  }
  data.list.forEach((sms, index) => {
    tableBody.innerHTML += `
    <tr data-smspackageId="${sms.id}">
         
      <td>
      <div style="display: flex; align-items: center; justify-content: center; gap:0.5rem;">
            <label for="">${
              (pagination.page - 1) *
                pagination.limit +
              index +
              1
            }</label>
            <input type="checkbox" name="" id="">
        </div>
      
      </td>
    
      <td>
          ${new Date(sms.sendingDate).toLocaleDateString("tr-TR")} ${new Date(sms.sendingDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
      </td>
    
      <td>
      ${sms.title}
      </td>
      <td>
      ${sms.content}
      </td>
      <td>
      ${sms.senders[0]}
      </td>
      
      <td>
      ${SMS_PACKAGE_STATUS[sms.state]}
      </td>
      <td >
          <i class="fa-solid fa-circle-info clickable-icon success" title="detay göster"></i>
      </td>

</tr>
    `; 
    lastpage.innerHTML = `${pagination.lastpage}`;
    total.innerHTML = data.stats.totalRecord;
    smsDetailsIconHandle()
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
      Önceki Sayfa<<
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
function smsDetailsIconHandle() {
  let smsDetailsIconBtns = document.querySelectorAll(".fa-solid.fa-circle-info");
  smsDetailsIconBtns.forEach((element) => {
    element.addEventListener("click", (e) => {
      let data={}
      request
    .postWithUrl("../sms/"+e.target.parentElement.parentElement.dataset.smspackageid+"/getSmsDetails", data)
    .then((response) => {
      ui.showNotification(response.success, response.message);
      console.log(response);
      let data=response.data.data
      modalContent.innerHTML=``
      modalContent.innerHTML+=`
       
      ${data.list.map((item,i)=>{
        return `
            <div class="form-group "> 
              <h3> 
                 
              </h3>
                 <p style="border:1px solid gray;border-radius:1rem;margin-bottom:0.5rem;background-color:aliceblue;padding:0.5rem;"> ${item.target} (${response.SMS_STATUS[item.state]})
                 </p>
            </div>
          
        
        
        `
      })}
      `
      modalPackageDetails.classList.remove("hidden")
    })
    .catch((err) => {
      ui.showNotification(false, err.message);
      console.log(err);
    });
      
    });
  });
}



checkAll.addEventListener("click", (e) => {
  ui.tableRowSelection(table)
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
  console.log(selectedUsers);
  let operationType =
    operationTypeSelect.options[operationTypeSelect.options.selectedIndex]
      .value;

  operationTypeSelect.options.selectedIndex = 0;
  if (selectedUsers.length === 0) {
    ui.showNotification(false, "listeden hasta seçiniz");
  } else {
    if (operationType === "sendMessage") {
      sendSmsModal.classList.remove("hidden");
    }
  }
});


