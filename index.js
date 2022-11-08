const express = require('express');
const app = express();
const port = process.env.PORT || 5008;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



//middilewers 
app.use(cors());
app.use(express.json());




const uri = "mongodb+srv://dentalServices:Oa8veD10SWcXJI02@cluster0.wqhd5vt.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    const dentalServices = client.db('dentalServices').collection('servicesDental');

    try {

        app.get('/', (req, res) => {

            res.send('service-Review-Server');
        });

        app.get('/service', async (req, res) => {
            //userName: dentalServices
            //password: Oa8veD10SWcXJI02

            const quary = {};

            const cursor = dentalServices.find(quary);
            const services = await cursor.limit(3).toArray();

            res.send(services);

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