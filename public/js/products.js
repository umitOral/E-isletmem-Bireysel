
import { Request } from "./requests.js";
import { UI } from './ui.js'

const request = new Request();
const ui = new UI();
ui.closeNotification()


const saveButtons = document.querySelectorAll(".input_save_buttons");
const cancelBtns= document.querySelectorAll(".cancel.form-btn");
const priceInputs = document.querySelectorAll(".price_inputs");
const searchProductForm = document.querySelector("#search-product-form");
const addProductButton = document.querySelector("#add_product_btn")
const modalProductAdd = document.querySelector("#add_product")

const addProductForm = document.querySelector("#add-product-form");

addProductForm.addEventListener("submit",(e)=>{
  e.preventDefault()
  let data={
    barcodeType:addProductForm.barcode.dataset.type,
    productName:addProductForm.productName.value,
    barcode:addProductForm.barcode.value,
    brand:addProductForm.brand.value,
    category:addProductForm.category.value,
    stock:addProductForm.stock.value,
    price:addProductForm.price.value,
  }
  request.postWithUrl("./products/addProduct",data)
  .then(response=>{
    ui.showNotification(response.success,response.message)
    
    console.log(response)
    addProductForm.classList.add("hidden")
  })
  .catch(err=>{
    ui.showNotification(err.success,err.message)
    console.log(err)
  })

})

priceInputs.forEach((input) => {
  input.addEventListener("input", () => {
console.log("haho")
    input.nextElementSibling.classList.add("showed");
  });
});

saveButtons.forEach((button) => {
  button.addEventListener("click", () => {

    const newPrice = button.previousElementSibling.value

    let data = {
      servicePrice: newPrice
    }
    request.postWithUrl("./services/" + button.parentElement.dataset.servicesid + "/editService", data)
      .then((response) => {
        console.log(response)
        ui.showNotification(response.success, response.message)
        button.classList.remove("showed");
      })
      .catch(err => ui.showNotification(false, err));
  });
});

searchProductForm.addEventListener("submit",(e)=>{
  e.preventDefault()
  let data={barcode:searchProductForm.barcode.value}
  request.postWithUrl("./products/deneme",data)
  .then(response=>{
    console.log(response)
    modalProductAdd.classList.remove("hidden")
    ui.showNotification(response.success,response.message)
    addProductForm.productName.value=response.data.productName
    addProductForm.barcode.value=response.data.upc||response.data.ean
    if (response.data.ean) {
      addProductForm.barcode.dataset.type="ean"
    }else{
      addProductForm.barcode.dataset.type="upc"
    }
    addProductForm.brand.value=response.data.brand
    addProductForm.category.value=response.data.category
    
  })
  .catch(err=>{
    ui.showNotification(err.success,err.message)
    console.log(err)
  })
})


//modal actions


addProductButton.addEventListener("click", showModalAddServices)

cancelBtns.forEach(element => {
  element.addEventListener("click", () => {
    ui.closeAllModals()
  })
});


function showModalAddServices() {
  modalProductAdd.classList.remove("hidden")
}




