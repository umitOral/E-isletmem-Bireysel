import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();
ui.closeNotification();

// definitions

const userData = document.querySelector("#userName");
const userPhone = document.querySelector("#userPhone");
const addOperationModalBtn = document.querySelector("#add_operation_btn");
const addOperationForm = document.querySelector("#add_operation_form");
const serviceAddSelect = document.querySelector(".service_type_add");
const allModals = document.querySelectorAll(".modal");
const cancelBtns = document.querySelectorAll(".cancel.form-btn");
const eventArea = document.querySelector(".time-line-area");
const newOperationsSelect = document.querySelector("#new_operations_select");
const oldOperationsSelect = document.querySelector("#continue_operations_select");


const plannedOperationsAreaButtons = document.querySelector("#operations");
const dataSelectInput = document.querySelector("#datas_select_input");
const dataSelectInput2 = document.querySelector("#datas_select_input2");
const datasOptionsSelectInput = document.querySelector(
  "#datasOptions_select_input"
);
const datasOptionsSelectInput2 = document.querySelector(
  "#datasOptions_select_input2"
);
let dataOptionNumberValue = document.querySelector("#dataOptionNumberValue");
let dataOptionNumberValue2 = document.querySelector("#dataOptionNumberValue2");

const addOperationModal = document.querySelector("#modal_add_operation");
const addDescriptionModal = document.querySelector("#add-description-modal");
const addDescriptioToOperationModal = document.querySelector(
  "#add-descriptioToOperation-modal"
);
const addDataModal = document.querySelector("#add-data-modal");
const addDataToOperationModal = document.querySelector(
  "#add-dataToOperation-modal"
);
const editDataModal = document.querySelector("#edit-data-modal");
const editOperationDataModal = document.querySelector(
  ".edit-data-operation-modal"
);

const addSessionDataForm = document.querySelector("#add-data-form");
const addDescriptionForm = document.querySelector("#add-description-form");
const addDescriptionToOperationForm = document.querySelector(
  "#add-descriptioToOperation-form"
);
const addDataToOperationForm = document.querySelector(
  "#add-dataToOperation-form"
);
const editDataForm = document.querySelector("#edit-data-form");
const editOperationDataForm = document.querySelector(
  "#edit-data-operation-form"
);
const TotalValueCell = document.querySelector("#total_value");


const timeLineArea = document.querySelector(".time-line-area");

const operationsArea = document.querySelector("#operations_content div");

// created values
let allAppointments = [];
let selectedAppointment = {};
let selectedUserId = {};

let selectedAppointmentOperations = [];
let company = {};
let SESSION_STATUS_LIST = [];
let OPERATION_STATUS = [];
let APPOINTMENT_STATUS = [];
let today = new Date();
let activeDay = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();
let selectedDate = today.toString();
selectedDate = year + "-" + (month + 1) + "-" + activeDay;

//

eventListeners();
getAllAppointmentofSingleDoctor();

function eventListeners() {
  addOperationModalBtn.addEventListener("click", addOperationHandle);
  editDataForm.addEventListener("submit", (e) => editSessionData(e));
  editOperationDataForm.addEventListener("submit", (e) => editOperationData(e));

  plannedOperationsAreaButtons.addEventListener("click", (e) => {
    handleOperationsButtons(e);
  });
  addSessionDataForm.addEventListener("submit", (e) => addDataToSession(e));
  addDescriptionForm.addEventListener("submit", (e) =>
    addDescriptiontoSession(e)
  );
  addDescriptionToOperationForm.addEventListener("submit", (e) =>
    addDescriptionToOperation(e)
  );
  addDataToOperationForm.addEventListener("submit", (e) =>
    addDataToOperation(e)
  );
  

  addOperationForm.addEventListener("submit", addOperation);
}

// cancel the modals
cancelBtns.forEach((element) => {
  element.addEventListener("click", (e) => {
    allModals.forEach((element) => {
      element.classList.add("hidden");
    });
  });
});



operationsArea.addEventListener("change", (e) => {
  if (e.target.classList.contains("edit-session-status")) {
    sessionStatusSelectHandle(e);
  }
 
});
let selectedOperationsForAdd={
  new:"",
  old:""
}
let selectedOperationsArea=document.querySelector("#selected-operations-for-add")
newOperationsSelect.addEventListener("change", (e) => {
  oldOperationsSelect.options.selectedIndex=0
  selectedOperationsForAdd.new=e.target.value
  selectedOperationsForAdd.old=""
  console.log(selectedOperationsForAdd)
  selectedOperationsArea.innerHTML=`
  <div>
    <span>${e.target.value}</span>
  </div>
  `
});

