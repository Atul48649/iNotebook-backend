const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notes_controller');

router.post('/createnote', notesController.createNote);
router.get('/fetchallnotes', notesController.getNotes);


module.exports = router;