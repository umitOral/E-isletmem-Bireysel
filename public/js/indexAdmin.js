
import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();
ui.closeNotification()


// definitions

const userData = document.querySelector("#userName");
const userPhone = document.querySelector("#userPhone");
const addOperationModalBtn = document.querySelector("#add_operation_modal");
const addOperationForm = document.querySelector("#add_operation_form");
const cancelButtons = document.querySelectorAll(".cancel_button");
const serviceAddSelect = document.querySelector(".service_type_add");



const tableOfSelectedServices = document.querySelector(
  ".selected_proccess_type_add tbody"
);
const operationsAreaButtons = document.querySelector("#operations");
const dataSelectInput = document.querySelector("#datas_select_input");
const dataSelectInput2 = document.querySelector("#datas_select_input2");
const datasOptionsSelectInput = document.querySelector(
  "#datasOptions_select_input"
);
const datasOptionsSelectInput2 = document.querySelector(
  "#datasOptions_select_input2"
);
const oldOperationBtn = document.querySelector("#old_operation");

const addOperationModal = document.querySelector(".modal_add_operation");
const addDescriptionModal = document.querySelector(".add-description-modal");
const addDescriptioToOperationModal = document.querySelector(".add-descriptioToOperation-modal");
const addDataModal = document.querySelector(".add-data-modal");
const addDataToOperationModal = document.querySelector(".add-dataToOperation-modal");
const editDataModal = document.querySelector(".edit-data-modal");
const editOperationDataModal = document.querySelector(".edit-data-operation-modal");

const addSessionDataForm = document.querySelector("#add-data-form");
const addDescriptionForm = document.querySelector("#add-description-form");
const addDescriptionToOperationForm = document.querySelector("#add-descriptioToOperation-form");
const addDataToOperationForm = document.querySelector("#add-dataToOperation-form");
const editDataForm = document.querySelector("#edit-data-form");
const editOperationDataForm = document.querySelector("#edit-data-operation-form");
const TotalValueCell = document.querySelector("#total_value");
let percentDiscountInput = document.querySelector("#percent_discount");

const appointmentsOfDoctorArea = document.querySelector(
  ".appointments-of-doctor"
);
const operationsArea = document.querySelector("#operations_content");

// created values
let responsedAppointments = [];
let selectedAppointment = {};
let selectedUser = {};
let selectedServices = [];
let selectedUsersOperations = [];
let company = {};
let SESSION_STATUS_LIST = [];
let OPERATION_STATUS = [];
let APPOINTMENT_STATUS=[]
let today = new Date();
let selectedDate = today.toDateString();

//

eventListeners();
getAllAppointmentofSingleDoctor();

function eventListeners() {
  addOperationModalBtn.addEventListener("click", addOperationHandle);
  editDataForm.addEventListener("submit", (e) => editSessionData(e));
  editOperationDataForm.addEventListener("submit", (e) => editOperationData(e));
  oldOperationBtn.addEventListener("click", (e) => getOldOperations(e));
  operationsAreaButtons.addEventListener("click", (e) => {
    handleOperationsButtons(e);
  });
  addSessionDataForm.addEventListener("submit", (e) => addDataToSession(e));
  addDescriptionForm.addEventListener("submit", (e) => addDescriptiontoSession(e));
  addDescriptionToOperationForm.addEventListener("submit", (e) => addDescriptionToOperation(e));
  addDataToOperationForm.addEventListener("submit", (e) => addDataToOperation(e));
  percentDiscountInput.addEventListener("input",calculateTotal);
  
  addOperationForm.addEventListener("submit", addOperation);
  cancelButtons.forEach((element) => {
    element.addEventListener("click", closeModal);
  });
}

serviceAddSelect.addEventListener("change", (e) => {
  selectedServices.push({
    operationName:
      e.target.options[e.target.options.selectedIndex].textContent.trim(),
    operationPrice: Number(
      e.target.options[e.target.options.selectedIndex].dataset.price
    ),
    operationDiscount:0,
    totalAppointments: 1,
  });
  tableOfSelectedServices.innerHTML = "";
  selectedServices.forEach((element) => {
    tableOfSelectedServices.innerHTML += `
        <tr data-operationname="${element.operationName}" data-operationid="${element.operationid}" data-operationprice="${element.operationPrice}">
            <td>${element.operationName}</td>
            <td><input type="number"class="appointment-count tdInputs" value="1" min="1"></td>
            <td>${element.operationPrice}</td>
            <td><input class="discount tdInputs" max="${element.operationPrice}"></input></td>
            <td><i class="fa-solid fa-trash delete_items_from_basket"></i></td>
        </tr>
        `;
  });
  calculateTotal()
});

