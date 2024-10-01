import { UI } from './ui.js'
const ui=new UI()

$(".chosen-select").chosen({width: "100%"})

import { Print } from "./inner_modules/print.js";
const print = new Print();
import { Tables } from "./inner_modules/tables.js";
const tables = new Tables();

const ReportTable = document.querySelector(".table");
const pdf_btn = document.querySelector(".to_pdf");
const xlsx_btn = document.querySelector(".to_xlsx");


const table = document.querySelector("#user-report-table");
ui.tableRowSelection(table)


pdf_btn.onclick = () => {
    console.log("dadad")
    print.toPDF(table);
  };

xlsx_btn.onclick = () => {
    const xlsx_doc = print.toXLS(table);
    print.downloadFile(xlsx_doc, "xlsx", "e-isletmem.xls");
  };

  const tableElements = document.querySelectorAll("table");

tableElements.forEach((table) => {
    table.querySelectorAll("thead th i").forEach((head,columnIndex) => {
      head.addEventListener("click",()=>{
        console.log("xxx")
        tables.sortingStart(table,columnIndex+1)
        
      })
    });
  });


  // row seelcting Process

  