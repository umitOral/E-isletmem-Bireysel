export class UI {
  constructor() {
    this.table = document.getElementById("userList");
  }

  closeNotification(){
    const wrapper = document.querySelector(".information-modal-wrapper")
    
    wrapper.addEventListener("click", (e) => {
        if (e.target.classList.contains("fa-xmark")) {
            e.target.parentElement.remove()
        }
    })
  }

  tableRowSelection(table){
    console.log("checkbox sele")
    const tables = document.querySelectorAll("table")
    const checkAllBox = table.querySelector("input[type=checkbox]:first-child")
    const tableRows = table.querySelectorAll("tbody tr")
    const checkBoxes = table.querySelectorAll('input[type=checkbox]:not(:first-child)')

    checkBoxes.forEach(element => {
      element.addEventListener("click",(e)=>{
        e.target.parentElement.parentElement.parentElement.classList="background:#0000ff0d"
      })
    });
   
  
      checkAllBox.addEventListener("change",()=>{
        checkBoxes.forEach(element => {
          if (checkAllBox.checked===true) {
            element.checked=true
          }else{
            element.checked=false
          }
        });
      })

    
 
   
  }
  deleteZeroFromPhone(){
    const phoneInput = document.querySelector("#phone");
    
    phoneInput.addEventListener("input", (e) => {
      if (e.target.value.startsWith("0")) {
        e.target.value=e.target.value.substring(1)
      }
    })
  }
  closeAllModals(){
    const allModals=document.querySelectorAll(".modal")
    allModals.forEach(element => {
      element.classList.add("hidden")
    });
  }

  showNotification(success, message) {
    let wrapper = document.querySelector(".information-modal-wrapper");
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

    setTimeout(() => {
      information.remove();
    }, 3000);

    // Bildirimi görünür hale getir
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
                )}</td>
                <td>${element.cashOrCard}</td>
                <td>${element.totalPrice}</td>
                
                
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

  showOldOperations(data) {
    const oldOperationsTable = document.querySelector(
      "#old_operations_content table tbody"
    );

    oldOperationsTable.innerHTML = ``;

    data.forEach((element) => {
      oldOperationsTable.innerHTML += `
                <tr>
                  <td>${element.operationName}</td>
                  <td>${new Date(
                    element.sessionOfOperation[
                      element.sessionOfOperation.length - 1
                    ].sessionDate
                  ).toLocaleDateString("tr-TR")}</td>
                  <td>${element.operationStatus}</td>
                </tr>
      `;
    });
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
    selectedUsersOperations,
    operationsArea,
    OPERATION_STATUS,
    SESSION_STATUS
  ) {
    selectedUsersOperations.forEach((element) => {
      operationsArea.innerHTML += `
      <div class="operation-wrapper">
      <div class="operation" data-operationid="${element._id}">
        <div class="operation_header">
            <h3>${element.operationName}</h3>
            <div class="operation_options">
             
              <i title="Veri Ekle" class="fa-solid fa-plus add-dataToOperation"></i>
              <i title="İşleme Açıklama ekle"class="fa-solid fa-comment-medical add-descriptionToOperation"></i>
              
          </div>
            <div class="operation-describe">
                ${(() => {
                  if (element.operationDescription) {
                    return `
                          <span>Notlar:</span>
                          <span id="operation-describe-details">${element.operationDescription}</span>
                          `;
                  } else {
                    return ``;
                  }
                })()}
              </div>
            <div class="operation-datas">
                ${(() => {
                  if (element.operationData.length !== 0) {
                    return `
                          
                            ${element.operationData
                              .map(
                                (item) => `
                                <div  data-dataname="${item.dataName}" data-dataid="${item._id}">
                                  ${item.dataName}:${item.data}
                                  <div>
                                  <i title="İşlem verisi düzenle" class="fa-solid fa-edit edit-data-operation"></i>
                                  <i title="İşlem verisi Sil" class="fa-solid fa-trash delete-data-operation"></i>
                                  </div>
                                </div>
                            `
                              )
                              .join("")}
                          `;
                  } else {
                    return ``;
                  }
                })()}
              </div>
             

        </div>
      
      <div class="session-of-operation" data-sessionid="${
        element.sessionOfOperation[element.sessionOfOperation.length - 1]._id
      }">
        <div class=""session-header>
          Seans:${element.sessionOfOperation.length}
        </div>
        <div class="operation_options">
          <select name="" class="edit-session-status">
          <option value="${
            element.sessionOfOperation[element.sessionOfOperation.length - 1]
              .sessionState
          }" selected hidden disable>${
        element.sessionOfOperation[element.sessionOfOperation.length - 1]
          .sessionState
      } </option>
                  ${SESSION_STATUS.map(
                    (item) => `<option value="${item}">${item}</option>`
                  )}
          </select> 
          <i title="Veri Ekle" class="fa-solid fa-plus add-dataToSession"></i>
          <i title="Seansa Açıklama ekle"class="fa-solid fa-comment-medical add-description"></i>
          
        </div>
        <div class="data_options">
          
            ${element.sessionOfOperation[
              element.sessionOfOperation.length - 1
            ].sessionDatas
              .map(
                (item) => `
              <div data-sessiondatasid="${item._id}" data-dataname="${item.dataName}">
              ${item.dataName}:${item.data}
                <div>
                  <i title="Veriyi düzenle" class="fa-solid fa-edit edit-data"></i>
                  <i title="Veriyi Sil" class="fa-solid fa-trash delete-data-session"></i>
                </div>
                
              </div>
            `
              )
              .join("")}
          
            ${(() => {
              if (
                element.sessionOfOperation[
                  element.sessionOfOperation.length - 1
                ].sessionDescription
              ) {
                return `
                <div >Notlar:
                ${
                  element.sessionOfOperation[
                    element.sessionOfOperation.length - 1
                  ].sessionDescription
                }
                  
                </div>
                `;
              } else {
                return ``;
              }
            })()}
        </div>
       
              
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
    const messageBox = document.querySelector(".information-modal-wrapper");

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

  showAllSessionToUI(allTimesforAllDoctors, AllDoctor, APPOINTMENT_STATUS) {
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
                ${AllDoctor[index].name} ${AllDoctor[index].surname}
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
            (element.timeIndexes[1] - element.timeIndexes[0] + 1) * 100
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
                            <span>${element.operations.map(
                              (item) => item.operationName
                            )}
                            </span>
                            
                            
                            <span class="buttons">${
                              element.appointmentState
                            }</span>

                            
                         

                        </div>
                        <div class="options-appointments" >
                            <span class="material-symbols-sharp edit-session">
                                more_vert
                            </span>
                            <div class="session-options-modal">
                                ${APPOINTMENT_STATUS.map(
                                  (item) => `
                                <span class="change-state" value="${item}">${item}</span>
                                `
                                ).join("")}
                                
                              
                                
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
  sessionToUISingleDoctor(times, APPOINTMENT_STATUS_LIST) {
    const appointmentsOfDoctor = document.querySelector(
      ".appointments-of-doctor"
    );

    while (appointmentsOfDoctor.firstChild) {
      appointmentsOfDoctor.firstChild.remove();
    }

    times.forEach((element, index) => {
      if (element._id) {
        appointmentsOfDoctor.innerHTML += `
                    <div class="event full" data-appointmentid="${
                      element._id
                    }" data-userid="${element.user._id}" style="height:${
          (element.timeIndexes[1] - element.timeIndexes[0] + 1) * 100
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
                            
                            <select class="change-state-appointment" name="" id="">
                              <option   value="${
                                element.appointmentState
                              }" selected disable hidden>${
          element.appointmentState
        }</option>
                              <span class="delete-session">Sil</span>
                              ${APPOINTMENT_STATUS_LIST.map(
                                (item) => `
                              <option  value="${item}">${item}</option>
                              `
                              )}
                            </select>
     
                        </div>
                        <div>
                        <input type="radio" name="appointmentCheckBox" class="appointmentCheckBox">
                        </div>
                       
                          
                    </div>
                    `;
      } else {
        appointmentsOfDoctor.innerHTML += `
                         
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
                       
                        
                        </div>
                        

                    </div>
                    
                    `;
      }
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
    while (orderSelect.firstChild) {
      orderSelect.firstChild.remove()
    }
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
        opt.setAttribute("data-nextsessionnumber", element.sessionOfOperation.length+1);
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
