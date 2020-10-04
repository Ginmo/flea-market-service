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
    },
    checkIfUsernameIsAvailabe: (username) => {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM users').then(results => {
                for (let i = 0; i < results.length; i++) {
                    if (username === results[i].username) {
                        resolve(false);
                        return;
                    }
                }
                resolve(true);
            }).catch(error => {
                console.log(error);
                reject(error);
            });
        });
    },
    checkIfUserObjectIsCorrect: (newUser) => {
        for (const property in newUser) {
            if (newUser[property] == undefined) {
                return false;
            }
        }
        return true;
    }

}

module.exports = utils;