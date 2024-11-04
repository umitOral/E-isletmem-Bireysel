import { Request } from "./requests.js";
import { UI } from "./ui.js";

const request = new Request();
const ui = new UI();
ui.closeNotification();

const companySelects = document.querySelectorAll(".company_options_select");
const modalCompanyDoc = document.querySelector("#modal_company_doc");
const modalCompanySmsActive = document.querySelector("#modal_company_sms_active");
const cancelButtons = document.querySelectorAll(".cancel");
const allModals = document.querySelectorAll(".modal");

let selectedCompanyId;

companySelects.forEach((element) => {
  element.addEventListener("change", (e) => {
    selectedCompanyId=e.target.parentElement.parentElement.dataset.companyid
    if (e.target.value === "docs") {
      request
        .getwithUrl("./superAdmin/getCompanyDocs/"+selectedCompanyId)
        .then((response) => {
          console.log(response);
          ui.showNotification(response.success, response.message);
          let data_area = modalCompanyDoc.querySelector(".data_area");
          data_area.innerHTML=``
          response.docs.forEach((element) => {
            data_area.innerHTML += `
           
             <div class="data-group-vertical" data-docId="${element._id}">
                
                <a href="${element.url} target="_blank">${element.docKey} </a>
                <span>${element.status}</span>
                <select name="" class="company_options_select">
                    <option value="" selected disable hidden>Durum Değiştir</option>
                    <option value="${response.DOC_STATUS.APPROVED}">Onayla</option>
                    <option value="${response.DOC_STATUS.REJECTED}">Reddet</option>
                </select>
             
            </form>
            
        `;
        e.target.selectedIndex=0
            optionSelectHandle();
          });
        })
        .catch((err) => console.log(err));

      modalCompanyDoc.classList.remove("hidden");
    }
    if (e.target.value === "smsFunctionUpdate") {
        console.log("burası")
      request
        .getwithUrl("./superAdmin/getCompanySmsActive/"+selectedCompanyId)
        .then((response) => {
          console.log(response);
          ui.showNotification(response.success, response.message);
         let data_area = modalCompanySmsActive.querySelector(".data_area");
          data_area.innerHTML=``
          data_area.innerHTML=`
           <div class="data-group-vertical" data-docId="${element._id}">
                
                ${(()=>{
                    if (response.companySmsActive===true) {
                        return `<span>Durum:Aktif</span>`
                    } else {
                        return `<span>Durum:Pasif</span>`
                    }
                })()}
                
                <select name="" class="company_sms_select">
                    <option value="" selected disable hidden>Durum Değiştir</option>
                    <option value="true">Aktif et</option>
                    <option value="false">Pasif et</option>
                </select>
             
            </form>
          
          `

          companySmsSelectHandle()
        })
        .catch((err) => console.log(err));

      modalCompanySmsActive.classList.remove("hidden");
    }
  });
});

function optionSelectHandle() {
  let company_options_select = modalCompanyDoc.querySelectorAll(
    ".company_options_select"
  );

  company_options_select.forEach((element) => {
    element.addEventListener("change", (e) => {
      let data={status:e.target.value}
      request
        .postWithUrl("./superAdmin/updateDocStatus/"+selectedCompanyId+"/"+e.target.parentElement.dataset.docid,data)
        .then((response) => {
          console.log(response);
          ui.showNotification(response.success, response.message);
         
        })
        .catch((err) => console.log(err));
    });
    
  });
}

function companySmsSelectHandle() {
  let company_sms_select = modalCompanySmsActive.querySelector(
    ".company_sms_select"
  );
console.log(company_sms_select)
  
  company_sms_select.addEventListener("change", (e) => {
      let data={status:e.target.value}
      request
        .postWithUrl("./superAdmin/updateSmsStatus/"+selectedCompanyId+"/"+e.target.parentElement.dataset.docid,data)
        .then((response) => {
          console.log(response);
          ui.showNotification(response.success, response.message);
         
        })
        .catch((err) => console.log(err));
    });

}


cancelButtons.forEach((element) => {
    element.addEventListener("click", () => {
      allModals.forEach((element) => {
        element.classList.add("hidden");
      });
    });
  });

