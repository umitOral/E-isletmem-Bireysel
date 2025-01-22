import Company from "../models/companyModel.js";
import Employee from "../models/EmployeesModel.js";
import Subscription from "../models/subscriptionModel.js";

async function handleSubscriptionExpiration() {
    const expiredSubscriptions = await Subscription.find({ status: "active", endDate: { $lt: new Date() } });
    console.log(expiredSubscriptions)
    for (const subscription of expiredSubscriptions) {
        subscription.status = "finished";
        await subscription.save();

        const nextSubscription = await Subscription.findOne({
            company: subscription.company,
            status: "waiting",
        }).sort({ startDate: 1 });

        if (nextSubscription) {
            console.log("hmm")
            nextSubscription.status = "active";
            await nextSubscription.save();

            await Company.findByIdAndUpdate(subscription.company, { subscribeType: "purchased",activeOrNot:true,subscribeEndDate:subscription.endDate});
            let employeesToDeactivate =await Employee.find({company:subscription.company,activeOrNot:true,role:{$ne:"admin"}}).skip(nextSubscription.userCount-1).select("_id");
            await Employee.updateMany(
                { _id: { $in: employeesToDeactivate.map((emp) => emp._id) } },
                { activeOrNot: false }
            );
        } else {
            await Company.findByIdAndUpdate(subscription.company, { subscribeType: "finished",activeOrNot:false});
        }
    }
}

export {handleSubscriptionExpiration}