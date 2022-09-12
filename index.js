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
    const orderCollection = client.db('computer_manufacturer').collection('orders');
    const paymentCollection = client.db('computer_manufacturer').collection('payments');

    //get all products api=========
    app.get('/products', async (req, res) => {
      const products = await productCollection.find().toArray();
      res.send(products.reverse())
    });

    // get a product api===============
    app.get("/product/purchase/:purchaseId", verifyJWT, async (req, res) => {
      const id = req.params.purchaseId;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });

    // post/add a Product API============
    app.post('/products', async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    //product delete api==========
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const product = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(product);
      res.send(result)
    });

    //get my orders api===========
     app.get("/order", verifyJWT, async (req, res) => {
      const customer = req.query.customer;
      const decodedEmail = req.decoded.email;
      if (customer === decodedEmail) {
        const orders = await orderCollection
          .find({ customer: customer })
          .toArray();
        return res.send(orders);
      } else {
        return res.status(403).send({ message: "Forbidden access" });
      }
    });

    // get a order=========
    app.get("/order/:id", verifyJWT, async (req, res) => {
      const product = req.params.id;
      const query = { _id: ObjectId(product) };
      const order = await orderCollection.findOne(query);
      res.send(order);
    });

    // get all orders(admin)==================
    app.get("/orders", verifyJWT, async (req, res) => {
      const orders = await orderCollection.find().toArray();
      res.send(orders);
    });

    // post/add an order API==========
    app.post('/order', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    // delete my order api======
    app.delete("/order/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const order = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(order);
      res.send(result);
    });

    //get all reviews api=======
    app.get('/reviews', async (req, res) => {
      const reviews = await reviewCollection.find().toArray();
      res.send(reviews.reverse())
    });

    // post/add a Review API==========
    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

     // get current user===============
     app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
      res.send(user);
    });

    //all users API============
    app.get('/users', verifyJWT, async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });

    // put/update users data API===========
    app.put("/users/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const updateDoc = {
        $set: {
          contact: user.contact,
          education: user.education,
          address: user.address,
          linkedIn: user.linkedIn,
          portfolio: user.portfolio,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

       // put/update signUp user data=======
       app.put("/users", async (req, res) => {
        const email = req.query.email;
        const user = req.body;
        const filter = { email: email };
        const options = { upsert: true };
        const updateDoc = {
          $set: user,
        };
        const result = await userCollection.updateOne(
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

    // Admin verify
    const verifyAdmin = async (req, res, next) => {
      const requester = req.decoded.email;
      const requesterAccount = await userCollection.findOne({ email: requester });
      if (requesterAccount.role === 'admin') {
        next();
      }
      else {
        res.status(403).send({ message: 'forbidden' });
      }
    }

    // get admin check from users==============
    app.get('users/admin/:email', async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
      const isAdmin = user.role === 'admin';
      res.send({ admin: isAdmin })
    })

    // put/make Admin API=============
    app.put("/users/admin/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const requester = req.decoded.email;
      const requesterInfo = await userCollection.findOne({ email: requester });
      if (requesterInfo.role === "admin") {
        const filter = { _id: ObjectId(id) };
        const updateDoc = {
          $set: { role: "admin" },
        };
        const result = await userCollection.updateOne(filter, updateDoc);
        return res.send(result);
      } else {
        return res.status(403).send({ message: "Forbidden access" });
      }
    });

    // get payment intent========
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

    // update payment status & add payment in paymentCollection=========
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
      const result = await orderCollection.updateOne(filter, updateDoc);
      const newPayment = await paymentCollection.insertOne(payment);
      res.send(result);
    });

    // set shipment=======
    app.put("/order/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          shipment: true,
        },
      };
      const result = await orderCollection.updateOne(filter, updateDoc);
      res.send(result);
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