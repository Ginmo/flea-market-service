const mongoose = require('mongoose');

const methods = {
    start: (mode) => {
        return new Promise(function (resolve, reject) {
            let mongoDB;
            if (mode === "test") {
                mongoDB = process.env.MONGO_DB_TEST;
            } else {
                mongoDB = process.env.MONGO_DB;
            }
            mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@cluster0.8yekt.mongodb.net/${mongoDB}`, {
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
require('./db_models/items.model');

module.exports = methods;