oldOperationsSelect.addEventListener("change", (e) => {
  console.log(e.target)
  newOperationsSelect.options.selectedIndex=0
  selectedOperationsForAdd.old=e.target.value
  selectedOperationsForAdd.new=""
  console.log(selectedOperationsForAdd)
  selectedOperationsArea.innerHTML=`
  <div>
    <span>${e.target.options[e.target.options.selectedIndex].textContent}</span>
  </div
  `
});



dataSelectInput.addEventListener("change", (e) => {
 
  
  let dataID = e.target.value;
  request
    .getwithUrl("/admin/datas/" + dataID)
    .then((response) => {
      console.log(response);
      let indexcontrol = response.serviceDatas.findIndex(
        (item) =>
          item.dataName ===
          e.target.options[e.target.options.selectedIndex].textContent.trim()
      );
      console.log(indexcontrol);

      while (datasOptionsSelectInput.children[0]) {
        datasOptionsSelectInput.children[0].remove();
      }

      console.log(response.serviceDatas[indexcontrol].dataOptions.length);
      if (response.serviceDatas[indexcontrol].dataOptions.length === 0) {
        datasOptionsSelectInput.setAttribute("disable", "true");
        datasOptionsSelectInput.parentElement.style = "display:none";
        dataOptionNumberValue.setAttribute("disable", "false");
        dataOptionNumberValue.parentElement.style = "display:block";
      } else {
        datasOptionsSelectInput.setAttribute("disable", "false");
        datasOptionsSelectInput.parentElement.style = "display:block";
        dataOptionNumberValue.setAttribute("disable", "true");
        dataOptionNumberValue.parentElement.style = "display:none";
        response.serviceDatas[indexcontrol].dataOptions.forEach((element) => {
          datasOptionsSelectInput.innerHTML += `
        <option value="${element}">${element}</option>
        `;
        });
      }
    })
    .catch((err) => console.log(err));



});

dataSelectInput2.addEventListener("change", (e) => {
   let dataID = e.target.value;
  request
    .getwithUrl("/admin/datas/" + dataID)
    .then((response) => {
      console.log(response);
      let indexcontrol = response.serviceDatas.findIndex(
        (item) =>
          item.dataName ===
          e.target.options[e.target.options.selectedIndex].textContent.trim()
      );
      console.log(indexcontrol);

      while (datasOptionsSelectInput2.children[0]) {
        datasOptionsSelectInput2.children[0].remove();
      }

      console.log(response.serviceDatas[indexcontrol].dataOptions.length);
      if (response.serviceDatas[indexcontrol].dataOptions.length === 0) {
        datasOptionsSelectInput2.setAttribute("disable", "true");
        datasOptionsSelectInput2.parentElement.style = "display:none";
        dataOptionNumberValue2.setAttribute("disable", "false");
        dataOptionNumberValue2.parentElement.style = "display:block";
      } else {
        datasOptionsSelectInput2.setAttribute("disable", "false");
        datasOptionsSelectInput2.parentElement.style = "display:block";
        dataOptionNumberValue2.setAttribute("disable", "true");
        dataOptionNumberValue2.parentElement.style = "display:none";
        response.serviceDatas[indexcontrol].dataOptions.forEach((element) => {
          datasOptionsSelectInput2.innerHTML += `
        <option value="${element}">${element}</option>
        `;
        });
      }
    })
    .catch((err) => console.log(err));
});


function sessionStatusSelectHandle(e) {
  let data = {
    value: e.target.options[e.target.selectedIndex].value,
    serviceName: e.target.parentElement.parentElement.dataset.serviceName,
    appointmentID: selectedAppointment._id,
  };

  request
    .postWithUrl(
      "./admin/operations/" +
        e.target.parentElement.parentElement.dataset.operationid +
        "/updateSessionStatus/" +
        e.target.parentElement.dataset.sessionid +
        "/",
      data
    )
    .then((response) => {
      console.log(response);
      ui.showNotification(response.succes, response.message);

      updateOperationsofAppointment(response.data);
    })
    .catch((err) => console.log(err));
}

function handleAppointmentSelect(element) {
  addOperationModalBtn.style.display = "block";

  selectedAppointment = allAppointments.find(
    (item) => item._id === element.dataset.session
  );

  selectedUserId = selectedAppointment.user._id;


  console.log(selectedAppointment);

  ui.updateOperationstoUI(
    selectedAppointment,
    OPERATION_STATUS,
    SESSION_STATUS_LIST
  );
}

