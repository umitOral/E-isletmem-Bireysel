import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
import { EmployeeDetailsUI } from "./ui/ui.employeeDetails.js";
const employeeDetailsUI = new EmployeeDetailsUI();
const ui = new UI();
import { Tables } from "./inner_modules/tables.js";
const tables = new Tables();

ui.closeNotification();

const showContentsBtn = document.querySelectorAll(".show-content");
const contents = document.querySelectorAll(".userInformationsContent");

const tableElements = document.querySelectorAll("table");
const appointmentsTabButton = document.querySelector(
  ".show-content.appointments"
);
const permissionsTabButton = document.querySelector(
  ".show-content.permissions"
);
const paymentsTabButton = document.querySelector(".show-content.payments");

const editBtn = document.querySelector(".edit-informations-btn");
const editUserForm = document.getElementById("user-edit-form");

const cancelModal = document.querySelectorAll(".modal .cancel_button");
const cancelBtns = document.querySelectorAll(".cancel");
const paymentSearchForm = document.querySelector("#payment-reports-search");

// modals

const allModals = document.querySelectorAll(".modal");
const modalUser = document.querySelector("#modal_user");

eventListeners();

function eventListeners() {
  editUserForm.addEventListener("submit", editUser);
  editBtn.addEventListener("click", showInformationsModal);
  appointmentsTabButton.addEventListener("click", getEmployeesAppointments);
  permissionsTabButton.addEventListener("click", getEmployeesPermissions);
  paymentSearchForm.addEventListener("submit", (e) => {
    console.log("burası")
    getEmployeesPayment();
    e.preventDefault();
    
  });
}

cancelModal.forEach((element) => {
  element.addEventListener("click", () => {
    console.log(element.parentElement.parentElement);
    element.parentElement.parentElement.classList.remove("showed_modal");
  });
});

cancelBtns.forEach((element) => {
  element.addEventListener("click", () => {
    allModals.forEach((element) => {
      element.classList.add("hidden");
    });
  });
});

function editUser(e) {
  e.preventDefault();

  const form = document.querySelector("#user-edit-form");
  let workHours = [];
  form.workhours.forEach((element) => {
    workHours.push(element.value);
  });

  console.log(form.action);
  request
    .postWithUrl(form.action, {
      name: form.name.value,
      surname: form.surname.value,
      email: form.email.value,
      sex: form.sex.value,
      address: form.address.value,
      phone: form.phone.value,
      workHours: workHours,
      birthDate: form.birthDate.value,
      employeeComission: form.employeeComission.value,
    })
    .then((response) => {
      console.log(response);
      ui.showNotification(true, response.message);
      modalUser.classList.add("hidden");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    })
    .catch((err) => ui.showNotification(false, err));
}
function getEmployeesPayment(page) {

  const form = document.querySelector("#payment-reports-search");
  let employeeId = form.dataset.employeid
  console.log(employeeId)
  request
    .postWithUrl("../reports/paymentsReportsPage", {
      startDate: form.startDate.value,
      endDate: form.endDate.value,
      employee: employeeId,
      page: page||1,
      cashOrCard: "",
    })
    .then((response) => {
      console.log(response);
      let totalComission = calculateTotalComission(response.data.reports);
      let totalValue = calculateTotalValue(response.data.reports);
      

      datasToTable(response.data, totalValue, totalComission);
      datasToPagination(response.data.pagination);
      ui.showNotification(true, response.message);
    })
    .catch((err) => {
      console.log(err);
      ui.showNotification(false, err);
    });
}

