const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notes_controller');

router.post('/create', notesController.createNote);
router.get('/fetch', notesController.getNotes);
router.put('/update/:id', notesController.updateNote);
router.delete('/delete/:id', notesController.delete);


module.exports = router;