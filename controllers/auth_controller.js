const User = require('../models/User');
const { body, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.validate = function (method) {
    switch (method) {
        case 'createUser': {
            return [
                body('name', "Enter a valid name").isLength({ min: 3 }),
                body('email', 'Enter a valid email').exists().isEmail(),
                body('password', 'Password should contain atleast 5 characters').isLength({ min: 5 }),
            ];
        }
        case 'login': {
            return [
                body('email', 'Enter a valid email').exists().isEmail(),
                body('password', 'Password cannot be blank').exists().isLength({ min: 1 })
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
        User.findOne({ email: req.body.email }, async function (err, user) {
            if (err) { console.log('Error: ', err); return; }

            const salt = await bcrypt.genSalt(10);
            const securePassword = await bcrypt.hash(req.body.password, salt);

            // create a user
            if (!user) {
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: securePassword
                }, function (err, user) {
                    if (err) { console.log('Error: ', err); return; }
                    const body = {
                        _id: user._id,
                        email: user.email
                    }
                    return res.status(200).json({
                        message: 'User created successfully!',
                        success: true,
                        data: {
                            name: user.name,
                            email: user.email,
                            token: jwt.sign(user._id.toJSON(), 'iNotebook')
                        }
                    });
                })
            } else {
                return res.status(400).json({
                    message: 'User with this email already exist',
                    success: false,
                    data: {
                        email: req.body.email
                    }
                });
            }
        })
    } catch (err) {
        console.log('Error: ', err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

module.exports.login = function (req, res) {
    try {
        // throw error in res.json if any
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        User.findOne({ email: req.body.email }, async function (err, user) {
            if (err) { console.log('Error: ', err); return; }
            if (!user) {
                return res.status(400).json({
                    error: 'Please try to login with valid credentials!'
                });
            }
            const comparePassword = await bcrypt.compare(req.body.password, user.password);
            if (!comparePassword) {
                return res.status(400).json({
                    error: 'Please try to login with valid credentials!',
                    success: false
                });
            }
            const body = {
                _id: user._id,
                email: user.email
            }
            return res.status(200).json({
                message: 'Login successfully!',
                success: true,
                data: {
                    name: user.name,
                    email: user.email,
                    token: jwt.sign(user._id.toJSON(), 'iNotebook')
                }
            });
        })
    } catch (err) {
        console.log('Error: ', err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

module.exports.getUser = async function (req, res) {
    const jwt_payload = jwt.decode(req.body.token);
    const userId = jwt_payload;
    try {
        let user = await User.findById(userId).select('-password');

        if(user){
            return res.status(200).json(user);
        }else{
            return res.status(401).json({
                error: 'Please authenticate using a valid token'
            });
        }
    } catch (err) {
        console.log('Error: ', err);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}