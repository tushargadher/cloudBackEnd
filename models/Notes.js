//note schema ,schema means structor of the collection  
const mongoose = require('mongoose');
const { Schema } = mongoose;
const NotesSchema = new Schema({

    //user is works as foreign key 
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    tag: {
        type: String,
        default: "General",
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// here notes is the name of the collection and NotesSchema Define the scema for that collection
module.exports = mongoose.model('notes', NotesSchema);