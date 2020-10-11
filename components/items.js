const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../database');
const Item = mongoose.model('Item');
const fs = require('fs');
const categories = require('../categories.json');

// multer
const multer = require('multer');
const multerUpload = multer({ dest: 'images/' });
const upload = multerUpload.array('Images', 4)


router.get('/', (req, res) => {
    const id = req.user.id
    Item.find({ "user_id": id })
        .then(data => {
            if (data.length < 1) {
                res.send("You do not have any items listed.");
            } else {
                res.send(data);
            }

        })
        .catch(err => {
            res.status(500).send({ message: "Error while trying to get your items." });
        });
});

router.post('/', (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.status(400).send({ message: "Check image key and limit (4)" });
            return;
        } else if (err) {
            res.send(400).send({ message: "Unknown reason" });
        }
        for (let i = 0; i < req.files.length; i++) {
            if (req.files[i].mimetype != "image/png" && req.files[i].mimetype != "image/jpeg") {
                res.status(400).send({ message: "Not supported format. Use png/jpeg for images." });
                return;
            }
        }
        if (categories.indexOf(req.body.category) === -1) {
            res.status(400).send({ message: "Incorrect category." });
            return;
        }

        var item = new Item();
        req.files.forEach((f, index) => {
            let imageType = "";
            if (f.originalname.substring(f.originalname.length - 3, f.originalname.length) === "PNG") {
                imageType = "PNG"
            }
            else if (f.originalname.substring(f.originalname.length - 3, f.originalname.length) === "JPG") {
                imageType = "JPG"
            }
            fs.renameSync(f.path, './images/' + f.filename + "." + imageType);

            if (index === 0) {
                item.images.image1 = f.filename + "." + imageType
            }
            else if (index === 1) {
                item.images.image2 = f.filename + "." + imageType
            }
            else if (index === 2) {
                item.images.image3 = f.filename + "." + imageType
            }
            else if (index === 3) {
                item.images.image4 = f.filename + "." + imageType
            }
        });
        const id = req.user.id
        const date = new Date().toLocaleString("fi-FI", { timeZone: "Europe/Helsinki" })

        item.title = req.body.title;
        item.description = req.body.description;
        item.category = req.body.category;
        item.location = req.body.location;

        item.price = req.body.price;
        item.date = date;
        item.deliveryType = req.body.deliveryType;
        item.user_id = id;

        item.save((error, doc) => {
            if (!error) {
                res.sendStatus(201);
            } else {
                res.status(500).send({ message: "Error while trying to add item." });
            }
        });


    });

});

router.put('/:itemId', (req, res) => {
    const itemId = req.params.itemId;
    if (itemId !== undefined) {
        res.sendStatus(201);
    } else {
        res.status(400).send({ message: "Missing ID of item" });
    }
});

router.delete('/:itemId', (req, res) => {
    const itemId = req.params.itemId;
    if (itemId !== undefined) {
        Item.findByIdAndRemove(itemId, { useFindAndModify: false })
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Item not found." });
                } else {
                    res.send({ message: "Item deleted." });
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Error while trying to delete item." });
            });
    } else {
        res.status(400).send({ message: "Missing ID of item" });
    }
});

module.exports = router;