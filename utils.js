const bcrypt = require('bcryptjs');
const db = require('./database');

// 123: $2y$12$0WKx/VjO1eCvjhkeHFhx..seS/3GI.1N17b7VyEc5900lpMA/4aou
const users = [
    {
        id: 1,
        username: "testuser",
        password: "$2y$12$0WKx/VjO1eCvjhkeHFhx..seS/3GI.1N17b7VyEc5900lpMA/4aou"
    }
]

const utils = {
    checkUserLogin: (username, password) => {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM users').then(results => {
                for (let i = 0; i < results.length; i++) {
                    console.log(results[i].username);
                    if (username === results[i].username && bcrypt.compareSync(password, results[i].password) == true) {
                        resolve(results[i]);
                        return;
                    }
                }
                resolve(false);
            }).catch(error => {
                console.log(error);
                reject(error);
            });
        });


        /*
        if (username === users[0].username) {
            if (bcrypt.compareSync(password, users[0].password) == true) {
                return users[0];
            } else {
                return false;
            }
        } else {
            return false;
        }
        */
    }

}

module.exports = utils;