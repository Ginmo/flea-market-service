const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt-secret.json');

router.post('/', async (req, res) => {
    const user = req.user;
    const body = {
        username: user.username,
        id: user._id
    };

    const payload = {
        user: body
    };

    const options = {
        expiresIn: '2m'
    }

    const token = jwt.sign(payload, jwtSecret.secret, options);
    return res.json({ token });
});

module.exports = router;