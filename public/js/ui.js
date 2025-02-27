export class UI {
  constructor() {
    this.table = document.getElementById("userList");
  }

  closeNotification() {
    const wrapper = document.querySelector(".toast-container");

    wrapper.addEventListener("click", (e) => {
      if (e.target.classList.contains("fa-xmark")) {
        e.target.parentElement.remove();
      }
    });
  }

  tableRowSelection(table) {
    console.log("checkbox sele");
    const tables = document.querySelectorAll("table");
    const checkAllBox = table.querySelector("input[type=checkbox]:first-child");
    const tableRows = table.querySelectorAll("tbody tr");
    const checkBoxes = table.querySelectorAll(
      "input[type=checkbox]:not(:first-child)"
    );

    checkBoxes.forEach((element) => {
      element.addEventListener("click", (e) => {
        e.target.parentElement.parentElement.parentElement.classList =
          "background:#0000ff0d";
      });
    });

    checkAllBox.addEventListener("change", () => {
      checkBoxes.forEach((element) => {
        if (checkAllBox.checked === true) {
          element.checked = true;
        } else {
          element.checked = false;
        }
      });
    });
  }
  deleteZeroFromPhone() {
    const phoneInput = document.querySelector("#phone");

    phoneInput.addEventListener("input", (e) => {
      if (e.target.value.startsWith("0")) {
        e.target.value = e.target.value.substring(1);
      }
    });
  }
  closeAllModals() {
    const allModals = document.querySelectorAll(".modal");
    allModals.forEach((element) => {
      element.classList.add("hidden");
    });
  }

  showNotification(success, message,duration=3000) {
    let wrapper = document.querySelector(".toast-container");
    var information = document.createElement("div");
    information.className = "information";

    if (success === false) {
      information.classList.add("failure");

      information.innerHTML = `<i class="fa-solid fa-circle-exclamation left-icon"></i></i><span>${message}</span><i class="fa-solid fa-xmark danger"></i>`;
      wrapper.appendChild(information);
    } else {
      information.classList.add("success");

      information.innerHTML = `
            <i class="fa-solid fa-circle-check left-icon"></i><span>${message}</span><i class="fa-solid fa-xmark success"></i>
        `;
      wrapper.appendChild(information);
    }

    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    information.appendChild(progressBar);

   
    wrapper.appendChild(information);

    // Zaman değişkenleri
    let remainingTime = duration;
    let startTime = Date.now();
    let timer;

    // İlerleme çubuğunu başlat
    function startCountdown() {
        setTimeout(() => {
            progressBar.style.transition = `width ${remainingTime}ms linear`; // Animasyonu başlat
            progressBar.style.width = "0%";
        }, 10); // Barın başlangıçta görünmesini sağlamak için kısa bir gecikme ekledik

        timer = setTimeout(() => {
            information.remove();
        }, remainingTime);
    }

    // İlerleme çubuğunu duraklat
    function pauseCountdown() {
        clearTimeout(timer);
        remainingTime -= Date.now() - startTime;
        progressBar.style.transition = "none"; // Animasyonu durdur
        const computedWidth = (remainingTime / duration) * 100;
        progressBar.style.width = `${computedWidth}%`;
    }

    // İlerleme çubuğunu yeniden başlat
    function resumeCountdown() {
        startTime = Date.now();
        progressBar.style.transition = `width ${remainingTime}ms linear`;
        progressBar.style.width = "0%";
        timer = setTimeout(() => {
            information.remove();
        }, remainingTime);
    }

    // Mouse olaylarını dinle
    information.addEventListener("mouseover", pauseCountdown);
    information.addEventListener("mouseout", resumeCountdown);

    startCountdown();


   


    
  }

  showWarningPopUp (message,data) {
    console.log("hey")
    const closePopUp = document.querySelector("#close_warning_popUp") 
    const warningPopup = document.querySelector(".warning_popup_wrapper")
    const warningPopupMessage = document.querySelector("#popup_message")
    const warningPopupMessageExtra = document.querySelector("#popup_message_extra")

    closePopUp.addEventListener("click",()=>{
      warningPopup.classList.remove("showed")
    })
    
    warningPopup.classList.add("showed")
    warningPopupMessage.innerHTML=message
    if (data) {
      warningPopupMessageExtra.innerHTML=`
      <a class="btn-link save" href="${data}">Ayarlara Git</a>
    `
    }
  }

  addPaymentsToTable(table, data) {
    const rows = table.querySelectorAll("tbody tr");
    const tableBody = table.querySelector("tbody");
    const totalValue = table.querySelector("#total-value");

    rows.forEach((element) => {
      element.remove();
    });

    if (data.length !== 0) {
      totalValue.textContent = data
        .map((item) => item.totalPrice)
        .reduce((a, b) => a + b);
      for (const index in data) {
        const element = data[index];

        tableBody.innerHTML += `
            <tr data-paymentid="${element._id}">
                <td>${new Date(element.createdAt).toLocaleDateString(
                  "tr-TR"
                )}//${new Date(element.createdAt).toLocaleTimeString(
          "tr-TR"
        )}</td>
                <td>${element.cashOrCard}</td>
                <td>
                    ${element.products
                      .map(
                        (item, i) => `
                    <div data-dataId="${item._id}" data-dataName="${item.dataName}">
                    ${item.quantity}x${item.productId.name}=${item.paymentValue} <br>
                    </div>
                    `
                      )
                      .join("")}
                </td>
                <td>
                    ${element.operations
                      .map(
                        (item, i) => `
                      <div>
                      ${item.operationId.operationName}=${item.paymentValue} <br>
                    </div>
                    `
                      )
                      .join("")}
                </td>
                
        
                <td>${element.totalPrice}</td>
                <td>${element.description}</td>
                
                
                <td>
                <select name="" class="payments-edit-select">
                  <option selected disable hidden>Seçenekler</option>
                  <option value="edit-payment">Düzenle</option>
                  <option value="delete-payment">Tahsilat Sil</option>
                  </select>
                </td>
                
                
            </tr>
            `;
      }
    } else {
      tableBody.innerHTML = `
      Herhangi bir ödeme bulunamadı
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
      let operationData = element.operationData.map(
        (item) => item.dataName + ":" + item.data
      );

      tableBody.innerHTML += `
          <tr data-operationid="${element._id}">
             
              <td>${new Date(element.createdAt).toLocaleDateString(
                "tr-TR"
              )}</td>
              <td>${element.operationName}</td>
              <td>${element.operationStatus} </td>
              <td>${element.operationAppointmentStatus} </td>
              
              <td>${element.sessionOfOperation.length}/${
        element.totalAppointments
      }</td>
              <td>
              
              ${element.operationData
                .map(
                  (item, i) => `
              <div data-dataId="${item._id}" data-dataName="${item.dataName}" style="width:max-content;display:flex;gap:0.5rem;align-items:center;">
                 ${item.dataName}:${item.data}
                 <i title="Datayı düzenle" class="fa-regular fa-pen-to-square edit-operation-data"></i>
                 <i title="Datayı Sil" class="fa-regular fa-trash-can delete-operation-data"></i>
              </div>
              `
                )
                .join("")}

              </td>
              
              <td>${element.operationPrice} </td>
              <td>${element.discount}TL+%${element.percentDiscount}</td>
              
              <td>${element.paidValue}/${
        (element.operationPrice - element.discount) *
        ((100 - element.percentDiscount) / 100)
      }</td>
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
              <td><i title="Resim Ekle" class="fa-solid fa-folder-plus"></i>
              </td>
              <td>
              <select name="" class="operations-edit-select">
                <option value="" selected>Seçenekler</option>
                <option value="delete">İşlemi Sil</option>
                <option value="add-data">İşleme Veri Ekle</option>
                <option value="add-session">Seans Arttır</option>
                <option value="show-all-sessions">Seansları Göster</option>
                <option value="add-discount">İndirim Tanımla</option>
                </select>
              </td>
              
              
          </tr>
          `;
    }
  }

  updateOperationstoUI(
    selectedAppointment,
    OPERATION_STATUS,
    SESSION_STATUS
  ) {
    
    const operationsArea = document.querySelector("#operations_content div");
    operationsArea.innerHTML=""
    console.log(selectedAppointment)
    selectedAppointment.plannedOperations.oldOperations.forEach((element) => {
      let session=element.sessionOfOperation.find(item=>item.refAppointmentID===selectedAppointment._id)
      console.log(session)
      let index=element.sessionOfOperation.findIndex(item=>item.refAppointmentID===selectedAppointment._id)
      console.log(index)
      operationsArea.innerHTML += `
      <div class="operation-wrapper">
      <div class="operation" data-operationid="${element._id}" ata-operationType="old">
        
              <span style="font-weight:700">${element.operationName}</span>
              <i title="İşleme Veri Ekle" class="fa-solid fa-plus add-dataToOperation"></i>
              <i title="İşleme Açıklama ekle"class="fa-solid fa-comment-medical add-descriptionToOperation"></i>
              
      <div class="session-of-operation" data-sessionid="${
        session._id
      }">
       
          <span>
            Seans:${index+1}
          </span>
        
          <select name="" class="edit-session-status">
          <option value="${
            session.sessionState
            }" selected hidden disable>${
              session.sessionState
                } </option>
                  ${SESSION_STATUS.map(
                    (item) => `<option value="${item}">${item}</option>`
                  )}
          </select> 
          <i title="Seansa Veri Ekle" class="fa-solid fa-plus add-dataToSession"></i>
          <i title="Seansa Açıklama ekle"class="fa-solid fa-comment-medical add-description"></i>
          
        
      </div>
  </div>

      
      `;
    });
    
   
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
    // setTimeout(() => {
    //   messageBox.classList.remove("failure");
    //   messageBox.classList.remove("success");
    // }, 1500);
  }

  showAlert(message) {
    const messageBox = document.querySelector(".toast-container");

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

    for (const iterator of paymentTablesChildren) {
      iterator.remove();
    }
    if (data.payments.length === 0) {
      paymentTable.innerHTML = "Bu tarih aralığında tahsilat bulunmamaktadır";
    } else {
      paymentTable.innerHTML = "";
    }
    data.payments.forEach((payment, index) => {
      function fromUserCheck() {
        if (payment.fromUser) {
          return true;
        } else {
          return false;
        }
      }
      function comissionEmployeeCheck() {
        if (payment.comissionEmployee) {
          return true;
        } else {
          return false;
        }
      }

      paymentTable.innerHTML += `
            <tr>
                    <td>${new Date(
                      payment.createdAt
                    ).toLocaleDateString()}//${new Date(
        payment.createdAt
      ).toLocaleTimeString()}</td>
                    
                    <td>${payment.description}</td>
                    <td>${
                      fromUserCheck()
                        ? payment.fromUser.name + " " + payment.fromUser.surname
                        : ""
                    }</td> 
                    <td>${
                      comissionEmployeeCheck()
                        ? payment.comissionEmployee.name + " " + payment.comissionEmployee.surname
                        : ""
                    }</td> 
                   
                    <td>${payment.cashOrCard}</td>
                    <td class="${
                      payment.totalPrice < -1 ? "red_row" : "green_row"
                    }">${payment.totalPrice}</td>
                    <td></td>
                    <td><span class="material-symbols-sharp edit_payment">
                        more_vert
                    </span>
                        <div class="edit_payment_small_modal">
                            <button  class="delete-payment" data-paymentid="${
                              payment._id
                            }">Sil</button>
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

  showAllSessionToUI(allDoctorDatas, workHours) {
    const timeLineArea = document.querySelector(".time-line-area");
    const allDoctorArea = document.createElement("div");
    allDoctorArea.className = "all-doctor-area";
    let element=document.querySelector(".all-doctor-area")
    if (element) {
      element.remove()
    }
    
    allDoctorDatas.forEach((singleDoctorData, index) => {
      const singleDoctorArea = document.createElement("div");
      // singleDoctorArea.style.left = `${index*200}px`;
      singleDoctorArea.style.width=`${100/allDoctorDatas.length}%`
      singleDoctorArea.className = "single-doctor-events";
      singleDoctorArea.setAttribute(
        "data-doctorid",
        singleDoctorData.doctorInformations._id
      );
      singleDoctorArea.setAttribute(
        "data-doctoremail",
        singleDoctorData.doctorInformations.email
      );

      if (singleDoctorData.sessionsofdoctorforactualDay.length===0) {
        
        singleDoctorArea.innerHTML=`
        <div></div>
        `
      }else{
        
        singleDoctorData.sessionsofdoctorforactualDay.forEach(
          (element, index) => {
            let topPoint =
              (element.startHour.split(":")[0] -
                workHours.workStart.split(":")[0]) *
                (60*5*10/workHours.workPeriod) +
              (element.startHour.split(":")[1] -
                workHours.workStart.split(":")[1]) *
                (1*5*10/workHours.workPeriod);
            let height =
              (element.endHour.split(":")[0] - element.startHour.split(":")[0]) *
                (60*5*10/workHours.workPeriod) +
              (element.endHour.split(":")[1] - element.startHour.split(":")[1]) *
                (1*5*10/workHours.workPeriod);
              
                
            singleDoctorArea.innerHTML += `
                      
                      <div class="event"
                      
                      data-session="${element._id}"
                      data-startHour="${element.startHour}"
                      data-endHour="${element.endHour}"
                       data-userName="${element.user.name}"
                       style="top:${topPoint}px;height:${height}px;background-color: ${(()=>{
                        if (element.appointmentState==="tamamlandı") {
                            return `#41f1b6`
                        } else if (element.appointmentState==="hasta iptali" ||element.appointmentState==="işletme iptali" ) {
                            return `#ff3949`
                        }else{
                          return `#faebd7`
                        }
                          })()}"
                       >
                          <div class="resize-handle top"></div>
                          <div class="center prevent-select">
                            <div> 
                              <span>${element.startHour}-${element.endHour}
                            </span>
                            </br>
                            <span>${element.user.name} ${
                              element.user.surname}
                            </span>
                                     
                            </div>
                            
                                   
                            
                          </div>
                          
                            <div class="resize-handle bottom"></div>
                        </div>
                          
                      
                      `;
            
          }
        );
      }
      allDoctorArea.appendChild(singleDoctorArea);
      
    });

    timeLineArea.appendChild(allDoctorArea);
  }



  
  addOperationstoUI(data) {
   
    const orderSelect = document.getElementById("proccess_type_add");
    while (orderSelect.firstChild) {
      orderSelect.firstChild.remove();
    }
    if (data.length === 0) {
      let opt = document.createElement("option");
      opt.setAttribute("selected", "");
      opt.setAttribute("disable", "");
      opt.setAttribute("hidden", "");
      opt.textContent = "Bekleyen İşlem Yok";
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
        opt.setAttribute("data-operationid", element._id);
        opt.setAttribute(
          "data-nextsessionnumber",
          element.sessionOfOperation.length + 1
        );
        opt.textContent = element.operationName;
        opt.value = element.operationName;
        orderSelect.add(opt);
      });
    }
  }

  addOperationstoUIforEdit(data) {
    const orderSelect = document.getElementById("proccess_type_add_for_edit");
    
    while (orderSelect.firstChild) {
      orderSelect.firstChild.remove();
    }
    if (data.length === 0) {
      let opt = document.createElement("option");
      opt.setAttribute("selected", "");
      opt.setAttribute("disable", "");
      opt.setAttribute("hidden", "");
      opt.textContent = "İşlem Seçiniz";
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
        opt.setAttribute("data-operationid", element._id);
        opt.setAttribute(
          "data-nextsessionnumber",
          element.sessionOfOperation.length + 1
        );
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
