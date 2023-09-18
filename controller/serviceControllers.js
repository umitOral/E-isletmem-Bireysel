import Service from '../models/serviceModel.js';


const addService = async (req, res) => {
    try {

        
        req.body.company=res.locals.user._id
        const services = await Service.create(req.body)
        res.redirect("back")

    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller error"
        })
    }
}
const deactivateService = async (req, res) => {
    try {

        
        
        const services = await Service.findByIdAndUpdate(req.params.id,{
            activeorNot:false
        })
        res.redirect("back")

    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller error"
        })
    }
}
const activateService = async (req, res) => {
    try {

        
        const services = await Service.findByIdAndUpdate(req.params.id,{
            activeorNot:true
        })
        res.redirect("back")

    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller error"
        })
    }
}
const findServices = async (req, res) => {
    try {

        //search
        let query=Service.find()
        if (req.query) {
            const searchObject = {}
            const regex = new RegExp(req.query.user, "i")
            searchObject["serviceName"] = regex
            searchObject["company"] = res.locals.user._id
            // searchObject["title"] = regex
            query=query.where(searchObject)
        }

        //pagination
        // 1 2 3 4 5..6 7 8

        const page=parseInt(req.query.page )|| 1
        const limit=3
        
        const startIndex=(page-1)*limit
        const endIndex=page*limit
        
        const total= await Service.count().where("company").equals(res.locals.user._id)
        const lastpage=Math.ceil(total/limit)
        const pagination={}
        pagination["page"]=page
        pagination["lastpage"]=lastpage
        

        if (startIndex>0) {
            pagination.previous={
                page:page-1,
                limit:limit
            }
        }
        if (endIndex<total) {
            pagination.next={
                page:page+1,
                limit:limit
            }
        }
        
        query=query.skip(startIndex).limit(limit)
        
        const data = await query
        
        console.log(data)
        
        res.status(200).render("search-results-services", {
            header:"Hizmetler",
            data,
            total,
            count:data.length,
            pagination:pagination,
            link: "users"
        })


    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller error"
        })
    }
}
const getSingleServicePage = async (req, res) => {
    try {
        
        const service = await Service.findById(req.params.id)
        console.log(service)

        res.status(200).render("service-details", {
            service,
            link:"service-details"
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller error"
        })
    }
}
const editService = async (req, res) => {
    try {
        let activeorNot = Boolean
        if (req.body.activeorNot === "0") {
            activeorNot = true
        } else {
            activeorNot = false
        }
        await Service.findByIdAndUpdate(req.params.id, {
            serviceName: req.body.serviceName,
            servicePrice: req.body.servicePrice,
            activeorNot: activeorNot
        })

        res.redirect("../")

    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller error"
        })
    }
}


export { addService, getSingleServicePage, editService,findServices,deactivateService,activateService}