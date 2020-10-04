const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const utils = require('../utils');
const { getName } = require('country-list');
const PhoneNumber = require('awesome-phonenumber');

router.post('/', async (req, res) => {
    const newUser = {
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        street: req.body.street,
        postcode: req.body.postcode,
        city: req.body.city,
        country: req.body.country,
        password: bcrypt.hashSync(req.body.password, 6)
    }

    if (utils.checkIfUserObjectIsCorrect(newUser) === true) {
        try {
            if (await utils.checkIfUsernameIsAvailabe(newUser.username) === true) {
                if (getName(newUser.country) !== undefined) {
                    var pn = new PhoneNumber(newUser.phonenumber, newUser.country);
                    if (pn.isValid() === true) {
                        res.sendStatus(200);
                    } else {
                        res.status(400).send("Check your phonenumber. It should match your country.");
                    }
                } else {
                    res.status(400).send('Use country code for country (Example: FI for Finland).');
                }

            } else {
                res.status(400).send("Username already in use");
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    } else {
        res.status(400).send("Missing information");
    }
});

module.exports = router;