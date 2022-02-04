const express = require('express');
var cors = require('cors')
const app = express();
const db = require('./config/mongoose');
const port = 8000;
const expressValidator = require('express-validator')

app.use(cors())

app.use(express.json());

// use express validator
app.use(expressValidator())

// use express router
app.use('/api', require('./routes/index'));

app.listen(port, function(err){
    if(err){console.log(`Error in running the server: ${err}`); return;}
    console.log(`Server is running on port: ${port}`)
})