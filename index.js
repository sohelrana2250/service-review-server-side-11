const express = require('express');
const app = express();
const port = process.env.PORT || 5008;
const cors = require('cors');
require('dotenv').config();



//middilewers 
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {

    res.send('service-Review-Server');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});