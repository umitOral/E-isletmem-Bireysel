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

    showAllPaymensToUI(data) {
        const paymentTablesChildren = document.querySelectorAll(".payments-table tbody tr")
        const paymentTable = document.querySelector(".payments-table tbody")

        const totalIncome = document.querySelector(".total-income")
        const totalExpenses = document.querySelector(".total-expenses")
        const totalCash = document.querySelector(".total-cash")
        const totalCreditCard = document.querySelector(".total-crediTCard")
        const netCash = document.querySelector(".netCash")
        
       console.log(data)
        
        
        for (const iterator of paymentTablesChildren) {
            
            iterator.remove()
        }
        
        data.payments.forEach((payment, index) => {
            paymentTable.innerHTML += `
            <tr>
                                            
                    
                    <td>${payment.createdAt.substr(0,10)}</td>
                    <td>${payment.createdAt.substring(11,19)}</td>
                    <td>${payment.description}</td>
                    <td>${payment.value}</td> 
                    <td>${payment.cashOrCard}</td> 
                    <td><span class="material-symbols-sharp edit_payment">
                        more_vert
                    </span>
                        <div class="edit_payment_small_modal">
                    
                            <a href="./payments/${payment._id}/deletePayment">Sil</a>
                            
                            <button class="">Düzenle</button>
                            
                        </div>
                        
                        
                    
                    </td> 

                </tr>
            `
        });

        totalIncome.innerHTML=data.totalIncome
        totalCash.innerHTML=data.totalCash
        totalCreditCard.innerHTML=data.totalCreditCard
        totalExpenses.innerHTML=data.totalExpenses
        
        
        netCash.innerHTML=data.netCash

    }


    showAllSessionToUI(allTimesforAllDoctors) {
        const allDoctorEvents = document.querySelector(".events-all-doctors")
        const allDoctorAreas = document.querySelectorAll(".single-doctor-events")
        console.log(allTimesforAllDoctors)
        allTimesforAllDoctors.forEach((timesForSingleDoctor, index) => {

            timesForSingleDoctor.forEach((element,index) => {
                if (element._id) {
                    allDoctorAreas[index].innerHTML += `
                    <div class="event full">

                        <div class="center">
                            <span>06:00-06:15</span>
                            <hr>
                            <span>${element.user.name}</span>
                        </div>
                        <div class="">
                            <span class="material-symbols-sharp edit-session">
                                more_vert
                            </span>
                            <div class="session-options-modal">
                                <a href="#">Düzenle</a>
                                <a href="#">Sil</a>
                                <a href="#">Başarılı</a>
                                <a href="#">İptal</a>
                            </div>


                        </div>
                    </div>
                    `
                } else {
                    allDoctorAreas.innerHTML += `
                         
                    <div class="event">
                                                    
                        <span>${element.value}</span>
                        <span class="material-symbols-sharp add-session">
                            add
                        </span>

                    </div>
                    
                    `
                }

                // if (element._id) {
                //     eventList.innerHTML += `

                // <div class="event full">
                // <span>${element.timeValue.value}</span>

                //     <span>${element.date}</span>
                //     <span>${element.user.name}</span>
                //     <span>${element.doctor.name}</span>


                //     <span>DOLU</span>

                // </div>

                // `
                // } else {
                //     eventList.innerHTML += `

                //      <div class="event">
                //     <input type="checkbox" name="aaa" id="aaa">
                //     <span>${element.value}</span>

                //     <span>BOŞ</span>

                // </div>

                // `
                // }
            });

        });
    }

    deleteAllSessionFromUI() {
        const events = document.querySelectorAll(".event")


        events.forEach(element => {
            element.remove()
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