function updateOperationsofAppointment(responseData) {
  let index = selectedAppointment.plannedOperations.oldOperations.findIndex(
    (item) => item._id === responseData._id
  );
  selectedAppointment.plannedOperations.oldOperations[index] = responseData;

  ui.updateOperationstoUI(
    selectedAppointment,
    OPERATION_STATUS,
    SESSION_STATUS_LIST
  );
}






function getAllAppointmentofSingleDoctor() {
  console.log(selectedDate);
  request
    .getwithUrl(
      "./api/getAllAppointmentofSingleDoctor/" + selectedDate.split("T")[0]
    )
    .then((response) => {
      console.log(response);
      const sessionsOfDoctorSingleDay = response.sessionsOfDoctorSingleDay;
      company = response.company;
      const workHours = response.workHours;
      SESSION_STATUS_LIST = Object.values(response.SESSION_STATUS_LIST);
      OPERATION_STATUS = Object.values(response.OPERATION_STATUS);
      APPOINTMENT_STATUS = Object.values(response.APPOINTMENT_STATUS);
      allAppointments = response.allDoctorDatas[0].sessionsofdoctorforactualDay;

      createTimeline(workHours, response.allDoctorDatas);
      ui.showAllSessionToUI(response.allDoctorDatas, response.workHours);
      handleAppointments();
    })
    .catch((err) => {console.log(err)
      ui.showNotification(false,err.message)
    });
}

function createTimeline(workHours, alldoctorDatas) {
  console.log("oluşturuluyor");
  const times = [];
  const workStartTime = workHours.workStart;
  const workFinishTime = workHours.workEnd;
  const workPeriod = workHours.workPeriod;

  let beginHour = Number(workStartTime.split(":")[0]);
  let endHour = Number(workFinishTime.split(":")[0]);

  for (
    let index = 0;
    index < (endHour - beginHour) * (60 / workPeriod);
    index++
  ) {
    //

    times[index] = {
      startHour: addMinutes(index * workPeriod),
      endHour: addMinutes((index + 1) * workPeriod),
    };
  }
  function addMinutes(minutes) {
    const date = new Date(`${selectedDate},${workStartTime}`);
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }

  eventArea.innerHTML = "";
  times.forEach((element) => {
    eventArea.innerHTML += `
    <div class="time-div prevent-select" data-startHour="${new Date(
      element.startHour
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}" data-endHour="${new Date(element.endHour).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}">
    <span>
        ${new Date(element.startHour).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}

    </span>
    ${alldoctorDatas
      .map((item) => {
        return `
          <div data-doctorid="${item.doctorInformations._id}"></div>
          `;
      })
      .join("")}
    
    </div>
 `;
  });
}

function handleAppointments() {
  const appointmentsDiv = document.querySelectorAll(".event");

  appointmentsDiv.forEach((element) => {
    
    element.addEventListener("click", (e) => {
      
      appointmentsDiv.forEach(element => {
        element.classList.remove("selected")
      });
      element.classList.add("selected")
      handleAppointmentSelect(element);
    });
  });
}

function addOperationHandle() {
  console.log(selectedAppointment);
  addOperationModal.classList.remove("hidden");
  oldOperationsSelect.innerHTML=`
   <option value="" selected="" hidden="" disable="">İşlem Seçiniz</option>`
  request
  .getwithUrl("admin/users/" + selectedUserId + "/getUsersContinueOperations")
  .then((response) => {
    console.log(response);
    response.operations.forEach(element => {
       oldOperationsSelect.innerHTML+=`
        <option value="${element._id}">${element.operationName}</option>
       `
    });
   
  })
  .catch((err) => console.log(err));
}

function addOperation() {
  let data = {
    selectedOperationsForAdd:selectedOperationsForAdd,
    appointment: selectedAppointment._id,
    date:new Date()
  };
  request
    .postWithUrl(
      "./admin/users/" + selectedUserId + "/addOperationInsideAppointment",
      data
    ) 
    .then((response) => {
      console.log(response)
      ui.showNotification(response.succes, response.message);
      let index=allAppointments.findIndex(item=>item._id===response.data._id)
      console.log(index)
      allAppointments[index]=response.data
      selectedAppointment=response.data
      console.log(selectedAppointment)
     
      ui.updateOperationstoUI(
        selectedAppointment,
        OPERATION_STATUS,
        SESSION_STATUS_LIST
      );
      
      
    })
    .catch((err) => {
      console.log(err)
      ui.showNotification(err.succes, err.message);
    });
  addOperationModal.classList.add("hidden");
}

