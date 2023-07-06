export class UI {
    constructor() {
        this.table = document.getElementById("userList")

    }
    showAllUsersToUI(users) {
        users.forEach((element, index) => {
            this.table.innerHTML += `
            <tr>
                <td><input type="checkbox" class="item_id" option_id="1"></td>
                
                <td >${element._id}</td>
                <td>${element.name + " " + element.surname}</td>
                <td>${element.debtStatus}</td>
                <td>${element.phone}</td>
                <td>
                    <p class="continue">8/10</p>
                </td>
            
                <td><a href="/admin/users/${element._id}" id="details">Detay</a></td>
                <td><a href="#" id="delete-user" style="cursor:pointer; ">Sil</td>
            </tr>
            `
        });
    }

    deleteUserFromUI(element) {
        element.remove()
    }


    addUsertoUI(newUser) {
        console.log(newUser)
        this.table.innerHTML += `
        <tr>
            <td><input type="checkbox" class="item_id" option_id="1"></td>
            
            <td>${newUser.data._id}</td>
            <td>${newUser.data.name + " " + newUser.data.surname}</td>
            <td>${newUser.data.name}</td>
            <td>${newUser.data.debtStatus}</td>
            <td>${newUser.data.phone}</td>
            
            <td>
                <p class="continue">8/10</p>
            </td>
        
            <td><a href="/admin/users/${newUser.data._id}" id="details">Detay</a></td>
            <td><a href="#" id="delete-user" style="cursor:pointer; ">Sil</td>
        </tr>
        `
    }

}

