const mongoose = require('mongoose')

const userSchema=mongoose.Schema({
    name: String,
    lastname: String,
    email: {
        type : String,
        unique: true
    } 
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel