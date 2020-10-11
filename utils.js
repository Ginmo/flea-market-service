const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('./database');
const User = mongoose.model('User');
const Item = mongoose.model('Item');

// 123: $2y$12$0WKx/VjO1eCvjhkeHFhx..seS/3GI.1N17b7VyEc5900lpMA/4aou

let items = [];
const utils = {
    checkUserLogin: (username, password) => {
        return new Promise(function (resolve, reject) {
            User.find((error, results) => {
                if (!error) {
                    for (let i = 0; i < results.length; i++) {
                        if (username === results[i].username && bcrypt.compareSync(password, results[i].password) == true) {
                            resolve(results[i]);
                            return;
                        }
                    }
                    resolve(false);
                } else {
                    reject(error);
                }
            });
        });
    },
    findItems: (category, location, startDate, endDate) => {
        return new Promise(function (resolve, reject) {
            items = [];
            if (category !== undefined && location !== undefined) {
                if (startDate !== undefined || endDate !== undefined) {
                    findItemByCategoryAndLocationAndDate(category, location, startDate, endDate).then(results => {
                        resolve(results);
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    findItemByCategoryAndLocation(category, location).then(results => {
                        resolve(results);
                    }).catch(error => {
                        reject(error);
                    });
                }
            }

            else if (category !== undefined && location === undefined) {
                if (startDate !== undefined || endDate !== undefined) {
                    findItemByCategoryAndDate(category, startDate, endDate).then(results => {
                        resolve(results);
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    findItemByCategory(category).then(results => {
                        resolve(results);
                    }).catch(error => {
                        reject(error);
                    });
                }
            }

            else if (category === undefined && location !== undefined) {
                if (startDate !== undefined || endDate !== undefined) {
                    findItemByLocationAndDate(location, startDate, endDate).then(results => {
                        resolve(results);
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    findItemByLocation(location).then(results => {
                        resolve(results);
                    }).catch(error => {
                        reject(error);
                    });
                }
            }

            else if (category === undefined && location === undefined) {
                if (startDate !== undefined || endDate !== undefined) {
                    findItemByDate(startDate, endDate).then(results => {
                        resolve(results);
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    Item.find()
                        .then(data => {
                            resolve(data);
                        }).catch(error => {
                            reject(error);
                        });

                }
            }



        });
    }

}


// Find items functions
function findItemByCategory(category) {
    return new Promise(function (resolve, reject) {
        Item.find()
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    if (category === data[i].category) {
                        items.push(data[i]);
                    }
                }
                resolve(items);
            }).catch(error => {
                reject(error);
            });
    });
}

function findItemByLocation(location) {
    return new Promise(function (resolve, reject) {
        Item.find()
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    if (location === data[i].location) {
                        items.push(data[i]);
                    }
                }
                resolve(items);
            }).catch(error => {
                reject(error);
            });
    });
}

function findItemByDate(startDate, endDate) {
    return new Promise(function (resolve, reject) {
        const startDateToEpoch = Date.parse(startDate);
        const endDateToEpoch = Date.parse(endDate);
        Item.find()
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    const date = data[i].date.split(" ");
                    searchedDateToEpoch = Date.parse(date[0]);
                    if (startDate !== undefined && endDate !== undefined) {
                        if (searchedDateToEpoch >= startDateToEpoch && searchedDateToEpoch <= endDateToEpoch) {
                            items.push(data[i]);
                        }
                    }
                    else if (startDate !== undefined && endDate === undefined) {
                        if (searchedDateToEpoch >= startDateToEpoch) {
                            items.push(data[i]);
                        }

                    }
                    else if (startDate === undefined && endDate !== undefined) {
                        if (searchedDateToEpoch <= endDateToEpoch) {
                            items.push(data[i]);
                        }
                    }
                }
                resolve(items);
            }).catch(error => {
                reject(error);
            });
    });
}

function findItemByCategoryAndLocation(category, location) {
    return new Promise(function (resolve, reject) {
        Item.find()
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    if (category === data[i].category && location === data[i].location) {
                        items.push(data[i]);
                    }
                }
                resolve(items);
            }).catch(error => {
                reject(error);
            });
    });
}

function findItemByCategoryAndLocationAndDate(category, location, startDate, endDate) {
    return new Promise(function (resolve, reject) {
        const startDateToEpoch = Date.parse(startDate);
        const endDateToEpoch = Date.parse(endDate);
        Item.find()
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    const date = data[i].date.split(" ");
                    searchedDateToEpoch = Date.parse(date[0]);
                    if (startDate !== undefined && endDate !== undefined) {
                        if (searchedDateToEpoch >= startDateToEpoch && searchedDateToEpoch <= endDateToEpoch && category === data[i].category && location === data[i].location) {
                            items.push(data[i]);
                        }
                    }
                    else if (startDate !== undefined && endDate === undefined && category === data[i].category && location === data[i].location) {
                        if (searchedDateToEpoch >= startDateToEpoch) {
                            items.push(data[i]);
                        }

                    }
                    else if (startDate === undefined && endDate !== undefined && category === data[i].category && location === data[i].location) {
                        if (searchedDateToEpoch <= endDateToEpoch) {
                            items.push(data[i]);
                        }
                    }
                }
                resolve(items);
            }).catch(error => {
                reject(error);
            });
    });
}

function findItemByCategoryAndDate(category, startDate, endDate) {
    return new Promise(function (resolve, reject) {
        const startDateToEpoch = Date.parse(startDate);
        const endDateToEpoch = Date.parse(endDate);
        Item.find()
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    const date = data[i].date.split(" ");
                    searchedDateToEpoch = Date.parse(date[0]);
                    if (startDate !== undefined && endDate !== undefined) {
                        if (searchedDateToEpoch >= startDateToEpoch && searchedDateToEpoch <= endDateToEpoch && category === data[i].category) {
                            items.push(data[i]);
                        }
                    }
                    else if (startDate !== undefined && endDate === undefined && category === data[i].category) {
                        if (searchedDateToEpoch >= startDateToEpoch) {
                            items.push(data[i]);
                        }
                    }
                    else if (startDate === undefined && endDate !== undefined && category === data[i].category) {
                        if (searchedDateToEpoch <= endDateToEpoch) {
                            items.push(data[i]);
                        }
                    }
                }
                resolve(items);
            }).catch(error => {
                reject(error);
            });
    });
}

function findItemByLocationAndDate(location, startDate, endDate) {
    return new Promise(function (resolve, reject) {
        const startDateToEpoch = Date.parse(startDate);
        const endDateToEpoch = Date.parse(endDate);
        Item.find()
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    const date = data[i].date.split(" ");
                    searchedDateToEpoch = Date.parse(date[0]);
                    if (startDate !== undefined && endDate !== undefined) {
                        if (searchedDateToEpoch >= startDateToEpoch && searchedDateToEpoch <= endDateToEpoch && location === data[i].location) {
                            items.push(data[i]);
                        }
                    }
                    else if (startDate !== undefined && endDate === undefined && location === data[i].location) {
                        if (searchedDateToEpoch >= startDateToEpoch) {
                            items.push(data[i]);
                        }
                    }
                    else if (startDate === undefined && endDate !== undefined && location === data[i].location) {
                        if (searchedDateToEpoch <= endDateToEpoch) {
                            items.push(data[i]);
                        }
                    }
                }
                resolve(items);
            }).catch(error => {
                reject(error);
            });
    });
}

module.exports = utils;