const mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    images: {
        image1: { data: Buffer, contentType: String, required: false },
        image2: { data: Buffer, contentType: String, required: false },
        image3: { data: Buffer, contentType: String, required: false },
        image4: { data: Buffer, contentType: String, required: false }
    },
    price: { type: Number, required: true },
    date: { type: String, required: true },
    deliveryType: { type: String, required: true },
    user_id: { type: String, required: true }
});

mongoose.model('Item', itemSchema);