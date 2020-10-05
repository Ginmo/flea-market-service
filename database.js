const mongoose = require('mongoose');

const methods = {
    start: () => {
        return new Promise(function (resolve, reject) {
            //mongoose.connect('mongodb+srv://queue-user-1:X4zJNXDjBWkF44U@cluster0.8yekt.mongodb.net/FleaMarket', {
            mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@cluster0.8yekt.mongodb.net/${process.env.MONGO_DB}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }, (error) => {
                if (!error) {
                    console.log("Connected to MongoDB");
                    resolve();
                } else {
                    console.log("Error in MongoDB Connection...");
                    console.log(error);
                    reject(error);
                }
            });
        });
    },
    close: () => {
        mongoose.close();
    }
}


require('./db_models/users.model');

module.exports = methods;