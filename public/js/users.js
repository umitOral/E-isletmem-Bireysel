


// ------------table sorting processs
const table_rows = document.querySelectorAll("table tbody tr")
const table_heads = document.querySelectorAll("main .user-table table thead th:not(:first-child) ")
const userList = document.getElementById("userList")
const addUserButton = document.getElementById("add-user")
const nameInput = document.getElementById("user-name")
const surnNameInput = document.getElementById("surname")
const birtdhDateInput = document.getElementById("birtdhDate")
const addressInput = document.getElementById("address")
const phoneInput = document.getElementById("phone")
const emailInput = document.getElementById("email")
const billingAddressInput = document.getElementById("billingAddress")
const notesInput = document.getElementById("notes")
const deneme = document.getElementById("deneme")




import { Request } from "./requests.js";
import { UI } from "./ui.js";

const ui = new UI();
const request = new Request("/api/getAllUsers")


eventListeners()

function eventListeners() {
    document.addEventListener("DOMContentLoaded", getAllUsers)
    userList.addEventListener("click", updateorDelete)
    addUserButton.addEventListener("click", addUser)


}


function addUser(e) {
 


    
    
}

function getAllUsers() {
    request.get()
        .then(response => ui.showAllUsersToUI(response))
        .catch(err => console.log(err))

       
}



function updateorDelete(e) {

    if (e.target.id === "details") {
        // showDetails()
    } else if (e.target.id === "delete-user") {
        deleteUser(e.target)
    }
}
function deleteUser(selectedUser) {
    const id = selectedUser.parentElement.parentElement.children[1].textContent.trim()
    console.log(id)

    let text = selectedUser.parentElement.parentElement.children[2].textContent.trim()+" adlı kullanıcı silinecek emin misiniz!\ Tamam veya İptal.";
    if (confirm(text) == true) {
        request.delete(id)
            .then(response => {
                ui.deleteUserFromUI(selectedUser.parentElement.parentElement)
            })
            .catch(err => console.log(err))
    } else {
        alert( "You canceled!");
    }
}



table_heads.forEach((head, i) => {
    let sort_ars = true;

    head.onclick = () => {
        table_heads.forEach(head => {
            head.classList.remove("active")
        })
        head.classList.add("active")


        document.querySelectorAll("td").forEach(td => { td.classList.remove("active") })
        table_rows.forEach(row => {
            row.querySelectorAll("td")[i + 1].classList.add("active");
        })

        head.classList.toggle("ars", sort_ars)
        sort_ars = head.classList.contains("ars") ? false : true;

        sortTable(i, sort_ars)
    }

});
function sortTable(column, sort_ars) {
    [...table_rows].sort((a, b) => {
        let first_row = a.querySelectorAll("td")[column].textContent.toLowerCase(),
            second_row = b.querySelectorAll("td")[column].textContent.toLowerCase()
        return sort_ars ? (first_row < second_row ? 1 : -1) : (first_row < second_row ? -1 : 1);

    })
        .map(sorted_row => document.querySelector("tbody").appendChild(sorted_row))

}

// -------------table checking process
const checkBoxes = document.querySelectorAll("input[type='checkbox']")

function selectAll(myCheckBox) {

    if (myCheckBox.checked == true) {
        checkBoxes.forEach(element => {
            element.checked = true
        })
    } else {
        checkBoxes.forEach(element => {
            element.checked = false
        });

    }

}


// ----print procceess ----

const pdf_btn = document.querySelector(".to_pdf")
const json_btn = document.querySelector(".to_json")
const xlsx_btn = document.querySelector(".to_xlsx")
const costumer_table = document.querySelector(".user-table-main")




// export an pdf ------------
pdf_btn.onclick = () => {
    toPDF(costumer_table)
}
function toPDF(costumer_table) {
    const html_code = `
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/users.css">

    <main>
        <div class="user-table">${costumer_table.innerHTML}</div>
    </main>`

    const new_window = window.open()

    new_window.document.write(html_code)
    setTimeout(() => {
        new_window.print()
    }, 200);
}

// export an json ------------

function toJSON(table) {
    let table_data = [],
        table_head = [],
        table_headings = table.querySelectorAll("th:not(first-child,:nth-child(1))"),
        table_rows = table.querySelectorAll("tbody tr")


    for (let table_heading of table_headings) {
        let actual_head = table_heading.textContent.trim()
        actual_head = actual_head.slice(0, actual_head.length - 5)
        table_head.push(actual_head)
    }


    table_rows.forEach(row => {
        const row_object = {},
            t_cells = row.querySelectorAll("td:not(:first-child,:last-child)")


        t_cells.forEach((cell, cell_index) => {
            row_object[table_head[cell_index]] = cell.textContent.trim()
        });

        table_data.push(row_object)

    })
    return JSON.stringify(table_data, null, 4)

}

// export an xlsx ------------
function toXLSX(table) {
    const headings = [...table_heads]
    const rows = [...table_rows]

    const heads = headings.map(head => {
        let actual_head = head.textContent.trim()
        actual_head = actual_head.substring(0, actual_head.length - 5)
        return actual_head
    }).join("\t")

    const table_data = rows.map(row => {
        const cells = row.querySelectorAll("td:not(:last-child,:nth-child(1))"),
            data = [...cells].map(cell => cell.textContent.trim()).join("\t");

        return data
    }).join("\n")
    return heads + "\n" + table_data;

}

xlsx_btn.onclick = () => {
    const xlsx_doc = toXLSX(costumer_table)

    downloadFile(xlsx_doc, "xlsx", "order.xlsx")
}



json_btn.onclick = () => {
    const json_doc = toJSON(costumer_table);
    downloadFile(json_doc, "json", "Customer Orders")
}

function downloadFile(data, fileType, fileName) {
    const a = document.createElement('a');
    a.download = fileName;
    const mimeType = {
        "json": "application/json",
        "csv": "text/csv",
        "xlsx": "application/vnd.ms-excel"
    }
    a.href = `
    data:${mimeType[fileType]};charset=utf-8,${(data)}
    `;
    document.body.appendChild(a);
    a.click();
    a.remove()

}


// add costumer modal

const addCustomerButton = document.querySelector(".add_customer_btn")
const modalCustomerAdd = document.querySelector(".add_customer")
const modalCustomerCancel = document.querySelector(".cancel_button")

addCustomerButton.addEventListener("click", showModalAddCostumer)
modalCustomerCancel.addEventListener("click", closeModalAddCostumer)

function showModalAddCostumer() {
    modalCustomerAdd.classList.add("showed_modal")
}
function closeModalAddCostumer() {
    modalCustomerAdd.classList.remove("showed_modal")
}


