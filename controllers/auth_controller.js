const User = require('../models/User');
const { body, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');

module.exports.validate = function (method) {
    switch (method) {
        case 'createUser': {
            return [
                body('name', "Enter a valid name").isLength({ min: 3 }),
                body('email', 'Enter a valid email').exists().isEmail(),
                body('password', 'Password should contain atleast 5 characters').isLength({ min: 5 }),
            ];
        }
    }
}

module.exports.createUser = function (req, res) {

    try {
        // throw error in res.json if any
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        // check weather the user already exist in the db or not on the basis of email
        User.findOne({ email: req.body.email }, function (err, user) {
            if (err) { console.log('Error: ', err); return; }

            // create a user
            if (!user) {
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                }, function (err, user) {
                    if (err) { console.log('Error: ', err); return; }
                    return res.status(200).json({
                        message: 'User created successfully!',
                        data: {
                            name: user.name,
                            email: user.email
                        }
                    });
                })
            } else {
                return res.status(400).json({
                    message: 'User with this email already exist',
                    data: {
                        email: req.body.email
                    }
                });
            }
        })
    } catch (err) {
        console.log('Error: ', err);
        return res.status(500).json({
            message: 'Some error occured'
        });
    }
}