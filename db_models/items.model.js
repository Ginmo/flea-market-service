const mongoose = require('mongoose');

let itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    images: {
        image1: { type: String, required: false },
        image2: { type: String, required: false },
        image3: { type: String, required: false },
        image4: { type: String, required: false }
    },
    price: { type: Number, required: true },
    date: { type: String, required: true },
    deliveryType: { type: String, required: true },
    user_id: { type: String, required: true }

});

mongoose.model('Item', itemSchema);