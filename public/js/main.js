
console.log("mainJS success")

import { Print } from "./inner_modules/print.js";
const print = new Print();
import { Tables } from "./inner_modules/tables.js";
const tables = new Tables();

//tables sorting
const tableElements = document.querySelectorAll("table");

tableElements.forEach((table) => {
  table.querySelectorAll("thead th").forEach((head,columnIndex) => {
    head.addEventListener("click",()=>{
      
      tables.sortingStart(table,columnIndex)
      
    })
  });
});


// ----print procceess ----

const pdf_btn = document.querySelector(".to_pdf");
const xlsx_btn = document.querySelector(".to_xlsx");

const table = document.querySelector("table");


pdf_btn.onclick = () => {
    console.log("dadad")
    print.toPDF(table);
  };

xlsx_btn.onclick = () => {
    const xlsx_doc = print.toXLS(table);
    print.downloadFile(xlsx_doc, "xlsx", "e-isletmem.xls");
  };