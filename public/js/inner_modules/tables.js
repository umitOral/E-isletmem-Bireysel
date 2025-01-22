export class Tables {
  constructor() {}

  sortingStart(table, columnIndex) {
    
    
    
    const sortIcons = document.querySelectorAll(".list_icon");
    const tableHeads = table.querySelectorAll("thead th");
    const tableRows = table.querySelectorAll("tbody>tr");
   

    tableHeads.forEach((element) => {
      element.classList.remove("active");
    });

    tableHeads[columnIndex].classList.add("active");
    
    
    if (tableHeads[columnIndex].classList.contains("asc")) {
      
      tableHeads[columnIndex].classList.remove("asc");
    } else {
      
      tableHeads[columnIndex].classList.add("asc");
    }

    table.querySelectorAll("td").forEach((element) => {
      element.classList.remove("active");
    });
    
    tableRows.forEach((row) => {
      row.querySelectorAll("td")[columnIndex].classList.add("active");
    });
    
    let sort_arc = tableHeads[columnIndex].classList.contains("asc")
      ? true
      : false;
    
    this.sortTable(tableRows, columnIndex, sort_arc,table);
  }

  sortTable(tableRows, columnIndex, sort_arc,table) {
    
    [...tableRows]
      .sort((a, b) => {
        let first_row = a
            .querySelectorAll("td")
            [columnIndex].textContent.toLowerCase(),
          second_row = b
            .querySelectorAll("td")
            [columnIndex].textContent.toLowerCase();

        return sort_arc
          ? first_row < second_row
            ? -1
            : 1
          : first_row < second_row
          ? 1
          : -1;
      })
      .map((sorted_row) =>
        table.querySelector("tbody").appendChild(sorted_row)
      );
  }
}
