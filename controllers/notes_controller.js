const Notes = require('../models/Notes');
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

module.exports.getNotes = function (req, res) {
    try {
        // get user id through the payload
        const jwt_payload = jwt.decode(req.body.token);
        const userId = jwt_payload;
        
        // find notes with the userId
        Notes.find({user: userId}, function (err, notes) {
            return res.status(200).json(notes);
        })
    } catch (err) {
        console.log('Error ', err);
        return res.status(500).json({'error': 'Internal Server Error'});
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
    Notes.create({
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