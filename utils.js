const bcrypt = require('bcryptjs');

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
        if (username === users[0].username) {
            if (bcrypt.compareSync(password, users[0].password) == true) {
                return users[0];
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

}

module.exports = utils;