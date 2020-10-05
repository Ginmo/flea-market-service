const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    phonenumber: { type: String, required: true },
    address: {
        street: { type: String, required: true },
        postcode: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true }
    },
    password: { type: String, required: true }

});

mongoose.model('User', userSchema);