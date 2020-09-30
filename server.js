const express = require('express');
const bodyParser = require('body-parser');
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
    start: () => {
        server = app.listen(port, () => {
            console.log(`Listening on http://localhost:${port}\n`);
        });
    }
}