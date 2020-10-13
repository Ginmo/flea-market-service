const express = require('express');
const router = express.Router();
const moment = require('moment');
const utils = require('../utils');

router.get('/', async (req, res) => {
    const category = req.query.category;
    const location = req.query.location;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;


    if (startDate !== undefined) {
        if (moment(startDate, 'YYYY-MM-DD', true).isValid() !== true) {
            res.status(400).send({ message: "Use format YYYY-MM-DD in search." });
            return;
        }
    }
    if (endDate !== undefined) {
        if (moment(endDate, 'YYYY-MM-DD', true).isValid() !== true) {
            res.status(400).send({ message: "Use format YYYY-MM-DD in search." });
            return;
        }
    }

    try {
        result = await utils.findItems(category, location, startDate, endDate);
        if (result.length < 1) {
            res.status(404).send({ message: "No matches with given parameters." });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
});

module.exports = router;