import { Request } from "./requests.js";
const request = new Request();
import { UI } from "./ui.js";
const ui = new UI();





var proccessTypeStaticsLabels = ["Saç Ekimi", "Dolgu", "Yıkama", "Bakım", "Botox"];
var proccessTypeStaticsValues = [55, 49, 44, 24, 15];
var RevenueStaticsLabels = ["pazt", "salı", "çarş", "per", "cum"];
var RevenueStaticsValues = [50, 60, 45, 56, 20];



var layoutproccessTypeStatics = { title: "İşlemler" };
var layoutRevenueStatics = {title: "Ciro Değişimi"};



var dataProccessType = [{ x: proccessTypeStaticsLabels, y: proccessTypeStaticsValues, type: "bar" }];
var dataRevenueStatics = [{
    x: RevenueStaticsLabels,
    y: RevenueStaticsValues,
    type: "bar"
}];





Plotly.newPlot("proccessType_statics", dataProccessType, layoutproccessTypeStatics);
Plotly.newPlot("revenue_statics", dataRevenueStatics, layoutRevenueStatics);


const getStaticsBtn = document.querySelector(".statics-filter-button")
const startDate = document.querySelector(".start-date")
const endDate = document.querySelector(".end-date")


request.getwithUrl(`/admin/statics/getStaticswithFilter?startDate=${startDate.value}&endDate=${Date().now}`)
.then((response)=>{
    console.log(response)
    var layoutSexStatics = { title: "Kadın/Erkek Oranı" };
    var sexStaticsLabels = ["Kadın", "Erkek"];
    var paymentStaticsLabels = ["Kredi Kartı", "Peşin"];
    var sexStaticsValues = response.sexstatics;
    var paymentStaticsValues = response.paymentstatics;
    var datasexStatics = [{ labels: sexStaticsLabels, values: sexStaticsValues, type: "pie" }];
    var layoutPaymentStatics = { title: "Kredi Kartı/Peşin Oranı" };
    var datapaymentStatics = [{ labels: paymentStaticsLabels, values: paymentStaticsValues, type: "pie" }];
    Plotly.newPlot("sex_statics", datasexStatics, layoutSexStatics);
    Plotly.newPlot("payment_statics", datapaymentStatics, layoutPaymentStatics);
})
.catch((err)=>{
    console.log(err)
})





eventListeners()

function eventListeners() {

    getStaticsBtn.addEventListener("click", getStaticswithFilter)
    startDate.addEventListener("change", dateRange)

}



function getStaticswithFilter(e) {
    request.getwithUrl(`/admin/statics/getStaticswithFilter?startDate=${startDate.value}&endDate=${endDate.value}`)
        .then(response => ui.createChart(response))
        .catch(err => console.log(err))
    e.preventDefault()
}


function startingDate() {

    startDate.valueAsDate = new Date()
    endDate.valueAsDate = new Date()

}

startingDate()

function dateRange() {
    const value = startDate.value
    endDate.setAttribute("min", value)

}