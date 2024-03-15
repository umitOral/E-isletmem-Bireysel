export class UI {
  constructor() {
    this.table = document.getElementById("userList");
  }

  showModal(success, message) {
    const messageBox = document.querySelector(".information-modal");

    if (success == false) {
      messageBox.classList.add("failure");
      messageBox.innerHTML = `
            <span>${message}</span><i class="fa-solid fa-circle-xmark"></i>
        `;
    } else {
      messageBox.classList.add("success");
      messageBox.innerHTML = `
            <span>${message}</span><i class="fa-solid fa-circle-check"></i>
        `;
    }
    setTimeout(() => {
      messageBox.classList.remove("failure");
      messageBox.classList.remove("success");
    }, 2000);
  }

  addPaymentsToTable(table, data) {
    const rows = table.querySelectorAll("tbody tr");
    const tableBody = table.querySelector("tbody");

    rows.forEach((element) => {
      element.remove();
    });

    console.log(data);

    for (const index in data) {
      const element = data[index];

      tableBody.innerHTML += `
          <tr>
              <td hidden>${element._id}</td>
              <td>${new Date(element.createdAt).toLocaleDateString()}</td>
              <td>${element.cashOrCard}</td>
              <td>${element.totalPrice}</td>
              
              
              <td>
              <select name="" class="operations-edit-select">
                <option value="" selected>Düzenle</option>
                <option value="delete">İşlem Sil</option>
                <option value="add-data">Veri Ekle</option>
                </select>
              </td>
              
              
          </tr>
          `;
    }
  }
  addResponseToTable(table, data) {
    const rows = table.querySelectorAll("tbody tr");
    const tableBody = table.querySelector("tbody");

    rows.forEach((element) => {
      element.remove();
    });

    console.log(data);

    for (const index in data) {
      const element = data[index];

      tableBody.innerHTML += `
          <tr>
              <td hidden>${element._id}</td>
              <td>${new Date(element.createdAt).toLocaleDateString()}</td>
              <td>${element.operationName}</td>
              <td>${element.operationAppointmentStatus}</td>
              <td>${element.appointmensCount}/${element.totalAppointmens}</td>
              <td>${element.paidValue}/${element.operationPrice}</td>
              <td>${(() => {
                if (element.images.length !== 0) {
                  return `
                 <i class="fa-regular fa-images"></i>
                  `;
                } else {
                  return `Resim Yok`;
                }
              })()}

              </td>
              <td><i class="fa-solid fa-folder-plus"></i></td>
              <td>
              <select name="" class="operations-edit-select">
                <option value="" selected>Düzenle</option>
                <option value="delete">İşlem Sil</option>
                <option value="add-data">Veri Ekle</option>
                </select>
              </td>
              
              <td><i class="fa-solid fa-ellipsis-vertical"></i></td>
          </tr>
          `;
    }
  }

  showModalWithoutResponse(success, message) {
    const messageBox = document.querySelector(".information-modal");

    if (success == false) {
      messageBox.classList.add("failure");
      messageBox.innerHTML = `
            <span>${message}</span><i class="fa-solid fa-circle-xmark"></i>
        `;
    } else {
      messageBox.classList.add("success");
      messageBox.innerHTML = `
            <span>${message}</span><i class="fa-solid fa-circle-check"></i>
        `;
    }
    setTimeout(() => {
      messageBox.classList.remove("failure");
      messageBox.classList.remove("success");
    }, 1500);
  }

  showAlert(message) {
    const messageBox = document.querySelector(".information-modal");

    messageBox.classList.add("failure");

    messageBox.innerHTML = `
            <span>${message}</span><i class="fa-solid fa-circle-xmark"></i>
        `;
    setTimeout(() => {
      messageBox.classList.remove("failure");
    }, 1500);
  }

  showAllUsersToUI(users) {
    users.forEach((element, index) => {
      this.table.innerHTML += `
            <tr>
                <td><input type="checkbox" class="item_id" option_id="1"></td>
                
                <td >${element._id}</td>
                <td>${element.name + " " + element.surname}</td>
                <td>${element.debtStatus}</td>
                <td>${element.phone}</td>
                <td>
                    <p class="continue">8/10</p>
                </td>
            
                <td><a href="/admin/users/${
                  element._id
                }" id="details">Detay</a></td>
                <td><a href="#" id="delete-user" style="cursor:pointer; ">Sil</td>
            </tr>
            `;
    });
  }
  selectedDatetoAppointmentUI(selectedDate) {
    console.log("burasu");
    console.log(selectedDate);
    const eventDate = document.querySelector(".appointment-list");
    eventDate.textContent = new Date(selectedDate).toLocaleDateString([], {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  }
  changeHeadCalendar(activeDate) {
    console.log(activeDate);
    const headCalendar = document.querySelector(".head-calendar");
    console.log(headCalendar);
    headCalendar.innerHTML += new Date(activeDate.date).toLocaleDateString([], {
      month: "long",
      year: "numeric",
    });
  }

  showAllPaymensToUI(data) {
    const paymentTablesChildren = document.querySelectorAll("table tbody tr");
    const paymentTable = document.querySelector("table tbody");

    const totalIncome = document.querySelector(".total-income");
    const totalExpenses = document.querySelector(".total-expenses");
    const totalCash = document.querySelector(".total-cash");
    const totalCreditCard = document.querySelector(".total-crediTCard");
    const netCash = document.querySelector(".netCash");

    console.log(data);

    for (const iterator of paymentTablesChildren) {
      iterator.remove();
    }
    if (data.payments.length===0) {
      paymentTable.innerHTML="Bu tarih aralığında tahsilat bulunmamaktadır"
    }else{
      paymentTable.innerHTML=""
    }
    data.payments.forEach((payment, index) => {
      function fromUserCheck() {
        if (payment.fromUser) {
          return true
        }else{
          return false
        }
      }
      
      paymentTable.innerHTML += `
            <tr>
                    <td>${new Date(payment.createdAt).toLocaleDateString()}//${new Date(payment.createdAt).toLocaleTimeString()}</td>
                    
                    <td>${payment.description}</td>
                    <td>${fromUserCheck()?payment.fromUser.name+" "+payment.fromUser.surname:""}</td> 
                    <td>${payment.cashOrCard}</td>
                    <td class="${payment.totalPrice<-1 ? "red_row" : "green_row"}">${payment.totalPrice}</td>
                    <td></td>
                    <td><span class="material-symbols-sharp edit_payment">
                        more_vert
                    </span>
                        <div class="edit_payment_small_modal">
                            <button  class="delete-payment" data-paymentid="${payment._id}">Sil</button>
                            <button class="edit-payment-btn"
                            data-paymentid="${payment._id}">Düzenle</button>
                        </div>
                        
                        
                    
                    </td> 

                </tr>
            `;
    });

    totalIncome.innerHTML = data.totalIncome;
    totalCash.innerHTML = data.totalCash;
    totalCreditCard.innerHTML = data.totalCreditCard;
    totalExpenses.innerHTML = data.totalExpenses;

    netCash.innerHTML = data.netCash;
  }

  showAllSessionToUI(allTimesforAllDoctors, AllDoctor) {
    console.log(allTimesforAllDoctors);
    const allDoctorEvents = document.querySelector(".events-all-doctors");

    while (allDoctorEvents.firstChild) {
      allDoctorEvents.firstChild.remove();
    }

    allTimesforAllDoctors.forEach((timesForSingleDoctor, index) => {
      const singleDoctorArea = document.createElement("div");
      singleDoctorArea.className = "single-doctor-area";
      singleDoctorArea.setAttribute("data-doctorid", AllDoctor[index]._id);

      singleDoctorArea.innerHTML += `
            <div class="doctor-name" value="">
                ${AllDoctor[index].name}
            </div>
            `;
      // singleDoctorArea.dataset=AllDoctor[index]._id
      const singleDoctorEvents = document.createElement("div");
      singleDoctorEvents.className = "single-doctor-events";

      allDoctorEvents.appendChild(singleDoctorArea);

      timesForSingleDoctor.forEach((element, index) => {
        if (element._id) {
          singleDoctorEvents.innerHTML += `
                    <div class="event full" data-session="${
                      element._id
                    }" data-userName="${element.user.name}" style="height:${
            (element.timeIndexes[1] - element.timeIndexes[0] + 1) * 75
          }px">

                        <div class="center">
                        <div>
                        <span>${new Date(element.startHour)
                          .toLocaleTimeString()
                          .slice(0, 5)}-</span><span>${new Date(element.endHour)
            .toLocaleTimeString()
            .slice(0, 5)}</span>

                        </div>

                            <span>${element.user.name} ${
            element.user.surname
          }</span>
                            <span class="buttons">${
                              element.appointmentState
                            }</span>

                        </div>
                        <div class="options-appointments" >
                            <span class="material-symbols-sharp edit-session">
                                more_vert
                            </span>
                            <div class="session-options-modal">
                                <span class="edit-session-btn">Düzenle</span>
                                <span class="delete-session">Sil</span>
                                <span class="change-state">Bitti</span>
                                <span class="change-state">Seansta</span>
                                <span class="change-state">Hasta Gelmedi</span>
                                <span class="change-state">Personel Gelmedi</span>
                                
                            </div>


                          </div>
                          
                    </div>
                    `;
          singleDoctorArea.appendChild(singleDoctorEvents);
        } else {
          singleDoctorEvents.innerHTML += `
                         
                    <div class="event" data-time="${index}" data-startHour="${
            element.startHour
          }" data-endHour="${element.endHour}" style="height:75px">
                                             
                        <div>
                        <span>${new Date(element.startHour).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )} </span> -
                        <span>${new Date(element.endHour).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )} </span>
                        
                        
                        </div>
                        <span>  Boş</span>
                        
                        <div>
                        <input type="checkbox" name="aaa" id="">
                        </div>
                        

                       


                    </div>
                    
                    `;
          singleDoctorArea.appendChild(singleDoctorEvents);
        }
      });
    });
  }

  deleteAllSessionFromUI() {
    const events = document.querySelectorAll(".event");

    events.forEach((element) => {
      element.remove();
    });
  }
  addOperationstoUI(data) {
    const userSelect = document.querySelector("#user-select");
    const orderSelect = document.getElementById("proccess_type_add");
    if (data.length === 0) {
      let opt = document.createElement("option");
      opt.setAttribute("selected", "");
      opt.setAttribute("disable", "");
      opt.setAttribute("hidden", "");
      opt.textContent = "hastaya Ait İşlem Yok";
      orderSelect.add(opt);
    } else {
      for (let index = orderSelect.options.length - 1; index >= 0; index--) {
        console.log(orderSelect.options[index]);
        orderSelect.options[index].remove();
      }

      let opt = document.createElement("option");
      opt.setAttribute("selected", "");
      opt.setAttribute("disable", "");
      opt.setAttribute("hidden", "");
      opt.textContent = "İşlem Seçiniz";
      orderSelect.add(opt);

      data.forEach((element) => {
        let opt = document.createElement("option");
        opt.setAttribute("data-price", element.operationPrice);
        opt.setAttribute("data-id", element._id);
        opt.textContent = element.operationName;
        opt.value = element.operationName;
        orderSelect.add(opt);
      });
    }
  }

  deletePaymentFromUI(payment) {
    payment.remove();
  }

  deleteUserFromUI(element) {
    element.remove();
  }
  createEditModal() {}

  addUsertoUI(newUser) {
    console.log(newUser);
    this.table.innerHTML += `
        <tr>
            <td><input type="checkbox" class="item_id" option_id="1"></td>
            
            <td>${newUser.data._id}</td>
            <td>${newUser.data.name + " " + newUser.data.surname}</td>
            <td>${newUser.data.name}</td>
            <td>${newUser.data.debtStatus}</td>
            <td>${newUser.data.phone}</td>
            
            <td>
                <p class="continue">8/10</p>
            </td>
        
            <td><a href="/admin/users/${
              newUser.data._id
            }" id="details">Detay</a></td>
            <td><a href="#" id="delete-user" style="cursor:pointer; ">Sil</td>
        </tr>
        `;
  }

  createChart(response) {
    const sexStaticsLabels = ["Kadın", "Erkek"];
    const sexStaticsValues = response.sexStatics;
    const staticsArea = document.querySelector(".statics");
    const filterInfo = document.querySelector(".filter-info");
    const canvas = `<canvas id="sex_statics" style="width:100%;max-width:800px"></canvas>`;

    filterInfo.classList.remove("showed");

    if (response.sexStatics[0] == 0 && response.sexStatics[0] == 0) {
      filterInfo.classList.add("showed");
      staticsArea.innerHTML = "";
    } else {
      staticsArea.innerHTML = canvas;
      new Chart("sex_statics", {
        type: "pie",
        data: {
          labels: sexStaticsLabels,
          datasets: [
            {
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
              ],
              data: sexStaticsValues,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: "Kadın-Erkek Oranı",
          },
        },
      });
    }
  }
}
