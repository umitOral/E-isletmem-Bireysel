import cron from "node-cron";
import { sendMailWithData } from "../controller/mailControllers.js";
import Company from "../models/companyModel.js";

const dailyReports = async () => {
  try {
   
    let companies = await Company.find({});
   
    for (const key in companies) {
      if (companies[key].notifications.includes("daily_checkout_report")) {
       
        sendMailWithData(companies[key].email, "Günlük Rapor", "deneme");
      } else {
       
      }
    }
  } catch (error) {}
};

const scheduledJobs = () => {
  cron.schedule("0 18 * * *", () => {
    dailyReports();
  });
};

export { scheduledJobs };
