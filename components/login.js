const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt-secret.json');

router.post('/', async (req, res) => {
    const user = await req.user;
    const body = {
        username: user.username,
        id: user.idUsers
    };

    const payload = {
        user: body
    };

    const options = {
        expiresIn: '30s'
    }

    const token = jwt.sign(payload, jwtSecret.secret, options);
    return res.json({ token });
});

module.exports = router;