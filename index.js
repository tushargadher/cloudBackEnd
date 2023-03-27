
//this is our main backend file
//nodemon
//include connectToMongo function from "dbconnect.js"
const connectToMongo = require('./dbconnect');
connectToMongo();//calling function to connect to database
var cors = require('cors')
const express = require('express')//include express packege in our file ,express is require for creating api
const app = express()
//we change the port number because 3000 port run a react application
const port = 5000;

app.use(cors())
app.use(express.json())//to use the request body of api

// app.get('/', (req, res) => {
//   res.send('Hello World!This is Tushar.This is my fist Api')
// })


//endpoint of api
app.use('/api/auth', require('./routes/auth'));

app.use('/api/notes', require('./routes/notes'));




// if(process.env.NODE_ENV == "production"){
//   app.use(express.static("Front-End/build"));
// }
app.listen(port, () => {
  console.log(`UnBook app listening on port ${port}`)
}) 
