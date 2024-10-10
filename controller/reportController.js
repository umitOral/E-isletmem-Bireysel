import { CustomError } from '../helpers/error/CustomError.js'
import User from "../models/userModel.js";
import Session from "../models/sessionModel.js";

const getUserReports = async (req, res, next) => {
  try {
    console.log(req.body)
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 5;
    let birthDate;

    let searchObject = {
      company: res.locals.company._id,
    }

    if (req.body.birthDate !== "") {

      birthDate = new Date(req.body.birthDate)
      searchObject.birthDate = { $gt: birthDate }
    }
    if (req.body.sex !== "") {
      searchObject.sex = req.body.sex
    }


    let endDate = new Date(req.body.endDate)
    endDate.setHours(24, 0, 0)



    let startDate = new Date(req.body.startDate)
    startDate.setDate(startDate.getDate() - 1)
    startDate.setHours(24, 0, 0)

    // pagination    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let reports = await User.find(searchObject).lean()

      .where('createdAt').gt(startDate).lt(endDate)
      // .populate("user", ["name", "surname"])
      // .populate("doctor", ["name", "surname"])
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 })


      let filteredReports=[]

    if (req.body.firstAppointment !== "") {
      if (req.body.firstAppointment === "true") {
        console.log("varsa")
        
        for (const [index,element] of reports.entries()) {
          console.log("arama")
          await Session.findOne({ user: element._id })
          .then(resp => {
            console.log(index)
            console.log(resp)
            if (resp === null) {
               console.log("burası")
               element.firstAppointment = false
            } else {
              console.log("burası2")
              element.firstAppointment = true
              filteredReports.push(element)
              
            }
          })
        }
        
      } else {
       
        for (const [index,element] of reports.entries()) {
          
          await Session.findOne({ user: element._id })
          .then(resp => {
            
            if (resp === null) {
              filteredReports.push(element)
               element.firstAppointment = false
            } else {
             
              element.firstAppointment = true
             
            }
          })
        }
      
      }

    }else{
      console.log("xx")
      filteredReports=reports
    }



    let total = await User.find(searchObject)
      .where('createdAt').gt(startDate).lt(endDate)

    total = total.length
    console.log(total)


    const lastpage = Math.ceil(total / limit);
    const pagination = {};
    pagination["page"] = page;
    pagination["lastpage"] = lastpage;
    pagination["limit"] = limit;

    if (startIndex > 0) {
      pagination.previous = {
        page: page - 1
      };
    }
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
      };
    }


    res.status(200).json({
      success: true,
      message: "rapor oluşturuldu",
      data: {
        reports:filteredReports,
        total,
        // count: reports.length,
        pagination,
      }
    });



  } catch (error) {
    console.log(error)
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};
const getAppointmentReports = async (req, res, next) => {
  try {
    console.log("hahooo")
    console.log(req.body)
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 5;
    

    let searchObject = {
      company: res.locals.company._id,
    }

    if (req.body.personelInput.length !== 0) {
      searchObject.doctor ={ $in:req.body.personelInput}
    }
    if (req.body.status.length !== 0) {
      searchObject.appointmentState ={ $in:req.body.status}
    }


    let endDate = new Date(req.body.endDate)
    endDate.setHours(24, 0, 0)



    let startDate = new Date(req.body.startDate)
    startDate.setDate(startDate.getDate() - 1)
    startDate.setHours(24, 0, 0)

    // pagination    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let reports = await Session.find(searchObject).lean()

      .where('createdAt').gt(startDate).lt(endDate)
      .populate("user", ["name", "surname"])
      .populate("doctor", ["name", "surname"])
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 })


    let total = await Session.find(searchObject)
      .where('createdAt').gt(startDate).lt(endDate)

    total = total.length
    console.log(total)


    const lastpage = Math.ceil(total / limit);
    const pagination = {};
    pagination["page"] = page;
    pagination["lastpage"] = lastpage;
    pagination["limit"] = limit;

    if (startIndex > 0) {
      pagination.previous = {
        page: page - 1
      };
    }
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
      };
    }


    res.status(200).json({
      success: true,
      message: "rapor oluşturuldu",
      data: {
        reports,
        total,
        // count: reports.length,
        pagination,
      }
    });



  } catch (error) {
    console.log(error)
    return next(new CustomError("sistemsel bir hata oluştu", 500, error));
  }
};


export {
  getUserReports,getAppointmentReports
}