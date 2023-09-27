const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors=require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000

const userName=process.env.DB_USER;
const pass=process.env.DB_PASS;

// console.log(userName,pass)
//middleWare
app.use(cors());
app.use(express.json())

// mongodb
const uri = `mongodb+srv://${userName}:${pass}@clusterfirst.7ajn2mv.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://<username>:<password>@clusterfirst.7ajn2mv.mongodb.net/?retryWrites=true&w=majority";  

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
    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    
    app.get('/coffee',async(req,res)=>{
        const cursor=coffeeCollection.find();
        const result= await cursor.toArray()
        res.send(result)
    })

    app.get('/coffee/:id',async(req,res)=>{
        const id =req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await coffeeCollection.findOne(query);
        res.send(result)
    })

    app.post('/coffee',async(req,res)=>{
        const newCoffee=req.body;
        console.log(newCoffee);
        const result= await coffeeCollection.insertOne(newCoffee)
        res.send(result);
    })

    app.put('/coffee/:id',async(req,res)=>{
        const id= req.params.id;
        console.log(id)
        const updatedCoffee=req.body;
        
        // for specific field we have to set
        const coffee={
            $set:{
                 name :updatedCoffee.name,
                 quantity :updatedCoffee.quantity,
                 supplier :updatedCoffee.supplier,
                 taste :updatedCoffee.taste,
                 category :updatedCoffee.category,
                 details :updatedCoffee.details,
                 photo: updatedCoffee.photo
            }
        }
        
        const filter = { _id: new ObjectId(id)  };
        const options = { upsert: true };

        const result= await coffeeCollection.updateOne(filter,coffee,options)
        res.send(result);
    })

    app.delete('/coffee/:id',async(req,res)=>{
        const id=req.params.id;
        const query = {_id: new ObjectId(id) }
        const result = await coffeeCollection.deleteOne(query);
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


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//CoffeeMaster
//6JxPYIo7FC5ODIf2