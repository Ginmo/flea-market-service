const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
app.use(bodyParser.json());
const port = 3000;
let server = null;

app.get('/', (req, res) => {
    res.send('Flea Market Service API');
});



module.exports = {
    close: () => {
        server.close();
        console.log("Server closed.");
    },
    start: (mode) => {
        let databaseName = 'fleamarket';
        if (mode == "test") {
            databaseName = 'fleamarket-test';
        }
        db.init(databaseName).then(() => {
            db.checkConnection().then(() => {
                server = app.listen(port, () => {
                    console.log(`Listening on http://localhost:${port}\n`);
                });
            }).catch(error => {
                console.log("DB connection refused");
                console.log(error);
            });
        }).catch(error => {
            console.log("DB init error");
            console.log(error);
        });
    }
}