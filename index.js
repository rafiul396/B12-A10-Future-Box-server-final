const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const app = express()
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://fineaseUSER:Lm6899YQ3PaXWyQe@cluster0.abvmfph.mongodb.net/?appName=Cluster0`

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get("/", (req, res) => {
    res.send('Hello FinEase')
})

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const db = client.db("financeDB");
        const dataCollection = db.collection("main-data");

        app.get('/my-transaction', async (req, res) => {
            const email = req.query.email;
            const cursor = dataCollection.find({ email: email }).sort({ amount: -1 });
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/my-transaction/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: new ObjectId(id) }
            const result = await dataCollection.findOne(query)
            res.send(result)
        })

        app.post('/my-transaction', async (req, res) => {
            const data = req.body;
            const result = await dataCollection.insertOne(data)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Running port is ${port}`);
})