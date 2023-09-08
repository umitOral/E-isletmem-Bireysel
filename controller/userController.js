import User from '../models/userModel.js';
import Company from '../models/companyModel.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const createCompany = async (req, res) => {
    try {
        const data = req.body
        //  form datasına ekleme çıkarma yapılabilir.

        const company = await Company.create(data)


        res.redirect("login")

    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller error"
        })
    }
}
const deactiveUser = async (req, res) => {
    try {
        console.log("başarılı")

        await User.findByIdAndUpdate(req.params.id, { activeOrNot: false })




        res.redirect("../../personels")

    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller delete error"
        })
    }
}
const findUser = async (req, res) => {
    try {

        //search
        let query=User.find()
        if (req.query) {
            const searchObject = {}
            const regex = new RegExp(req.query.user, "i")
            searchObject["name"] = regex
            searchObject["company"] = res.locals.user._id
            searchObject["role"] = "customer"
            
            
            // searchObject["title"] = regex
            query=query.where(searchObject)
        }

        //pagination
        // 1 2 3 4 5..6 7 8

        const page=parseInt(req.query.page )|| 1
        const limit=3
        
        const startIndex=(page-1)*limit
        const endIndex=page*limit
        
        const total= await User.count().where('role').equals('customer').where("company").equals(res.locals.user._id)
        const lastpage=Math.round(total/limit)
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
        
        const users = await query
        
        
        
        res.status(200).render("search-results", {
            users,
            total,
            count:users.length,
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


const createUser = async (req, res) => {
    try {
        const data = req.body
        data.company = res.locals.user._id


        const user = await User.create(data)

        res.redirect("./users")
        console.log(user)
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "usercontroller error"
        })
    }
}
const editInformations = async (req, res) => {
    try {
        console.log(req.body)
        await User.findByIdAndUpdate(req.params.id,
            {
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                address: req.body.address,
                sex: req.body.sex,
                birtdhDate: req.body.birtdhDate,
                phone: req.body.phone,
                company: req.body.company,
                billingAddress: req.body.billingAddress,
                notes: req.body.notes,

            })
        res.redirect("back")
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: error
        })
    }
}


const loginUser = async (req, res) => {
    try {
        let same = false
        const company = await Company.findOne({ email: req.body.email })



        if (company) {
            same = await bcrypt.compare(req.body.password, company.password)
        } else {
            return res.status(401).json({
                message: "kullanıcı bulunamadı"
            })
        }

        if (same) {
            const token = createToken(company._id)
            res.cookie("jsonwebtoken", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24
            })

            res.redirect("admin")
        } else {
            res.status(401).json({
                success: false,
                message: "şifreler uyuşmuyor"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        })
    }
}

const uploadPictures = async (req, res) => {

    try {

        const cloudinaryImageUploadMethod = async (file) => {

            const result = await cloudinary.uploader.upload(
                file,
                {
                    use_filename: true,
                    folder: "archimet"
                })

            return result.secure_url
        }


        const files = req.files.upload_file;


        for (const file of files) {

            const path = file.tempFilePath;
            const newPath = await cloudinaryImageUploadMethod(path);

            await User.updateOne({ _id: req.params.id },
                {
                    $push: {
                        "images": { url: newPath, uploadTime: req.body.uploadTime }

                    }
                })
        }


        fs.unlinkSync(req.files.upload_file.tempFilePath)
        res.redirect("back")

    } catch (error) {
        res.status(500).json({
            succes: "ekleme hatası",
            message: error
        })
    }
}

const logOut = (req, res) => {
    try {
        res.cookie("jsonwebtoken", "", {
            maxAge: 1
        })
        res.redirect("/")
    } catch (error) {
        res.status(500).json({
            succes: false,
            messgae: error
        })
    }
}

const createToken = (userID) => {
    return jwt.sign({ userID }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });


}

export { createCompany, createUser, loginUser, logOut, uploadPictures, editInformations, findUser, deactiveUser }