appointmentsOfDoctorArea.addEventListener("click", (e) => {
  if (e.target.classList.contains("appointmentCheckBox")) {
    handleAppointmentSelect(e);
  }
});

appointmentsOfDoctorArea.addEventListener("change", (e) => {
  if (e.target.classList.contains("change-state-appointment")) {
    console.log("dadad")
    changeAppointmentState(e);
  }
});

operationsArea.addEventListener("change", (e) => {
  
  // if (e.target.classList.contains("edit-operation-status")) {
  //   operationStatusSelectHandle(e);
  // }
  if (e.target.classList.contains("edit-session-status")) {
    sessionStatusSelectHandle(e);
  }
});

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

function changeAppointmentState(e) {
  request.getwithUrl("/admin/appointments/"+e.target.parentElement.parentElement.dataset.appointmentid+"/updateStateAppointment?state="
  +e.target.options[e.target.options.selectedIndex].value
  )
  .then(response=>{
    console.log(response)
    e.target.parentElement.parentElement.classList.add("finished")
  })
  .catch(err=>console.log(err))
}

// function operationStatusSelectHandle(e) {
//   let data = {
//     value: e.target.options[e.target.selectedIndex].value,
//     appointmentID:selectedAppointment
//   };
//   console.log(e.target);
//   console.log(data);
//   request
//     .postWithUrl(
//       "./admin/operations/" +
//         e.target.parentElement.parentElement.parentElement.dataset.operationid +
//         "/updateOperationStatus/",
//       data
//     )
//     .then((response) => {
//       console.log(response);
//       ui.showNotification(response.succes, response.message);
//       updateOperationsofAppointment(response.responseData);
      
//     })
//     .catch((err) => console.log(err));
// }
function sessionStatusSelectHandle(e) {
  let data = {
    value: e.target.options[e.target.selectedIndex].value,
    appointmentID:selectedAppointment
  };
  
  request
    .postWithUrl(
      "./admin/operations/" +
        e.target.parentElement.parentElement.parentElement.dataset.operationid +
        "/updateSessionStatus/" +
        e.target.parentElement.parentElement.dataset
          .sessionid +
        "/",
      data
    )
    .then((response) => {
      console.log(response);
      ui.showNotification(response.succes, response.message);
      updateOperationsofAppointment(response.responseData);
      
    })
    .catch((err) => console.log(err));
}

function handleAppointmentSelect(e) {
  addOperationModalBtn.style = "visibility:visible";
  oldOperationBtn.style = "visibility:visible";
  selectedAppointment =e.target.parentElement.parentElement.dataset.appointmentid;
  selectedUser = e.target.parentElement.parentElement.dataset.userid;
  operationsArea.innerHTML = ``;
  let indexcontrol=responsedAppointments.findIndex((item)=>item._id===e.target.parentElement.parentElement.dataset.appointmentid)
  console.log(responsedAppointments)
  let data=responsedAppointments[indexcontrol].operations.map((item)=>item.operation)
  
  console.log(data)

  request
    .postWithUrl(
      "./admin/users/" + selectedUser + "/getUsersPlannedOperations",data
    )
    .then((response) => {
      console.log(response);
      selectedUsersOperations = response.operations;
      ui.updateOperationstoUI(
        selectedUsersOperations,
        operationsArea,
        OPERATION_STATUS,
        SESSION_STATUS_LIST
      );
    });
}

function updateOperationsofAppointment(responseData) {
  if (Array.isArray(responseData) === true) {
    responseData.forEach((element) => {
      let indexcontrol = selectedUsersOperations.findIndex(
        (item) => item._id === element._id
      );
      if (indexcontrol !== -1) {
        selectedUsersOperations.splice(indexcontrol, 1);
      }
      selectedUsersOperations.push(element);
    });
  } else {
    let indexcontrol = selectedUsersOperations.findIndex(
      (item) => item._id === responseData._id
    );
    if (indexcontrol !== -1) {
      selectedUsersOperations[indexcontrol]=responseData;
    }
    
  }

  

  console.log(selectedUsersOperations);
  tableOfSelectedServices.innerHTML = "";
  operationsArea.innerHTML = "";
  ui.updateOperationstoUI(
    selectedUsersOperations,
    operationsArea,
    OPERATION_STATUS,
    SESSION_STATUS_LIST
  );
}

addOperationModal.addEventListener("click", (e) => {
 
  if (e.target.classList.contains("delete_items_from_basket")) {
    console.log("xxx");
    let controlindex = selectedServices.findIndex(
      (item) =>
        item.operationName ===
        e.target.parentElement.parentElement.dataset.operationname
    );
    selectedServices.splice(controlindex, 1);
    e.target.parentElement.parentElement.remove();
    calculateTotal()
  }
});

