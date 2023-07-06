const mongoose = require("mongoose")

const User = require("./models/user")




mongoose.connect('mongodb://127.0.0.1:27017/archimet_db')
    .then(() => console.log('Connected!'));


// update a single user ---------------
User.findByIdAndRemove("64775b3f00e8ccd2b55e046d")
    .then((result) => { console.log(result) })
    .then((err) => { })


// update a single user ---------------

// User.findByIdAndUpdate("64775b3f00e8ccd2b55e046d",
//     { userName: "edip" })
//     .then((result) => console.log(result))

// find single user ---------------

// User.findById("64775b3f00e8ccd2b55e046d")
//     .then((result) => { console.log(result) })


// find all user ---------------

User.find({})
    .then((result) => {
        console.log(result)

    }).then((err) => {

    })

// create a collection -------------------

// User.create({
//     userName: "emre",
//     userSurname: "erol",
//     company: "dara dent",
// }).then((result) => {
//     console.log(result)
// }).then((err) => {
//     console.log(err)
// })

