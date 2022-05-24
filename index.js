const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();

async function run() {
    try {

    }
    finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('MNA Computer Manufacturer Server is Run')
})

app.listen(port, () => {
    console.log("Running", port);
})