function datasToTable(data, totalValue, totalComission) {
  let tableBody = document.querySelector("#payments-table tbody");
  let tableFoot = document.querySelector("#payments-table tfoot");
  let lastpage = document.querySelector("#lastpage");
  let total = document.querySelector("#total");

  while (tableBody.children[0]) {
    tableBody.children[0].remove();
  }
  while (tableFoot.children[0]) {
    tableFoot.children[0].remove();
  }



  data.reports.forEach((element, index) => {
    const totalComissionforSingle = element.products.reduce((total, product) => {
      return total + product.paymentValue * (product.baseComission+product.employeeComission)/100;
    }, 0);
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
                                             
                                          </div>
                                       
                                       </td>
                                       <td>
                                       ${new Date(
                                         element.createdAt
                                       ).toLocaleDateString()}
                                       </td>
                                      
                                      
                                     

                                          <td>
                                       ${element.totalPrice}
                                       </td>
                                        <td><span> ${element.products
                                          .map((product) => {
                                            return `<li> ${product.paymentValue}x(${product.baseComission}+${product.employeeComission})=${((product.baseComission +product.employeeComission) *product.paymentValue) /100}</li>`;
                                          })
                                          .join("")}</span></td>

                                        <td><span>
                                          ${totalComissionforSingle}
                                          
                                        </span></td>
                                     
                                        
                                          <td>
                                       ${element.description}
                                       </td>
                                        
                                    
                                       
                                     
                                   </tr>
`;

    lastpage.innerHTML = `${data.pagination.lastpage}`;
    total.innerHTML = data.total;
  });
  tableFoot.innerHTML += `
                  
  <tr>
      
      <td colspan="4">toplam:</td>
      
      <td id="">${totalComission}</td>
  </tr>

`;
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
      getEmployeesPayment(e.target.dataset.pagenumber);
    });
  });
}

function calculateTotalComission(data) {
  let totalComission = 0;
  
  data.forEach((element) => {
    totalComission += element.products
      .map((product) => {
        let commission =
          ((product.baseComission + product.employeeComission) *
            product.paymentValue) /
          100;
        return commission;
      })
      .reduce((a, b) => a + b);
  });

  return totalComission;
}
function calculateTotalValue(data) {
  let totalValue = 0;
  data.forEach((element) => {
    totalValue += element.products
      .map((item) => item.paymentValue)
      .reduce((a, b) => a + b);
  });

  return totalValue;
}
showContentsBtn.forEach((element, index) => {
  element.addEventListener("click", () => {
    showContentsBtn.forEach((element) => {
      element.classList.remove("active");
    });
    element.classList.add("active");

    contents.forEach((element) => {
      element.classList.remove("showed_content");
    });

    element.parentElement.nextElementSibling.children[0].children[
      index
    ].classList.add("showed_content");
  });
});

// user details modal -----------------

function showInformationsModal() {
  modalUser.classList.remove("hidden");
}

function getEmployeesAppointments() {
  request
    .getwithUrl(document.location.pathname + "/getEmployesAppointments")
    .then((response) => {
      console.log(response);
      employeeDetailsUI.responseToUI(
        response.appointments,
        response.APPOINTMENT_STATUS
      );
    })
    .catch((err) => console.log(err));
}

let permissionTableBody = document.querySelector(".permissions-table tbody");
permissionTableBody.addEventListener("change", (e) => {
  handleEvents(e);
});
async function getEmployeesPermissions() {
  await request
    .getwithUrl(document.location.pathname + "/getEmployeesPermissions")
    .then((response) => {
      console.log(response);
      ui.showNotification(response.success, "izinler başarıyla çekildi");

      response.data.allPermissions.privileges.forEach((element) => {
        element.ispermitted = false;
      });

      response.data.employeePermissions.forEach((element) => {
        let index = response.data.allPermissions.privileges.findIndex(
          (item) => item.key === element
        );

        response.data.allPermissions.privileges[index].ispermitted = true;
      });
      permissionTableBody.innerHTML = "";
      response.data.allPermissions.privileges.forEach((element, index) => {
        permissionTableBody.innerHTML += `
          <tr>
            <td><span>${element.name}</span></td>
            <td><input type="checkbox"  class="centered_cell" data-permissionkey="${
              element.key
            }" name="permissioncheckbox" id="" ${(() => {
          if (element.ispermitted === true) {
            return `checked`;
          } else {
            return ``;
          }
        })()}></td>
          </tr>
    `;
      });
    })
    .catch((err) => console.log(err));
}

function handleEvents(e) {
  console.log("burası");
  if (e.target.name === "permissioncheckbox") {
    console.log("burası2");
    let data = { permissionkey: e.target.dataset.permissionkey };
    request
      .postWithUrl(
        document.location.pathname + "/updateEmployeesPermissions",
        data
      )
      .then((response) => {
        console.log(response);
        ui.showNotification(response.success, response.message);
      })
      .catch((err) => {
        console.log(err);
        ui.showNotification(false, err);
      });
  }
}

// table sorting

tableElements.forEach((table) => {
  table.querySelectorAll("thead th").forEach((head, columnIndex) => {
    head.addEventListener("click", () => {
      tables.sortingStart(table, columnIndex);
    });
  });
});