function editSessionData(e) {
  e.preventDefault();
  let data = {
    value: editDataForm.edit_data_option.value,
  };
  request
    .postWithUrl(
      "./admin/operations/" +
        editDataForm.dataset.operationid +
        "/editDataofSession/" +
        editDataForm.dataset.sessionid +
        "/" +
        editDataForm.dataset.dataid,
      data
    )
    .then((response) => {
      ui.showNotification(response.succes, response.message);
      editDataModal.classList.add("hidden");
    })
    .catch((err) => {
      console.log(err);
      ui.showNotification(err.succes, err.message);
    });
  addOperationModal.classList.add("hidden");
}
function editOperationData(e) {
  e.preventDefault();
  let data = {
    value: editOperationDataForm.edit_data_option.value,
  };
  request
    .postWithUrl(
      "./admin/operations/" +
        editOperationDataForm.dataset.operationid +
        "/editDataofOperation/" +
        editOperationDataForm.dataset.dataid,
      data
    )
    .then((response) => {
      ui.showNotification(response.succes, response.message);
      console.log(response);
      updateOperationsofAppointment(response.responseData);
      editDataModal.classList.remove("hidden");
    })
    .catch((err) => {
      console.log(err);
      ui.showNotification(err.succes, err.message);
    });
  editOperationDataModal.classList.add("hidden");
}

function handleOperationsButtons(e) {
  if (e.target.classList.contains("delete-data-session")) {
    console.log(e.target.parentElement.parentElement);
    if (confirm("Opsiyon silinecek onaylıyor musunuz?")) {
      request
        .getwithUrl(
          "./admin/operations/" +
            e.target.parentElement.parentElement.parentElement.parentElement
              .parentElement.dataset.operationid +
            "/deleteSessionData/" +
            e.target.parentElement.parentElement.parentElement.dataset
              .sessionid +
            "/" +
            e.target.parentElement.dataset.sessiondatasid
        )
        .then((response) => {
          "/datas/deleteOption/:dataID/:operationID";
          console.log(response);
          updateOperationsofAppointment(response.responseData);
        })
        .catch((err) => console.log(err));
    }
  }
  if (e.target.classList.contains("delete-data-operation")) {
    console.log(e.target.parentElement.parentElement);
    if (confirm("Veri silinecek onaylıyor musunuz?")) {
      request
        .getwithUrl(
          "./admin/operations/" +
            e.target.parentElement.parentElement.parentElement.parentElement
              .dataset.operationid +
            "/deleteDataOperation/" +
            e.target.parentElement.dataset.dataid
        )
        .then((response) => {
          console.log(response);
          updateOperationsofAppointment(response.responseData);
        })
        .catch((err) => console.log(err));
    }
  }
  if (e.target.classList.contains("add-description")) {
  
    addDescriptionModal.classList.remove("hidden");
    addDescriptionForm.dataset.operationid =
      e.target.parentElement.parentElement.dataset.operationid;
    addDescriptionForm.dataset.sessionid =
      e.target.parentElement.dataset.sessionid;
    
  }
  if (e.target.classList.contains("add-descriptionToOperation")) {
    addDescriptioToOperationModal.classList.remove("hidden");
    addDescriptionToOperationForm.dataset.operationid =
      e.target.parentElement.dataset.operationid;
  }
  if (e.target.classList.contains("add-dataToOperation")) {
    addDataToOperationModal.classList.remove("hidden");
    addDataToOperationForm.dataset.operationid =
      e.target.parentElement.dataset.operationid;
  }
  if (e.target.classList.contains("edit-data")) {
    editDataForm.dataNameEdit.value = e.target.parentElement.dataset.dataname;

    editDataForm.dataset.operationid =
      e.target.parentElement.parentElement.parentElement.parentElement.dataset.operationid;

    editDataForm.dataset.sessionid =
      e.target.parentElement.parentElement.parentElement.dataset.sessionid;

    editDataForm.dataset.dataid = e.target.parentElement.dataset.sessiondatasid;

    let indexcontrol = company.serviceDatas.findIndex(
      (item) => item.dataName === e.target.parentElement.dataset.dataname
    );
    console.log(indexcontrol);
    editDataForm.edit_data_option.innerHTML = "";
    company.serviceDatas[indexcontrol].dataOptions.forEach((element) => {
      editDataForm.edit_data_option.innerHTML += `
            <option value="${element}">${element}</option>
            `;
    });

    editDataModal.classList.remove("hidden");
  }
  if (e.target.classList.contains("edit-data-operation")) {
    editOperationDataForm.dataNameEdit.value =
      e.target.parentElement.parentElement.dataset.dataname;

    editOperationDataForm.dataset.operationid =
      e.target.parentElement.parentElement.parentElement.parentElement.dataset.operationid;

    editOperationDataForm.dataset.dataid =
      e.target.parentElement.dataset.dataid;

    let indexcontrol = company.serviceDatas.findIndex(
      (item) => item.dataName === e.target.parentElement.dataset.dataname
    );
    console.log(indexcontrol);
    editOperationDataForm.edit_data_option.innerHTML = "";
    company.serviceDatas[indexcontrol].dataOptions.forEach((element) => {
      editOperationDataForm.edit_data_option.innerHTML += `
            <option value="${element}">${element}</option>
            `;
    });

    editOperationDataModal.classList.remove("hidden");
  }
  if (e.target.classList.contains("add-dataToSession")) {
    console.log("+++");
    addDataModal.classList.remove("hidden");
    addSessionDataForm.dataset.operationid =
      e.target.parentElement.parentElement.dataset.operationid;
    addSessionDataForm.dataset.sessionid =
      e.target.parentElement.dataset.sessionid;
  }
}

