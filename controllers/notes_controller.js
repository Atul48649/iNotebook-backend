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

module.exports.updateNote = async function (req, res) {
    try {
        // destructuring req.body
        const { title, description, tag } = req.body;

        // create a update object
        const update = {};
        if (title) { update.title = title }
        if (description) { update.description = description }
        if (tag) { update.tag = tag }

        // find the note
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({
                message: "Note doesn't found"
            });
        }

        // get user id through the payload
        const jwt_payload = jwt.decode(req.body.token);
        const userId = jwt_payload;

        // check weather the note belong to the user
        if (note.user == userId) {
            let updateNote = await Note.findByIdAndUpdate(req.params.id, update);
            return res.status(200).json({
                message: 'Note updated successfully',
                data: update
            });
        } else {
            return res.status(401).json({
                message: "Sorry you're not allowed to update this post, this note doesn't belong to you."
            });
        }
    } catch (err) {
        console.log('Error ', err);
        return res.status(500).json({ 'error': 'Internal Server Error' });
    }
}

module.exports.delete = async function (req, res) {
    try {
        // find the node
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({
                message: "Note doesn't found"
            });
        }

        // get user id through the payload
        const jwt_payload = jwt.decode(req.body.token);
        const userId = jwt_payload;

        // check weather the note belong to the user
        if (note.user == userId) {
            await Note.findByIdAndDelete(req.params.id);
            return res.status(200).json({
                message: 'Note deleted successfully',
            });
        } else {
            return res.status(401).json({
                message: "Sorry you're not allowed to delete this post, this note doesn't belong to you."
            });
        }
    } catch (err) {
        console.log('Error ', err);
        return res.status(500).json({ 'error': 'Internal Server Error' });
    }
}