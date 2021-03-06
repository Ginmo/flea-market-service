const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../database');
const Item = mongoose.model('Item');
const fs = require('fs');
const categories = require('../categories.json');
const deliveryTypes = require('../delivery-types.json');
const utils = require('../utils');

// multer
const multer = require('multer');
const multerUpload = multer({ dest: 'images/' });
const upload = multerUpload.array('Images', 4)


router.get('/', (req, res) => {
    const id = req.user.id
    Item.find({ "user_id": id })
        .then(data => {
            if (data.length < 1) {
                res.send({ message: "You do not have any items listed." });
            } else {
                res.send(data);
            }

        })
        .catch(error => {
            res.status(500).send({ message: error.message });
        });
});

router.post('/', (req, res) => {
    upload(req, res, function (err) {
        let item = new Item();
        const id = req.user.id
        const date = utils.getDate();

        item.title = req.body.title;
        item.description = req.body.description;
        item.category = req.body.category;
        item.location = req.body.location;

        item.price = req.body.price;
        item.date = date;
        item.deliveryType = req.body.deliveryType;
        item.user_id = id;


        if (req.files !== undefined) {
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
            if (deliveryTypes.indexOf(req.body.deliveryType) === -1) {
                res.status(400).send({ message: "Incorrect delivery type." });
                return;
            }

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
        }

        item.save((error, doc) => {
            if (!error) {
                res.sendStatus(201);
            } else {
                res.status(500).send({ message: error.message });
            }
        });


    });

});

router.put('/info/:itemId', (req, res) => {
    const itemId = req.params.itemId;
    const userId = req.user.id;

    if (itemId !== undefined) {
        if (req.body.date !== undefined) {
            res.status(400).send({ message: "Cannot update date." });
            return;
        }
        if (req.body.category !== undefined) {
            if (categories.indexOf(req.body.category) === -1) {
                res.status(400).send({ message: "Incorrect category." });
                return;
            }
        }
        if (req.body.deliveryType !== undefined) {
            if (deliveryTypes.indexOf(req.body.deliveryType) === -1) {
                res.status(400).send({ message: "Incorrect delivery type." });
                return;
            }
        }

        Item.findByIdAndUpdate(itemId, req.body, { useFindAndModify: false })
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Item not found." });
                } else {
                    if (userId === data.user_id) {
                        res.sendStatus(201);
                    } else {
                        res.sendStatus(403);
                    }

                }
            })
            .catch(error => {
                res.status(500).send({ message: error.message });
            });
    } else {
        res.status(400).send({ message: "Missing ID of item" });
    }
});

router.put('/images/:itemId', (req, res) => {
    const itemId = req.params.itemId;
    if (itemId !== undefined) {
        upload(req, res, function (err) {
            if (req.files === undefined) {
                res.status(400).send({ message: "Nothing to add." });
                return;
            }
            if (err instanceof multer.MulterError) {
                res.status(400).send({ message: "Check image key and limit (4)" });
                return;
            } else {
                res.send(400).send({ message: "Unknown reason" });
            }

            for (let i = 0; i < req.files.length; i++) {
                if (req.files[i].mimetype != "image/png" && req.files[i].mimetype != "image/jpeg") {
                    res.status(400).send({ message: "Not supported format. Use png/jpeg for images." });
                    return;
                }
            }

            let images = {
                image1: "",
                image2: "",
                image3: "",
                image4: ""
            };

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
                    images.image1 = f.filename + "." + imageType
                }
                else if (index === 1) {
                    images.image2 = f.filename + "." + imageType
                }
                else if (index === 2) {
                    images.image3 = f.filename + "." + imageType
                }
                else if (index === 3) {
                    images.image4 = f.filename + "." + imageType
                }
            });
            Item.findByIdAndUpdate(itemId, { "images.image1": images.image1, "images.image2": images.image2, "images.image3": images.image3, "images.image4": images.image4, },
                { useFindAndModify: false })
                .then(data => {
                    if (!data) {
                        res.status(404).send({ message: "Item not found." });
                    } else {
                        res.sendStatus(201);
                    }
                })
                .catch(error => {
                    res.status(500).send({ message: error.message });
                });

        });
    } else {
        res.status(400).send({ message: "Missing ID of item" });
    }
});

router.delete('/', (req, res) => {
    const itemId = req.query.itemId;
    if (itemId !== undefined) {
        Item.findByIdAndRemove(itemId, { useFindAndModify: false })
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Item not found." });
                } else {
                    res.sendStatus(201);
                }
            })
            .catch(error => {
                res.status(500).send({ message: error.message });
            });
    } else {
        res.status(400).send({ message: "Missing ID of item" });
    }
});

module.exports = router;