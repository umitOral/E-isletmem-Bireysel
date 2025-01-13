console.log("test1");

import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();
ui.closeNotification()

const formAddSubscription = document.querySelector("#add_subscription");

const paymentValue = document.querySelector("#payment_value");
const userCount = document.querySelector("#userCount");
const mounthCount = document.querySelector("#mounthCount");

formAddSubscription.addEventListener("submit", addPaymentRequest);


function addPaymentRequest(e) {
  e.preventDefault();

  let data = {
    type: "subscription",
    price: Number(paymentValue.textContent),
    paymentDuration: mounthCount.options[mounthCount.options.selectedIndex].value,
  };


    request
      .postWithUrl("./addCompanyPayment", data)
      .then((response) => {
        console.log(response);


          ui.showNotification(response.success, response.message);
          
          if (response.success===true) {
            window.open(response.data, "_blank");
            
          }
          
        
      })

      .catch((err) => {
        ui.showNotification(false, err);
      });
  }

  userCount.addEventListener("change", function () {
    calculateTotalPayment()
   })

  mounthCount.addEventListener("change", function () {
    calculateTotalPayment()
   })


   function calculateTotalPayment(){
    let basePrice = 750;
    
    let total = basePrice+ 250* (userCount.value-1);

    paymentValue.textContent=total* mounthCount.options[mounthCount.options.selectedIndex].value;
   }