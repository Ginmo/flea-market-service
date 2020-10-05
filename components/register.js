const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const utils = require('../utils');
const { getName } = require('country-list');
const PhoneNumber = require('awesome-phonenumber');
const mongoose = require('mongoose');
require('../database');
const User = mongoose.model('User');

router.post('/', async (req, res) => {
    var user = new User();
    try {
        user.username = req.body.username;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.email = req.body.email;
        user.phonenumber = req.body.phonenumber;
        user.address.street = req.body.address.street;
        user.address.postcode = req.body.address.postcode;
        user.address.city = req.body.address.city;
        user.address.country = req.body.address.country;
        user.password = req.body.password;
    } catch (error) {
        res.sendStatus(400);
        return;
    }

    if (getName(user.address.country) !== undefined) {
        var pn = new PhoneNumber(user.phonenumber, user.address.country);
        if (pn.isValid() === true) {
            user.save((error, doc) => {
                if (!error) {
                    res.sendStatus(200);
                } else {
                    console.log(error);
                    if (error.code === 11000) {
                        res.status(400).send("Username already in use");
                    } else {
                        res.sendStatus(400);
                    }
                }
            });
        } else {
            res.status(400).send("Check your phonenumber. It should match your country.");
        }
    } else {
        res.status(400).send('Use country code for country (Example: FI for Finland).');
    }
});

module.exports = router;