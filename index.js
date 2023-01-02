const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken')
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8dh86.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//JWT verify======
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'UnAuthorized access' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access' })
    }
    else{
      req.decoded = decoded;
    next();
    }
  });
}


async function run() {
  try {
    await client.connect();
    console.log("mongo eating steel");

    const productsCollection = client.db("computer_manufacturer").collection("products");
    const ordersCollection = client.db("computer_manufacturer").collection("orders");
    const paymentsCollection = client.db("computer_manufacturer").collection("payments");
    const usersCollection = client.db("computer_manufacturer").collection("users");
    const reviewsCollection = client
      .db("computer_manufacturer")
      .collection("reviews");

    //----------------------------  GET api ---------------------------- //

    // all products*
    app.get("/products", async (req, res) => {
      const products = await productsCollection.find().toArray();
      res.send(products.reverse());
    });

    // single product
    app.get("/product/purchase/:purchaseId", verifyJWT, async (req, res) => {
      const id = req.params.purchaseId;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    // my orders
    app.get("/order", verifyJWT, async (req, res) => {
      const customer = req.query.customer;
      const decodedEmail = req.decoded.email;
      if (customer === decodedEmail) {
        const orders = await ordersCollection
          .find({ customer: customer })
          .toArray();
        return res.send(orders);
      } else {
        return res.status(403).send({ message: "Forbidden access" });
      }
    });

    // single order
    app.get("/order/:id", verifyJWT, async (req, res) => {
      const product = req.params.id;
      const query = { _id: ObjectId(product) };
      const order = await ordersCollection.findOne(query);
      res.send(order);
    });

    // current user
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email: email });
      res.send(user);
    });

    // all user
    app.get("/users", verifyJWT, async (req, res) => {
      const users = await usersCollection.find().toArray();
      res.send(users);
    });

    // check admin role
    app.get("/users/admin/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email: email });
      const isAdmin = user.role === "admin";
      res.send({ admin: isAdmin });
    });

    // all reviews
    app.get("/reviews", async (req, res) => {
      const reviews = await reviewsCollection.find().toArray();
      res.send(reviews.reverse());
    });

    // all orders // admin
    app.get("/orders", verifyJWT, async (req, res) => {
      const orders = await ordersCollection.find().toArray();
      res.send(orders);
    });

    //----------------------------  POST api ---------------------------- //

    // post order
    app.post("/order", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.send(result);
    });

    // post new product
    app.post("/products", verifyJWT, async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    // post new review
    app.post("/reviews", verifyJWT, async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    });

    // payment intent
    app.post("/create-payment-intent", verifyJWT, async (req, res) => {
      const shouldPay = req.body.shouldPay;
      const amount = shouldPay * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({ clientSecret: paymentIntent.client_secret });
    });

    //----------------------------  PUT api ---------------------------- //

    // update user data from my profile
    app.put("/users/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      console.log(user, email);
      const filter = { email: email };
      const updateDoc = {
        $set: {
          education: user.education,
          address: user.address,
          contact: user.contact,
          linkedIn: user.linkedIn,
          faceBook: user.faceBook,
          hobby: user.hobby,
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // update user on signUp
    app.put("/users", async (req, res) => {
      const email = req.query.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      const token = jwt.sign(
        { email: email },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.send({ result, token });
    });

    // make admin
    app.put("/users/admin/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const requester = req.decoded.email;
      const requesterInfo = await usersCollection.findOne({ email: requester });
      if (requesterInfo.role === "admin") {
        const filter = { _id: ObjectId(id) };
        const updateDoc = {
          $set: { role: "admin" },
        };
        const result = await usersCollection.updateOne(filter, updateDoc);
        return res.send(result);
      } else {
        return res.status(403).send({ message: "Forbidden access" });
      }
    });

    // update payment status // add payment in paymentCollection
    app.put("/orders/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const payment = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          paid: true,
          transactionId: payment.transactionId,
        },
      };
      const result = await ordersCollection.updateOne(filter, updateDoc);
      const newPayment = await paymentsCollection.insertOne(payment);
      res.send(result);
    });

    // set shipment
    app.put("/order/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          shipment: true,
        },
      };
      const result = await ordersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    //----------------------------  DELETE api ---------------------------- //

    // delete my order
    app.delete("/order/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const order = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(order);
      res.send(result);
    });

    // delete product from database
    app.delete("/product/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const product = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(product);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('MNA Computer Manufacturer Server is Run')
})

app.listen(port, () => {
  console.log("Running", port);
})