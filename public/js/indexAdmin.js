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


const plannedOperationsAreaButtons = document.querySelector("#operations");
const dataSelectInput = document.querySelector("#datas_select_input");
const dataSelectInput2 = document.querySelector("#datas_select_input2");
const datasOptionsSelectInput = document.querySelector(
  "#datasOptions_select_input"
);
const datasOptionsSelectInput2 = document.querySelector(
  "#datasOptions_select_input2"
);

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
const plannedOperationsArea = document.querySelector(
  "#operations_content_planned div"
);
const operationsArea = document.querySelector("#operations_content div");

// created values
let allAppointments = [];
let selectedAppointment = {};
let selectedUser = {};

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

plannedOperationsArea.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-operation-proved")) {
    if (e.target.parentElement.dataset.operationtype === "old") {
      handleOldOperationAddProved(e);
    }
    if (e.target.parentElement.dataset.operationtype === "new") {
      handleNewOperationAddProved(e);
    }
  }
});

function handleNewOperationAddProved(e) {
  let data = {
    serviceName: e.target.parentElement.dataset.servicename,
  };

  request
    .postWithUrl(
      "/api/newOperationAddProved/"+ selectedAppointment._id+"/"+selectedUser,data
    )
    .then((response) => {
      console.log(response);
      ui.showNotification(response.success, response.message);
    })
    .catch((err) => {
      ui.showNotification(false, err.message);
      console.log(err);
    });
}

function handleOldOperationAddProved(e) {
  request
    .getwithUrl(
      "/api/oldOperationAddProved/" +
        selectedAppointment._id +
        "/" +
        e.target.parentElement.dataset.operationid
    )
    .then((response) => {
      console.log(response);
      ui.showNotification(response.success, response.message);
    })
    .catch((err) => {
      ui.showNotification(false, err.message);
      console.log(err);
    });
}

dataSelectInput.addEventListener("change", (e) => {
  while (datasOptionsSelectInput.children[0]) {
    datasOptionsSelectInput.children[0].remove();
  }

  let indexcontrol = company.serviceDatas.findIndex(
    (item) => item._id === e.target.value
  );
  console.log(indexcontrol);
  datasOptionsSelectInput.innerHTML += "";

  company.serviceDatas[indexcontrol].dataOptions.forEach((element) => {
    datasOptionsSelectInput.innerHTML += `
            <option value="${element}">${element}</option>
        `;
  });
});

dataSelectInput2.addEventListener("change", (e) => {
  while (datasOptionsSelectInput2.children[0]) {
    datasOptionsSelectInput2.children[0].remove();
  }

  let indexcontrol = company.serviceDatas.findIndex(
    (item) => item._id === e.target.value
  );
  console.log(indexcontrol);
  datasOptionsSelectInput2.innerHTML += "";

  company.serviceDatas[indexcontrol].dataOptions.forEach((element) => {
    datasOptionsSelectInput2.innerHTML += `
            <option value="${element}">${element}</option>
        `;
  });
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

  selectedAppointment = allAppointments.sessionsofdoctorforactualDay.find(
    (item) => item._id === element.dataset.session
  );

  selectedUser = selectedAppointment.user._id;

  plannedOperationsArea.innerHTML = ``;
  console.log(allAppointments);

  console.log(selectedAppointment);

  ui.updateOperationstoUI(
    selectedAppointment,
    plannedOperationsArea,
    OPERATION_STATUS,
    SESSION_STATUS_LIST
  );
}

function updateOperationsofAppointment(responseData) {
  let index = selectedAppointment.plannedOperations.oldOperations.findIndex(
    (item) => item._id === responseData._id
  );
  selectedAppointment.plannedOperations.oldOperations[index] = response.data;


  plannedOperationsArea.innerHTML = "";
  ui.updateOperationstoUI(
    selectedAppointment,
    plannedOperationsArea,
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
      allAppointments = response.allDoctorDatas[0];

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
      console.log("haho");
      handleAppointmentSelect(element);
    });
  });
}

function addOperationHandle() {
  console.log(selectedAppointment);
  addOperationModal.classList.remove("hidden");
}

function addOperation() {
  let data = {
   
    appointment: selectedAppointment,
    percentDiscount: Number(addOperationForm.percent_discount.value),
  };
  request
    .postWithUrl(
      "./admin/users/" + selectedUser + "/addOperationInsideAppointment",
      data
    )
    .then((response) => {
      ui.showNotification(response.succes, response.message);
      console.log(response);
      
      updateOperationsofAppointment(response.responseData);
    })
    .catch((err) => {
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
      console.log(response);
      updateOperationsofAppointment(response.responseData);
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
    const operationDescribeDetails = document.querySelector(
      "#operation-describe-details"
    );
    addDescriptionModal.classList.remove("hidden");
    addDescriptionForm.dataset.operationid =
      e.target.parentElement.parentElement.parentElement.dataset.operationid;
    addDescriptionForm.dataset.sessionid =
      e.target.parentElement.parentElement.dataset.sessionid;
    addDescriptionForm.adddescription.value =
      operationDescribeDetails.textContent.trim();
  }
  if (e.target.classList.contains("add-descriptionToOperation")) {
    addDescriptioToOperationModal.classList.remove("hidden");
    addDescriptionToOperationForm.dataset.operationid =
      e.target.parentElement.parentElement.parentElement.dataset.operationid;
  }
  if (e.target.classList.contains("add-dataToOperation")) {
    addDataToOperationModal.classList.remove("hidden");
    addDataToOperationForm.dataset.operationid =
      e.target.parentElement.parentElement.parentElement.dataset.operationid;
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
      e.target.parentElement.parentElement.parentElement.dataset.operationid;
    addSessionDataForm.dataset.sessionid =
      e.target.parentElement.parentElement.dataset.sessionid;
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


