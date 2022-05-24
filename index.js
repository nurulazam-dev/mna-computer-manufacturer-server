const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8dh86.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const productCollection = client.db('computer_manufacturer').collection('products');


        //products api
        app.get('/product',async(req,res)=>{
            const query ={};
            const curser=productCollection.find(query);
            const products =await curser.toArray();
            res.send(products)
        });
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