addOperationModal.addEventListener("change", (e) => {
  console.log(e.target);
  if (e.target.classList.contains("appointment-count")) {
    
    let controlindex = selectedServices.findIndex(
      (item) =>
        item.operationName ===
        e.target.parentElement.parentElement.dataset.operationname
    );
    
    selectedServices[controlindex].totalAppointments=e.target.value;
    console.log(selectedServices)
  }
 
});
addOperationModal.addEventListener("input", (e) => {
  if (e.target.classList.contains("discount")) {
    console.log("hahahah")
    let controlindex = selectedServices.findIndex(
      (item) =>
        item.operationName ===
        e.target.parentElement.parentElement.dataset.operationname
    );
    
    selectedServices[controlindex].operationDiscount=e.target.value;
    calculateTotal()
  }
 
});



function getAllAppointmentofSingleDoctor() {
  request
    .getwithUrl(
      "./api/getAllAppointmentofSingleDoctor/" +
        selectedDate.replaceAll("/", "-")
    )
    .then((response) => {
      const sessionsOfDoctorSingleDay = response.sessionsOfDoctorSingleDay;
      company = response.company;
      const workHours = response.workHours;
      SESSION_STATUS_LIST = Object.values(response.SESSION_STATUS_LIST);
      OPERATION_STATUS= Object.values(response.OPERATION_STATUS);
      APPOINTMENT_STATUS= Object.values(response.APPOINTMENT_STATUS);
      responsedAppointments = response.sessionsOfDoctorSingleDay;

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
          timeIndex: index,
          startHour: addMinutes(index * workPeriod),
          endHour: addMinutes((index + 1) * workPeriod),
        };
      }

      function addMinutes(minutes) {
        const date = new Date(`${selectedDate},${workStartTime}`);
        date.setMinutes(date.getMinutes() + minutes);
        return date;
      }

      sessionsOfDoctorSingleDay.forEach((element, index) => {
        times.splice(
          element.timeIndexes[0],
          element.timeIndexes[1] - element.timeIndexes[0] + 1,
          element
        );
      });
      console.log(times);

      ui.sessionToUISingleDoctor(times,APPOINTMENT_STATUS);
    })
    .catch((err) => console.log(err));
}

function addOperationHandle() {
  console.log(selectedAppointment);
  addOperationModal.classList.add("showed_modal");
}
function closeModal() {
  addOperationModal.classList.remove("showed_modal");
  addDataModal.classList.remove("showed_modal");
  editDataModal.classList.remove("showed_modal");
  editOperationDataModal.classList.remove("showed_modal");
  addDescriptionModal.classList.remove("showed_modal");
  addDescriptioToOperationModal.classList.remove("showed_modal");
  addDataToOperationModal.classList.remove("showed_modal")
  // addOperationDataModal.classList.remove("showed_modal")
}

function addOperation() {
  let data = {
    selectedOperations: selectedServices,
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
      selectedServices = [];
      updateOperationsofAppointment(response.responseData);
    })
    .catch((err) => {
      ui.showNotification(err.succes, err.message);
    });
  addOperationModal.classList.remove("showed_modal");
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
      editDataModal.classList.remove("showed_modal");
    })
    .catch((err) => {
      console.log(err);
      ui.showNotification(err.succes, err.message);
    });
  addOperationModal.classList.remove("showed_modal");
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
        "/editDataofOperation/"+
        editOperationDataForm.dataset.dataid,
      data
    )
    .then((response) => {
      ui.showNotification(response.succes, response.message);
      console.log(response);
      updateOperationsofAppointment(response.responseData);
      editDataModal.classList.remove("showed_modal");
    })
    .catch((err) => {
      console.log(err);
      ui.showNotification(err.succes, err.message);
    });
  editOperationDataModal.classList.remove("showed_modal");
}

