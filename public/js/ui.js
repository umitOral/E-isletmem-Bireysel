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
    selectedDatetoUI (selectedDate) {
        
        const eventDate = document.querySelector(".event-date")
        eventDate.innerHTML=selectedDate
    }

    showAllPaymensToUI(data) {
        const paymentTablesChildren = document.querySelectorAll("table tbody tr")
        const paymentTable = document.querySelector("table tbody")

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
                                            
                    
                    <td>${payment.createdAt.substr(0, 10)}</td>
                    <td>${payment.createdAt.substring(11, 19)}</td>
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

        totalIncome.innerHTML = data.totalIncome
        totalCash.innerHTML = data.totalCash
        totalCreditCard.innerHTML = data.totalCreditCard
        totalExpenses.innerHTML = data.totalExpenses


        netCash.innerHTML = data.netCash

    }


    showAllSessionToUI(allTimesforAllDoctors,AllDoctor) {
        
        const allDoctorEvents = document.querySelector(".events-all-doctors")

        while (allDoctorEvents.firstChild) {
            allDoctorEvents.firstChild.remove()
        }

        

        allTimesforAllDoctors.forEach((timesForSingleDoctor, index) => {

            const singleDoctorArea = document.createElement("div")
            singleDoctorArea.className = "single-doctor-area"
            singleDoctorArea.setAttribute("data-doctorid",AllDoctor[index]._id)

            singleDoctorArea.innerHTML += `
            <div class="doctor-name" value="">
                ${AllDoctor[index].name}
            </div>
            `
            // singleDoctorArea.dataset=AllDoctor[index]._id
            const singleDoctorEvents = document.createElement("div")
            singleDoctorEvents.className = "single-doctor-events"

            allDoctorEvents.appendChild(singleDoctorArea)

            timesForSingleDoctor.forEach((element, index) => {
                if (element._id) {
                    singleDoctorEvents.innerHTML += `
                    <div class="event full" data-session="${element._id}" data-timevalue="${element.timeValue}" data-timeindex="${element.timeIndex}">

                        <div class="center">
                            <span>${("0"+new Date(element.timeValue).getHours()).substr(-2)+":"+new Date(element.timeValue).getMinutes()}</span>
                            
                            
                            <span>${element.user.name}</span>
                            <span class="buttons">${element.state}</span>

                        </div>
                        <div class="" >
                            <span class="material-symbols-sharp edit-session">
                                more_vert
                            </span>
                            <div class="session-options-modal">
                                <span class="edit-session-btn">Düzenle</span>
                                <span class="delete-session">Sil</span>
                                <span class="change-state">Bitti</span>
                                <span class="change-state">Seansta</span>
                                <span class="change-state">Hasta Gelmedi</span>
                                <span class="change-state">Personel Gelmedi</span>
                                
                            </div>


                        </div>
                    </div>
                    `
                    singleDoctorArea.appendChild(singleDoctorEvents)
                } else {
                    singleDoctorEvents.innerHTML += `
                         
                    <div class="event" data-time="${index}" data-hour="${element.value}">
                                             
                        <span>${("0"+element.value.getHours()).substr(-2)+":"+("0"+element.value.getMinutes()).substr(-2)} </span>
                        <span class="material-symbols-sharp add-session">
                            add
                        </span>

                    </div>
                    
                    `
                    singleDoctorArea.appendChild(singleDoctorEvents)
                }


            });

        });
    }

    deleteAllSessionFromUI() {
        const events = document.querySelectorAll(".event")


        events.forEach(element => {
            element.remove()
        });

    }
    deletePaymentFromUI(payment) {
        payment.remove()

    }

    deleteUserFromUI(element) {
        element.remove()
    }
    createEditModal() {



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

    createChart(response) {
        
        const sexStaticsLabels = ["Kadın", "Erkek"];
        const sexStaticsValues = response.sexStatics;
    
        console.log(response)

        if (response.sexStatics[0]==0 &&response.sexStatics[0]==0) {
            document.querySelector(".filter-info").innerHTML=`Bu tarih aralığında yeni kullanıcı kaydı bulunamadı `
        } else {
            document.querySelector(".filter-info").innerHTML=``

            new Chart("sex_statics", {
                type: "pie",
                data: {
                    labels: sexStaticsLabels,
                    datasets: [{
    
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)'
                        ],
                        data: sexStaticsValues
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: "Kadın-Erkek Oranı"
                    }
                }
            });
        }
        
    }

}

