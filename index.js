const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = 3000;

const app = express()
app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://PawMart:RULHgSZRXMl0X4Fi@cluster0.vqipep0.mongodb.net/?appName=Cluster0";


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();

        const database = client.db('petListing');
        const petListing = database.collection('listing');
        const orderCollections = database.collection('orders');


        // post or save service to DB
        app.post('/listing', async (req, res) => {
            const data = req.body;
            const date = new Date();
            data.createdAt = date;
            console.log(data);
            const result = await petListing.insertOne(data)
            res.send(result)

        })

        // get services from DB
        app.get('/listing', async (req, res) => {
            

            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/listing/:id', async (req, res) => {
            const id = req.params
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await petListing.findOne(query)
            res.send(result)

        })

        app.get('/mylisting', async (req, res) => {
            const { email } = req.query
            const query = { email: email }
            const result = await petListing.find(query).toArray()
            res.send(result)
        })

        app.put('/update/:id', async (req, res) => {
            const data = req.body;
            const id = req.params
            const query = {_id: new ObjectId(id)}
            const updateListing = {
                $set: data
            }
            const result = await petListing.updateOne(query, updateListing)
            res.send(result)
        })

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params
            const query = {_id: new ObjectId(id) }
            const result = await petListing.deleteOne(query)
            res.send(result)
        })

        app.post('/orders', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await orderCollections.insertOne(data)
            res.status(201).send(result);
        })

        app.get('/orders', async(req, res) =>{
            const result = await orderCollections.find().toArray();
            res.status(200).send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Developer')
})
app.listen(port, () => {
    console.log(`server is running on ${port}`);

})
