const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("List ITEMS based on category, location, startDate, endDate");
});

router.put('/:itemId', (req, res) => {
    const itemId = req.params.itemId;
    if (itemId !== undefined) {
        res.sendStatus(201);
    } else {
        res.status(400).send("Missing ID of item");
    }
});

router.delete('/:itemId', (req, res) => {
    const itemId = req.params.itemId;
    if (itemId !== undefined) {
        res.sendStatus(201);
    } else {
        res.status(400).send("Missing ID of item");
    }
});

module.exports = router;