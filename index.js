const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

// middlewire
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.okbnb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        const database = client.db('Tour_Plans');
        const tourCollection= database.collection('tours');
        const myTourCollection = database.collection('myTours');

        // Get Tours plans Api
        app.get('/tours', async(req, res)=>{
            const cursor = tourCollection.find({});
            const tours = await cursor.toArray();
            res.send(tours);
        })

        // Get Single Tour Plan
        app.get('/tours/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const tour = await tourCollection.findOne(query);
            res.json(tour);
        })

        //Post Tours Api
        app.post('/tours', async(req,res) =>{
            const tour = req.body;
            console.log('Hit The Post Api', tour)
            res.send("post hitted")

            const result = await tourCollection.insertOne(tour);
            console.log(result)
            res.json(result)
        })
        
         app.delete('/tours/:id', async(req, res)=>{
           const id = req.params.id;
           const query = {_id:ObjectId(id)};
           const result = await tourCollection.deleteOne(query);
           res.json(result)
        }) 
   

        // Get MyTour Api
         // Get Tours plans Api
         app.get('/myTours', async(req, res)=>{
            const cursor = myTourCollection.find({});
            const myTours = await cursor.toArray();
            res.send(myTours);
        })
      
        // Post MyTour Api
        app.post('/myTours', async(req,res) =>{
            const myTour = req.body;
            console.log('Hit The Post Api', myTour)
            const result = await myTourCollection.insertOne(myTour)
            res.send(result);
     
        }) 
         app.get('/myTours/:email', async(req, res)=>{
            /* const cursor = myTourCollection.find({});
            const tours = await cursor.toArray();
            res.send(tours); */
            // console.log(req.params.email);
          const result = await myTourCollection.find({ email: req.params.email}).toArray();
            res.send(result) 
        }) 
      

        app.delete('/myTours/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await myTourCollection.deleteOne(query);
            res.json(result)
         }) 
       
    }
    finally{
        // await client.close()
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Server is Working')
})

app.listen(port, () => {
  console.log("Server is working at port", port)
})