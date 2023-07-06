const mongoose = require('mongoose');
const { db } = require('../models/user');

mongoose.connect('mongodb://127.0.0.1:27017/archimet_db')
    .then(() => console.log('Connected to mongodb local!'))
    .catch((err)=> console.log(err))

module.exports=db