function addDataToOperation(e) {
  e.preventDefault();

  let data = {};

  if (datasOptionsSelectInput2.options.selectedIndex === -1) {
    data = {
      dataName:
        dataSelectInput2.options[
          dataSelectInput2.options.selectedIndex
        ].textContent.trim(),
      data: addDataToOperationForm.dataOptionNumberValue.value,
    };
  } else {
    data = {
      dataName:
        dataSelectInput2.options[
          dataSelectInput2.options.selectedIndex
        ].textContent.trim(),
      data: datasOptionsSelectInput2.options[
        datasOptionsSelectInput2.options.selectedIndex
      ].textContent.trim(),
    };
  }

  request
    .postWithUrl(
      "./admin/operations/" +
        addDataToOperationForm.dataset.operationid +
        "/addDataToOperation",
      data
    )

    .then((response) => {
      console.log(response);
      ui.showNotification(response.succes, response.message);
      addSessionDataForm.dataOptionNumberValue.value = "";
      addDataToOperationModal.classList.add("hidden");
      updateOperationsofAppointment(response.responseData);
    })
    .catch((err) => console.log(err));
}
function addDataToSession(e) {
  e.preventDefault();

  let data = {};

  if (datasOptionsSelectInput.options.selectedIndex === -1) {
    data = {
      dataName:
        dataSelectInput.options[
          dataSelectInput.options.selectedIndex
        ].textContent.trim(),
      data: addSessionDataForm.dataOptionNumberValue.value,
    };
  } else {
    data = {
      dataName:
        dataSelectInput.options[
          dataSelectInput.options.selectedIndex
        ].textContent.trim(),
      data: datasOptionsSelectInput.options[
        datasOptionsSelectInput.options.selectedIndex
      ].textContent.trim(),
    };
  }

  request
    .postWithUrl(
      "./admin/operations/" +
        addSessionDataForm.dataset.operationid +
        "/addDataToSessionInsideAppointment/" +
        addSessionDataForm.dataset.sessionid,
      data
    )

    .then((response) => {
      console.log(response);
      ui.showNotification(response.succes, response.message);
      addSessionDataForm.dataOptionNumberValue.value = "";
      addDataModal.classList.add("hidden");
      updateOperationsofAppointment(response.responseData);
    })
    .catch((err) => console.log(err));
}

function addDescriptiontoSession(e) {
  e.preventDefault();
  let data = {
    description: addDescriptionForm.adddescription.value,
  };
  request
    .postWithUrl(
      "/admin/operations/" +
        addDescriptionForm.dataset.operationid +
        "/addDescriptiontoSession/" +
        addDescriptionForm.dataset.sessionid,
      data
    )
    .then((response) => {
      console.log(response);
      ui.showNotification(response.succes, response.message);
      updateOperationsofAppointment(response.responseData);
      addDescriptionModal.classList.add("hidden");
    })
    .catch((err) => console.log(err));
}
function addDescriptionToOperation(e) {
  e.preventDefault();
  let data = {
    description: addDescriptionToOperationForm.descriptioToOperation.value,
  };
  request
    .postWithUrl(
      "/admin/operations/" +
        addDescriptionToOperationForm.dataset.operationid +
        "/addDescriptiontoOperation/",
      data
    )
    .then((response) => {
      console.log(response);
      ui.showNotification(response.succes, response.message);
      updateOperationsofAppointment(response.responseData);
      addDescriptioToOperationModal.classList.add("hidden");
    })
    .catch((err) => console.log(err));
}


