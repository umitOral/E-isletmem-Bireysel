export class Print {
  constructor() {}

  toPDF(table) {
    const html_code = `
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <link rel="stylesheet" href="../css/style.css">
        <link rel="stylesheet" href="../css/users.css">

    <main>
        <div class="table-wrapper">
            <div class="table">${table.outerHTML}</div>
        </div>
        
    </main>`;

    const new_window = window.open();

    new_window.document.write(html_code);

    setTimeout(() => {
      new_window.print();
      new_window.close();
    }, 200);
  }

  toXLS(table) {
    
    const table_rows = table.querySelectorAll("tbody tr");
    const table_heads = table.querySelectorAll("thead tr");

    const headings = [...table_heads];
    const rows = [...table_rows];

    const head_data = headings
      .map((head) => {
        const cells = head.querySelectorAll("th");
        let data = [...cells].map((head) => head.textContent.trim()).join("\t");
        return data;
      })
      .join("\n");

    const table_data = rows
      .map((row) => {
        const cells = row.querySelectorAll("td:not(:last-child)"),
          data = [...cells].map((cell) => cell.textContent.trim()).join("\t");
        return data;
      })
      .join("\n");

    return head_data + "\n" + table_data;
  }

  downloadFile(data, fileType, fileName) {
    const a = document.createElement("a");
    const dataType = "application/vnd.ms-excel";
    a.download = fileName;
    const tableHTML = data.replace(/ /g, "%20");
  
    a.href = `
      data:${dataType},${tableHTML}
      `;
    document.body.appendChild(a);
    a.click();
  }
  
}


