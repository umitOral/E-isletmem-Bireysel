import { UI } from "./ui.js";
const ui = new UI();
import { Request } from "./requests.js";
const request = new Request();
ui.closeNotification();
ui.deleteZeroFromPhone();

const allModals = document.querySelectorAll(".modal");
const cancelButtons = document.querySelectorAll(".cancel");
const form = document.querySelector("#register-form");
const searchForm = document.querySelector("#search-form");
const usersTable = document.querySelector("#user-table tbody");

eventListeners();
function eventListeners() {
  form.addEventListener("submit", createUser);
  searchForm.addEventListener("submit", searchUser);
}

cancelButtons.forEach((element) => {
  element.addEventListener("click", () => {
    allModals.forEach((element) => {
      element.classList.add("hidden");
    });
  });
});

function createUser(e) {
  e.preventDefault();
  let formData = {
    name: form.name.value,
    surname: form.surname.value,
    email: form.email.value,
    phone: form.phone.value,
    sex: form.sex.value,
    birthDate: form.birthDate.value,
    address: form.address.value,
    billingAddress: form.billingAddress.value,
  };
  console.log(form.getAttribute("action"));
  request
    .postWithUrl(form.getAttribute("action"), formData)
    .then((response) => {
      if (response.success === true) {
        ui.showNotification(true, response.message);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        ui.showNotification(false, response.message);
      }
    })
    .catch((err) => console.log(err));
}

function searchUser(e) {
  e.preventDefault();
  let data = {
    name: searchForm.name.value,
    surname: searchForm.surname.value,
    phone: searchForm.phone.value,
    identity: searchForm.identity.value,
  };
  request
    .postWithUrl("./users/findUser", data)
    .then((response) => {
      console.log(response);
      ui.showNotification(response.success, response.message);
      if (response.success===true) {
        usersTable.innerHTML=""
      }
      response.data.forEach((element) => {
        usersTable.innerHTML += `
          <tr >
              <td>
                  ${element.name}
              </td>
              <td>
              ${element.surname}
              </td>
              <td><span class="">
               ${element.phone}</span> </td>
              
                                       ${(() => {
                                         if (element.identity) {
                                           return `<td>${element.identity}</td>`;
                                         } else {
                                           return `<td></td>`;
                                         }
                                       })()}
              
              
              <td class="details"><a href="./users/${element._id}" class="table-button notr">Detay</a></td>
          </tr>
    `;
      });
    })
    .catch((err) => {
      console.log(err)
      ui.showNotification(err.success, err.message);
    });
}

const addCustomerButton = document.querySelector(".add_customer_btn");
const modalCustomerAdd = document.querySelector("#add_customer");

addCustomerButton.addEventListener("click", () =>
  modalCustomerAdd.classList.remove("hidden")
);
