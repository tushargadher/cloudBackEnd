const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/unbook";  //database connection string

const mongoURLCloud  = 'mongodb+srv://tushargadher:tushar#data@mongo@cluster0.jkbmkt6.mongodb.net/cloudnote?retryWrites=true&w=majority';

mongoose.set("strictQuery", false);//for removing warning

const connectToMongo = () => {
   mongoose.connect(mongoURLCloud, () => {
      console.log("Connected to Mongo Successfully...");
   })
}
module.exports = connectToMongo;


