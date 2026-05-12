const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');

const uri = process.env.MONGO_DB_URI;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const run = async() => {
    try {
        await client.connect();

        const db1 = client.db('WanderLastDB1');
        const destinationCollection = db1.collection('destinations');

        app.get('/destinations', async(req, res) => {
            const result = await destinationCollection.find().toArray();
            res.send(result);
        });

        app.get('/destination-detail/:id', async(req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            }
            const result = await destinationCollection.findOne(query);
            res.send(result);
        });

        app.delete('/destination-detail/:id', async(req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            }
            const result = await destinationCollection.deleteOne(query);
            res.send(result);
        });

        await client.db("admin").command({ ping: 1 });

    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
        // await client.close();
  }
}
run().catch(console.dir);

app.get('/', async(req, res) => {
    res.send('home');
});

app.listen(port, () => {
    console.log('app is running on port: ', port);
});
