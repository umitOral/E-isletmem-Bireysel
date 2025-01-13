console.log("test1");

import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();
ui.closeNotification();

const formAddSubscription = document.querySelector("#add_subscription");
const dialog = document.querySelector("dialog");

const closeButton = document.querySelector("dialog span");

const modalAddPayment = document.querySelector(
  "#add_payment"
);
const modalAddPaymentInner = document.querySelector(
  ".inner_modal .payment_body"
);
const closeModal = document.querySelector(
  ".close_modal"
);

const loader = document.querySelector(".loader_wrapper.hidden");
const paymentValue = document.querySelector("#payment_value");
const userCount = document.querySelector("#userCount");
const mounthCount = document.querySelector("#mounthCount");

formAddSubscription.addEventListener("submit", addPaymentRequest);

function addPaymentRequest(e) {
  e.preventDefault();

  let data = {
    type: "subscription",
    price: Number(paymentValue.textContent),
    paymentDuration:
      mounthCount.options[mounthCount.options.selectedIndex].value,
      userCount:Number(userCount.value)
  };
  loader.classList.toggle("showed");
  request
    .postWithUrl("./addCompanyPayment", data)
    .then((response) => {
      console.log(response);

      
      
      if (response.success === true) {
        console.log("burası");
        // window.open(response.data, "_blank");
        loader.classList.toggle("showed");
        
        const iframe = document.createElement("iframe");

        // Iframe özelliklerini ayarla
        iframe.id = "dynamicIframe";
        iframe.src = response.data.paymentPageUrl; // Hedef URL
        iframe.width = "100%"; // Genişlik
        iframe.height = "600px"; // Yükseklik
        iframe.style.border = "1px solid #ccc"; // Kenarlık ekle
        window.addEventListener('message', handlePaymentMessage);

        // Iframe'i DOM'a ekle
        modalAddPaymentInner.innerHTML=""
        modalAddPaymentInner.appendChild(iframe);
        
        modalAddPayment.classList.remove("hidden");
      }
    })

    .catch((err) => {
      loader.classList.remove("showed");
      console.log(err)
      ui.showNotification(false, err);
    });
}


const handlePaymentMessage = (event) => {
  // Güvenlik kontrolü
  // if (event.origin !== 'https://your-domain.com') return;
  
  const { status, message } = event.data;
  
  if (status === 'success') {
    // Başarılı ödeme
    alert('Ödeme başarılı!');
    dialog.showModal();
    // Modalı kapat
    modalAddPayment.classList.add("hidden");
    // Sayfayı yenile veya başka bir işlem yap
    window.location.reload();
  } else {
    // Başarısız ödeme
    modalAddPayment.classList.add("hidden");
    alert(`Ödeme başarısız: ${message}`);
    
  }
  
  // Listener'ı temizle
  window.removeEventListener('message', handlePaymentMessage);
};

closeButton.addEventListener("click", () => {
  dialog.close();
});


userCount.addEventListener("change", function () {
  calculateTotalPayment();
});

mounthCount.addEventListener("change", function () {
  calculateTotalPayment();
});

function calculateTotalPayment() {
  let basePrice = 750;

  let total = basePrice + 250 * (userCount.value - 1);

  paymentValue.textContent =
    total * mounthCount.options[mounthCount.options.selectedIndex].value;
}

closeModal.addEventListener("click",  ()=> {
  modalAddPayment.classList.add("hidden");
});