function handleOperationsButtons(e) {
  
  if (e.target.classList.contains("delete-data-session")) {
    console.log(e.target.parentElement.parentElement);
    if (confirm("Opsiyon silinecek onaylıyor musunuz?")) {
      request
        .getwithUrl(
          "./admin/operations/" +
            e.target.parentElement.parentElement.parentElement.parentElement
              .dataset.operationid +
            "/deleteSessionData/" +
            e.target.parentElement.parentElement.parentElement.dataset.sessionid +
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

    const operationDescribeDetails = document.querySelector("#operation-describe-details");
    addDescriptionModal.classList.add("showed_modal")
    addDescriptionForm.dataset.operationid=e.target.parentElement.parentElement.parentElement.dataset.operationid
    addDescriptionForm.dataset.sessionid=e.target.parentElement.parentElement.dataset.sessionid
    addDescriptionForm.adddescription.value=operationDescribeDetails.textContent.trim()
  }
  if (e.target.classList.contains("add-descriptionToOperation")) {

    addDescriptioToOperationModal.classList.add("showed_modal")
    addDescriptionToOperationForm.dataset.operationid=e.target.parentElement.parentElement.parentElement.dataset.operationid
    
  }
  if (e.target.classList.contains("add-dataToOperation")) {

    addDataToOperationModal.classList.add("showed_modal")
    addDataToOperationForm.dataset.operationid=e.target.parentElement.parentElement.parentElement.dataset.operationid
    
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

    editDataModal.classList.add("showed_modal");
  }
  if (e.target.classList.contains("edit-data-operation")) {
    editOperationDataForm.dataNameEdit.value = e.target.parentElement.dataset.dataname;

    editOperationDataForm.dataset.operationid =
      e.target.parentElement.parentElement.parentElement.parentElement.dataset.operationid;

      editOperationDataForm.dataset.dataid = e.target.parentElement.dataset.dataid;

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

    editOperationDataModal.classList.add("showed_modal");
  }
  if (e.target.classList.contains("add-dataToSession")) {
    console.log("+++");
    addDataModal.classList.add("showed_modal");
    addSessionDataForm.dataset.operationid =
      e.target.parentElement.parentElement.parentElement.dataset.operationid;
      addSessionDataForm.dataset.sessionid =
      e.target.parentElement.parentElement.dataset.sessionid;
  }
}

function addDataToOperation(e) {
  e.preventDefault();

  let data={}
 
  if (datasOptionsSelectInput2.options.selectedIndex===-1) {
     data = {
        dataName:
          dataSelectInput2.options[
            dataSelectInput2.options.selectedIndex
          ].textContent.trim(),
        data:addDataToOperationForm.dataOptionNumberValue.value
      };
  }else{
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
      addSessionDataForm.dataOptionNumberValue.value=""
      addDataToOperationModal.classList.remove("showed_modal");
      updateOperationsofAppointment(response.responseData);
    })
    .catch((err) => console.log(err));
}
function addDataToSession(e) {
  e.preventDefault();

  let data={}
 
  if (datasOptionsSelectInput.options.selectedIndex===-1) {
     data = {
        dataName:
          dataSelectInput.options[
            dataSelectInput.options.selectedIndex
          ].textContent.trim(),
        data:addSessionDataForm.dataOptionNumberValue.value
      };
  }else{
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
      addSessionDataForm.dataOptionNumberValue.value=""
      addDataModal.classList.remove("showed_modal");
      updateOperationsofAppointment(response.responseData);
    })
    .catch((err) => console.log(err));
}

function addDescriptiontoSession(e) {
  e.preventDefault()
  let data={
    description:addDescriptionForm.adddescription.value
  }
    request
      .postWithUrl(
        "/admin/operations/" +
          addDescriptionForm.dataset.operationid +
          "/addDescriptiontoSession/" +
          addDescriptionForm.dataset.sessionid
          ,
          data
      )
      .then((response) => {
        console.log(response);
        ui.showNotification(response.succes,response.message)
        updateOperationsofAppointment(response.responseData);
        addDescriptionModal.classList.remove("showed_modal")
      })
      .catch((err) => console.log(err));
}
function addDescriptionToOperation(e) {
  e.preventDefault()
  let data={
    description:addDescriptionToOperationForm.descriptioToOperation.value
  }
    request
      .postWithUrl(
        "/admin/operations/" +
        addDescriptionToOperationForm.dataset.operationid +
          "/addDescriptiontoOperation/"
          ,
          data
      )
      .then((response) => {
        console.log(response);
        ui.showNotification(response.succes,response.message)
        updateOperationsofAppointment(response.responseData);
        addDescriptioToOperationModal.classList.remove("showed_modal")
      })
      .catch((err) => console.log(err));
}

function getOldOperations(params) {
  request
    .getwithUrl("./admin/users/" + selectedUser + "/getUsersOldOperations")
    .then((response) => {
      console.log(response);
      ui.showOldOperations(response.data);
      ui.showNotification(response.succes, response.message);
    })
    .catch((err) => console.log(err));
}


function calculateTotal() {
  let percentDiscountInput = document.querySelector("#percent_discount");
  let totalPrice=selectedServices.map((item)=>item.operationPrice-item.operationDiscount).reduce((a,b)=>a+b)

    totalPrice=(totalPrice*(100-percentDiscountInput.value)/100).toFixed(0)
 
  
  
  TotalValueCell.innerHTML=totalPrice
}