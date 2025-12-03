const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = 3000;

const app = express()
app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://PawMart:RULHgSZRXMl0X4Fi@cluster0.vqipep0.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
        app.get('/listing', async (req, res) =>{
            const result = await petListing.find().toArray();
            res.send(result)
        })

        app.get('/listing/:id', async (req, res) =>{
            const id = req.params
            console.log(id);
            const query = {_id: new ObjectId(id)}
            const result = await petListing.findOne(query)
            res.send(result)

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
