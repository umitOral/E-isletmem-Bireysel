export class EmployeeDetailsUI{

    responseToUI(data,APPOINTMENT_STATUS) {
    let sessionsTableBody =document.querySelector(".table.appointments-table tbody")
    sessionsTableBody.innerHTML=""

    data.forEach((session) => {
        sessionsTableBody.innerHTML += `
        <tr data-appointmentid="${session._id}">
    
        <td>
            ${new Date(session.date).toLocaleDateString("tr-TR")}
        </td>

        <td>
            ${new Date(session.startHour).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
                -
                ${new Date(session.endHour).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                    
        </td>

        <td>
            ${session.user.name+" "+session.user.surname}
        </td>
        <td>
          ${session.operations.map(
            (item, i) => `
                ${item.operation.operationName}
          `
          )}
        </td>

        
        <td>
             ${session.description}
        </td>


        <td>
          <select name="" class="updateStateAppointment">
          <option value="" disable >${
            session.appointmentState
          }</option>
          
            
          </select>
            
        </td>
        
    </tr>
        `;
      });
    
   }

}