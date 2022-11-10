const express = require('express');
const app = express();
const port = process.env.PORT || 5008;
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



//middilewers 
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wqhd5vt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function varifyJWT(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'un-authorized-access' })

    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {

        if (err) {
            return res.status(401).send({ message: 'un-authorized-access' })
        }
        req.decoded = decoded;
        next();
    });

}

async function run() {

    const dentalServices = client.db('dentalServices').collection('servicesDental');
    const reviewCollection = client.db('dentalServices').collection('review');
    try {

        app.post('/jwt', (req, res) => {

            const user = req.body;
            //console.log(user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.send({ token });
        })

        app.get('/', (req, res) => {

            res.send('service-Review-Server');
            //https://b6a11-service-review-server-side-two.vercel.app/service
        });

        app.get('/service', async (req, res) => {
            //userName: dentalServices
            //password: Oa8veD10SWcXJI02
            ////https://b6a11-service-review-server-side-two.vercel.app/service

            const quary = {};

            const cursor = dentalServices.find(quary);
            const services = await cursor.limit(3).toArray();

            res.send(services);

        })

        app.post('/addService', async (req, res) => {

            const addservices = req.body;

            // console.log(addservices);

            const result = await dentalServices.insertOne(addservices);
            //console.log(result);
            res.send(result);


        })

        app.get('/serviceDetails', async (req, res) => {
            const quary = {};
            const cursor = dentalServices.find(quary);
            const allDetails = await cursor.toArray();
            res.send(allDetails);

        })

        app.get('/serviceDetails/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await dentalServices.findOne(query);
            //console.log(user);
            res.send(user);


            // res.send(id);


        })


        //get review all data

        app.get('/review', varifyJWT, async (req, res) => {

            // console.log(req.query.email);


            const decoded = req.decoded;
            console.log('Api', decoded);
            if (decoded.email !== req.query.email) {
                res.status(403).send({ message: 'un-authorized-access' })
            }

            let quary = {};

            if (req.query.email) {
                quary = { email: req.query.email }
            }

            const cursor = reviewCollection.find(quary);
            const review = await cursor.toArray();

            res.send(review);

        })

        //review-Api

        app.post('/review', async (req, res) => {

            const review = req.body;
            // console.log(review);

            const result = await reviewCollection.insertOne(review);
            console.log(result);
            res.send(result);
        })

        //update info

        app.get('/updateReview/:id', async (req, res) => {

            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.findOne(query);
            res.send(result);
        })

        app.put('/updateReview/:id', async (req, res) => {

            const id = req.params.id;
            console.log(id);
            const filter = { _id: ObjectId(id) }
            const Review = req.body;
            const options = { upsert: true };

            const updateReview = {
                $set: {
                    text: Review.text,
                    rating: Review.rating
                }
            }
            const result = await reviewCollection.updateOne(filter, updateReview, options);
            console.log(result);
            res.send(result);
        })



        app.delete('/review/:id', async (req, res) => {

            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.deleteOne(query);
            console.log(result);

            res.send(result);
        })



    }
    finally {


    }


}

run().catch((error) => {
    console.log(error.message);
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});