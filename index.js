const express = require('express');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
const { MongoClient } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jcoi8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("ToureServices");
        const servicesCollection = database.collection("services");
        const ordersCollection = database.collection('orders');
        const destinationsCollection = database.collection('destinations');

        //get api
        app.get('/services', async(req, res) =>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        //get api
        app.get('/orders', async(req, res) =>{
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })
        //get destinations api
        app.get('/destinations', async(req, res) =>{
            const cursor = destinationsCollection.find({});
            const destination = await cursor.toArray();
            res.send(destination);
        })
        //get single destinations api
        app.get('/destinations/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectID(id) };
            const destination = await destinationsCollection.findOne(query);
            res.json(destination);
        })
        // get single service

        app.get('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectID(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // get single order

        app.get('/orders/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectID(id) };
            const order = await ordersCollection.findOne(query);
            res.json(order);
        })

        
      // update Order
      app.put('/orders/:id', async(req, res) =>{
        const id = req.params.id;
        const updatedOrder = req.body;
        const filter = {_id:ObjectID(id)};
        const options = {upsert:true};
        const updateDoc = {
          $set:{
            orderStatus: updatedOrder.orderStatus
          },
        };
        const result = await ordersCollection.updateOne(filter, updateDoc, options)
        console.log('updating order ', id);
        res.json(result);
      })
        


        // add orders api
        app.post('/orders', async(req, res)=>{
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        })


        // add destinations api
        app.post('/destinations', async(req, res)=>{
            const destination = req.body;
            const result = await destinationsCollection.insertOne(destination);
            res.json(result);
        })


        // delete single order

        app.delete('/orders/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectID(id) };
            const order = await ordersCollection.deleteOne(query);
            res.json(order);
        })
        // delete single service

        app.delete('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectID(id) };
            const service = await servicesCollection.deleteOne(query);
            res.json(service);
        })

        // post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            const result =await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);

        })
    }

    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running tourfaster server');
});
app.listen(port, () => {
    console.log('Running tourfaster server on port', port);
})