const express = require('express');
const route = express.Router();
const Notes = require('../models/Notes');
const fetchuser = require('../middleware/fetchuser');//this is a middleware
const { body, validationResult } = require('express-validator');

//ROUTE 1:Get all the notes using : GET"/api/notes/fetchallnotes" endpoint. login required
route.get('/fetchallnotes', fetchuser, async (req, res) => {
   try {
      const notes = await Notes.find({ user: req.user.id });
      res.json(notes);
   } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error.");
   }
}); 




//ROUTE 2:Add a new Note using : POST "/api/notes/addnote" endpoint. login required
route.post('/addnote', fetchuser, [
   //validation 
   body('title', 'Enter Vaild Title').isLength({ min: 3 }),
   body('description', 'Description Must be More then Five Digit').isLength({ min: 5 }),
], async (req, res) => {

   try {
      // array destruction of the array of request body
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      //if there is no error below code will run
      const note = new Notes({

         title, description, tag, user: req.user.id

      })
      const savedNote = await note.save();
      res.json(savedNote);
   }
   catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error.");
   }
});




//ROUTE 3:Update an existing Note using : PUT "/api/notes/updatenote" endpoint. login required
route.put('/updatenote/:id', fetchuser, async (req, res) => {
   const { title, description, tag } = req.body;
   //create a newnote object
   try {
      const newNote = {};
      //if the title is come in request then we update the title
      if (title) { newNote.title = title };
      if (description) { newNote.description = description };
      if (tag) { newNote.tag = tag };

      //Find the note to be updated and update it
      let note = await Notes.findById(req.params.id);//req.params.id is the id of that note we want to update
      //if the note is not found then
      if (!note) {
         return res.status(404).send("Not Found"); // here we are returing the value means that our script will not excute afterward code , program termination
      }

      //here we check that the user is updating her own notes and not other user note , in shot here we identify the user  
      if (note.user.toString() !== req.user.id) {
         return res.status(401).json({ "Error": "You are not authorized" })
      }
      note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
      res.json({ note });
   } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error.");
   } 
 

});















//ROUTE 4:Delete an existing Note using : Delete  "/api/notes/deletenote" endpoint. login required
route.delete('/deletenote/:id', fetchuser, async (req, res) => {

   try {
      //Find the note to be deleted and delete it
      let note = await Notes.findById(req.params.id);//req.params.id is the id of that note we want to delete
      //if the note is not found then
      if (!note) {
         return res.status(404).send("Not Found"); // here we are returing the value means that our script will not excute afterward code , program termination
      }

      //Allow deletion only if user owns this note  
      if (note.user.toString() !== req.user.id) {
         return res.status(401).json({ "Error": "You are not authorized." })
      }

      //find the note and delete the note
      note = await Notes.findByIdAndDelete(req.params.id);
      res.json({ "Success": "Note has been deleted.", note: note });
   } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error.");
   }
});

module.exports = route;