
const express =require("express");
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;
// middelware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwsc8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        console.log("wow connected");
        const database = client.db("tourGuide");
    const ServicesCollection = database.collection("services");
    const bookingCollection = database.collection("bookingorder");




    app.post('/bookingorder',async(req,res)=>{
        const booking = req.body;
        console.log("heat from booking api",booking);
        
        const result = await bookingCollection.insertOne(booking);
        console.log(result);
        res.json(result)
    });

    //Get All Booking Order
    app.get('/bookingorder', async(req,res)=>{
        const cursor = bookingCollection.find({});
        const booking = await cursor.toArray();
        res.send(booking)
    })


  app.delete('/bookingorder/delete/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await bookingCollection.deleteOne(query);

    console.log('deleting user with id ', result);

    res.json(result);
})



    // get api
    app.get('/services', async(req,res)=>{
        const cursor = ServicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services)
    })

    // post api
        app.post('/services',async(req,res)=>{
            const service = req.body;
            console.log("heat from post api",service);
            
            const result = await ServicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('running tour server');

});
app.listen(port,()=>{
    console.log('running tour server port on',port);
})




