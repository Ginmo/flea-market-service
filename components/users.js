const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../database');
const User = mongoose.model('User');


router.get('/:userId', (req, res) => {
    const userId = req.params.userId;
    if (userId !== undefined) {
        User.findById(userId)
            .select("username")
            .select("firstname")
            .select("lastname")
            .select("email")
            .select("phonenumber")
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "User not found." });
                } else {
                    res.send(data);
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Error while trying to find user." });
            });
    } else {
        res.status(400).send({ message: "Missing ID of user" });
    }

});

module.exports = router;