const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt-secret.json');

router.get('/', (req, res) => {
    const body = {
        username: req.user.username,
        id: req.user.id
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