import cron from "node-cron";
import { sendDailyCheckoutReportMail, sendUserAppointmentLastDayMail } from "../controller/mailControllers.js";
import Company from "../models/companyModel.js";
import Appointment from "../models/appointmentModel.js";
import User from "../models/userModel.js";
import Employee from "../models/EmployeesModel.js";
import { handleSubscriptionExpiration } from "../helpers/subscriptionHelpers.js";

const dailyReportsforUser = async () => {
  try {
    let startDate = new Date();
    let endDate = new Date(startDate)
    endDate.setDate(startDate.getDate()+1);
    
   
    let appointments = await Appointment.find({ date: { $gt: startDate,$lt:endDate} })
    .populate("user",["phone","email"])
    .populate("company",["brandName","phone"])
    // console.log(appointments)

    for (const element of appointments) {
      let user=await User.findById(element.user._id)
     
     
      if (user.notifications.includes("user_appointment_last_day_mail")) {
        let data={
          date:element.date.toLocaleDateString("TR-tr"),
          date:element.date,
          startHour:element.startHour,
          brandName:element.company.brandName,
          companyPhone:element.company.phone
        }
        sendUserAppointmentLastDayMail(element.user.email,data);
      }
    }
    
  } catch (error) {
    console.log(error)
  }
};


const dailyReportsforEmployee = async () => {
  try {
    let employee = await Employee.find({}).populate("company","_id");

    for (const key in employee) {
      if (employee[key].notifications.includes("daily_checkout_report")) {
        sendDailyCheckoutReportMail(employee[key]?.email,employee[key].company);
      } else {
      }
    }
  } catch (error) {}
};
const dailySubscriptionCheck = async () => {
  try {
    
    await handleSubscriptionExpiration()
  } catch (error) {}
};

const scheduledJobs = () => {
  cron.schedule("0 18 * * *", () => {
    dailyReportsforEmployee();
  });
  cron.schedule("0 9 * * *", () => {
    
    dailyReportsforUser()
  });
  cron.schedule("* * * * *", () => {
    dailySubscriptionCheck()
  });
};

export { scheduledJobs };
