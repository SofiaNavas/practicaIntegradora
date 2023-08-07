const mongoose = require('mongoose')

const userSchema=mongoose.Schema({
    title: String,
    description: String,
    code: {
        type : String,
        unique: true
    },
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnail: Array
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel