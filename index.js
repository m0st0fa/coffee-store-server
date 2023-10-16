const express = require('express');
const cors = require('cors');
require ('dotenv').config();
const app = express()
const port = process.env.PORT || 4000;

// midleware 
app.use(cors())
app.use(express.json());

// dMzuum7ogO1cvIRF
// mostofa_kamal024

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.BD_PASS}@cluster0.9zrnpig.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const CoffeeCollection = client.db('coffeeDB').collection('coffee')

    app.get('/coffee', async (req,res) =>{
        const cursor = CoffeeCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })
    app.get('/coffee/:id', async(req,res)=>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await CoffeeCollection.findOne(query)
        res.send(result)
    })

    app.post('/coffee', async(req,res)=>{
        const newCoffee = req.body
        const result = await CoffeeCollection.insertOne(newCoffee)
        res.send(result)
    })
    
    app.put('/coffee/:id', async(req, res)=>{
        const id = req.params.id
        const filter = {_id: new ObjectId(id)}
        const options = { upsert: true };
        const updatedCoffee = req.body
        const Coffee = {
            $set:{
                name: updatedCoffee.name,
                quantity: updatedCoffee.quantity,
                supplier: updatedCoffee.supplier,
                category: updatedCoffee.category,
                taste: updatedCoffee.taste,
                supplier: updatedCoffee.supplier,
                details: updatedCoffee.details,
                photo: updatedCoffee.photo,
            }
        }
        const result = await CoffeeCollection.updateOne(filter,Coffee,options)

    })

    app.delete('/coffee/:id', async (req,res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await CoffeeCollection.deleteOne(query)
        res.send(result);

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


app.get('/',(req,res)=>{
    res.send('coffe making server is running')
})

app.listen(port, ()=>{
    console.log(`coffee is server is running port:${port}`)
})
