const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('./database');
const User = mongoose.model('User');

// 123: $2y$12$0WKx/VjO1eCvjhkeHFhx..seS/3GI.1N17b7VyEc5900lpMA/4aou

const utils = {
    checkUserLogin: (username, password) => {
        return new Promise(function (resolve, reject) {
            User.find((error, results) => {
                if (!error) {
                    for (let i = 0; i < results.length; i++) {
                        if (username === results[i].username && bcrypt.compareSync(password, results[i].password) == true) {
                            resolve(results[i]);
                            return;
                        }
                    }
                    resolve(false);
                } else {
                    reject(error);
                }
            });
        });
    },
}

module.exports = utils;