const express = require('express')
const path = require('path');
const User = require('./models/user');
const db = require("./database/db")
const bodyParser = require('body-parser');


//middlewares
const { accesControl } = require('./middlewares')

const app = express()

const PORT = 3000

// app.use(bodyParser.urlencoded({ extended: true }))

//template engine
app.set("view engine", "ejs")

//body parser çok önemli
app.use(express.json());


//static files css,js

app.use(express.static("public"))




//routes,middlewares



app.get('/', function (req, res) {

    res.render("front-side/main");

});
app.get('/login', function (req, res) {
    res.render("front-side/login")

});
app.post('/login', function (req, res) {
    User.findOne({ "email": req.body.email })
        .then(result => {


            if (result.email === req.body.email && result.password === req.body.password) {
                console.log("başarılı")
                res.render("admin/index", { result: result });
            } else (
                res.write("yanlış değerler")
            )
        })
        .catch(err => console.log(err))

});

app.get('/admin', accesControl, function (req, res) {
    console.log(req.url)
    res.render("admin/index");

});

app.get('/admin/users', function (req, res) {

   res.render("admin/users")


});

//APIS  /////////////////////////////////////////////////////
app.get('/api/users', function (req, res) {

    User.find({})
        .then((result) => {

            users = result
            res.json(users)

            console.log(users)

        }).then((err) => {

        })

});

app.post('/api/users', function (req, res) {
    console.log(req.url)
    console.log(req.body)

    User.create({
        
        name: req.body.name,
        surname: req.body.surname,
        company: req.body.company,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,

    }).then((result) => {
        res.json({
            succes: true,
            message: "ekleme başarılı",
            data: result
        })

    }).catch((err) => {
    })

});

app.put('/api/users/:id', function (req, res) {
    console.log(req.url)
    console.log(req.params.id)
    User.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }).then(response => res.json({
        success: true,
        message: "put request",
        data: response
    })).catch(err => console.log(err))


});



app.delete('/api/users/:id', function (req, res) {
    User.findByIdAndDelete( req.params.id )
        .then((response) => {


        res.json({
            success:true,
            message:"user deleted",
            data:response
        })


        }).catch((err) => {

        })


});

app.get('/admin/users/:_id', function (req, res) {
    
    User.findById(req.params._id)
        .then((result) => {

            user = result
            res.render("admin/user-details",user);
            
            

        }).catch((err) => {
            console.log(err)
        })



});


app.get('/register', function (req, res) {
    res.render("front-side/register");

});

app.post('/register', function (req, res) {

    User.create({
        name: req.body.name,
        surname: req.body.surname,
        company: req.body.company,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,

    }).then((result) => {

        console.log(result)
        user = result
        res.render("front-side/succesRegister");

    }).then((err) => {

    })
});
app.post('/admin/user/add', function (req, res) {

    User.create({
        name: req.params.name,
        surname: req.params.surname,
        company: req.params.company,
        email: req.params.email,
        phone: req.params.phone,


    }).then((result) => {
        console.log(req.params)
        console.log(result)
        users = result


    }).then((err) => {

    })
});




// app.post("/users", (req, res, next) => {
//     console.log(req.url)
//     console.log(req.body)
//     user.push(req.body)

//     res.json({
//         success: true,
//         message: "post request",
//         data: user
//     })

// })


//database proccess








////////////////////////////////////////////
app.listen(process.env.PORT || 3000, () => {
    console.log("Server başlatıldı: http://localhost:" + PORT)
})