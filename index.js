const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8dh86.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//JWT verify
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'UnAuthorized access' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access' })
    }
    req.decoded = decoded;
    next();
  });
}


async function run() {
  try {
    await client.connect();
    const productCollection = client.db('computer_manufacturer').collection('products');
    const reviewCollection = client.db('computer_manufacturer').collection('reviews');
    const userCollection = client.db('computer_manufacturer').collection('users');


    //products api
    app.get('/products',verifyJWT, async (req, res) => {
      const query = {};
      const curser = productCollection.find(query);
      const products = await curser.toArray();
      res.send(products)
    });

    //reviews api
    app.get('/reviews',verifyJWT,async (req, res) => {
      const query = {};
      const curser = reviewCollection.find(query);
      const reviews = await curser.toArray();
      res.send(reviews)
    });

    //all users API
    app.get('/user',verifyJWT, async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });

    //users API
    app.put('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
      res.send({ result, token });
    })


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