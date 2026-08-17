const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/unbook";  //database connection string

const mongoURLCloud  = 'mongodb+srv://tushargadher123_db_user:lodAarcEpDUD1Syg@cluster0.dytpdsw.mongodb.net/';

mongoose.set("strictQuery", false);//for removing warning

const connectToMongo = () => {
   mongoose.connect(mongoURLCloud, () => {
      console.log("Connected to Mongo Successfully...");
   })
}
module.exports = connectToMongo;


