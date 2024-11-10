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



const editBtn = document.querySelector(".edit-informations-btn");
const editUserForm = document.getElementById("user-edit-form");

const cancelModal = document.querySelectorAll(".modal .cancel_button");
const cancelBtns = document.querySelectorAll(".cancel");

// modals

const allModals = document.querySelectorAll(".modal");
const modalUser = document.querySelector("#modal_user");

eventListeners();

function eventListeners() {
  editUserForm.addEventListener("submit", editUser);
  editBtn.addEventListener("click", showInformationsModal);
  appointmentsTabButton.addEventListener("click", getEmployeesAppointments);
 
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
      role: form.role.value,
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
