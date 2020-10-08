const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../database');
const Item = mongoose.model('Item');
const multer = require('multer');
const multerUpload = multer({ dest: 'images/' });
const fs = require('fs');

var upload = multerUpload.array('Images', 4)

router.post('/', (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.status(400).send("Check image key and limit (4)");
            return;
        } else if (err) {
            res.send(400).send("Unknown reason");
        }
        for (let i = 0; i < req.files.length; i++) {
            if (req.files[i].mimetype != "image/png" && req.files[i].mimetype != "image/jpeg") {
                res.status(400).send("Not supported format. Use png/jpeg for images.");
                return;
            }
        }
        var item = new Item();
        req.files.forEach((f, index) => {
            let imageType = "";
            console.log(f.originalname.substring(f.originalname.length - 3, f.originalname.length));
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
                res.sendStatus(400);
            }
        });


    });

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