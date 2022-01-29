const Note = require('../models/Note');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator/check');

module.exports.validate = function (method) {
    switch (method) {
        case 'createNote': {
            return [
                body('title', 'Title must have atleast 3 characters').isLength({ min: 3 }),
                body('description', 'Description must have atleast 5 characters').isLength({ min: 5 })
            ];
        }
    }
}

// module.exports.updateNote = function(req, res){
//     // find the note to be updated and update the note
//     Notes.findById(req.params.id, function(err, note){
//         if (err) { console.log('Error in finding a note: ', err); return; }
//         if(!note){
//             return res.status(404).send("Not Found")
//         }
//         if(note.user !== req.user.id){
//             return res.status(401).send('Not Allowed');
//         }

//     })
// }

module.exports.updateNote = async function (req, res) {
    try {
                // destructuring req.body
        const { title, description, tag } = req.body;

        // create a update object
        const update = {};
        if (title) { update.title = title }
        if (description) { update.description = description }
        if (tag) { update.tag = tag }

        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // get user id through the payload
        const jwt_payload = jwt.decode(req.body.token);
        const userId = jwt_payload;

        if (note.user == userId) {
            let updateNote = await Note.findByIdAndUpdate(req.params.id, update);
            return res.status(200).json({
                message: 'Note updated successfully',
                data: update
            });
        } else {
            return res.status(401).send('Not Allowed');
        }
    } catch (err) {
        console.log('Error ', err);
        return res.status(500).json({ 'error': 'Internal Server Error' });
    }
}

module.exports.createNote = function (req, res) {
    // throw error in res.json if any
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    // get user id through the payload
    const jwt_payload = jwt.decode(req.body.token);
    const userId = jwt_payload;

    // destructuring of req.body
    const { title, description, tag } = req.body;
    Note.create({
        title: title,
        description: description,
        tag: tag,
        user: userId
    }, function (err, note) {
        if (err) { console.log('Error in creating a note: ', err); return; }
        return res.status(200).json({
            message: 'Note created successfully!',
            data: {
                title: req.body.title,
                description: req.body.description,
                tag: req.body.tag
            }
        });
    })
}

module.exports.getNotes = function (req, res) {
    try {
        // get user id through the payload
        const jwt_payload = jwt.decode(req.body.token);
        const userId = jwt_payload;

        // find notes with the userId
        Note.find({ user: userId }, function (err, notes) {
            return res.status(200).json(notes);
        })
    } catch (err) {
        console.log('Error ', err);
        return res.status(500).json({ 'error': 'Internal Server Error' });
    }
}