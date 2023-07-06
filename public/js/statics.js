var sexStaticsLabels = ["Kadın", "Erkek",];
var sexStaticsValues = [65, 25];
var paymentStaticsLabels = ["Kredi Kartı", "Peşin",];
var paymentStaticsValues = [35, 55];
var proccessTypeStaticsLabels = ["Saç Ekimi", "Dolgu", "Yıkama", "Bakım", "Botox"];
var proccessTypeStaticsValues = [55, 49, 44, 24, 15];
var RevenueStaticsLabels = ["pazt", "salı", "çarş", "per", "cum"];
var RevenueStaticsValues = [50, 60, 45, 56, 20];

var layoutSexStatics = { title: "Kadın/Erkek Oranı" };
var layoutPaymentStatics = { title: "Kredi Kartı/Peşin Oranı" };
var layoutproccessTypeStatics = { title: "İşlemler" };
var layoutRevenueStatics = {title: "Ciro Değişimi"};

var datasexStatics = [{ labels: sexStaticsLabels, values: sexStaticsValues, type: "pie" }];
var datapaymentStatics = [{ labels: paymentStaticsLabels, values: paymentStaticsValues, type: "pie" }];
var dataProccessType = [{ x: proccessTypeStaticsLabels, y: proccessTypeStaticsValues, type: "bar" }];
var dataRevenueStatics = [{
    x: RevenueStaticsLabels,
    y: RevenueStaticsValues,
    type: "bar"
}];

Plotly.newPlot("sex_statics", datasexStatics, layoutSexStatics);
Plotly.newPlot("payment_statics", datapaymentStatics, layoutPaymentStatics);
Plotly.newPlot("proccessType_statics", dataProccessType, layoutproccessTypeStatics);
Plotly.newPlot("revenue_statics", dataRevenueStatics, layoutRevenueStatics);







