const { validationResult } = require('express-validator');

const { User, Password } = require('../models/user');

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ res: 'Invalid inputs passed, please check your data'});
    }
    const { name,email,identity,password } = req.body;

    let existingUser;
    try {
      existingUser = await User.findOne({ identity: identity });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ res: 'Registration failed, please try again later'});
    }
    
    if (existingUser) {
        return res.status(422).json({ res: 'User exists already, please try again'});
    }
    
    const createdUser = new User({
      name,
      email,
      identity,
      password
    });
  
    try {
      await createdUser.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ res: 'Registration failed, please try again later'});
    }
  
    res.status(201).json({res: {user: createdUser.toObject({ getters: true })}});
  };

const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ res: 'Invalid inputs passed, please check your data'});
    }
    
    const { identity,password } = req.body;
    
    let existingUser;

    try {
      existingUser = await User.findOne({ identity: identity, password: password });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ res: 'Login failed, please try again later'});
    }
    
    if (existingUser) {
        return res.status(201).json({res: {user: existingUser}});
    } else {
        return res.status(500).json({ res: 'Login failed, please try again later'});
    }
}

const password = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ res: 'Invalid inputs passed, please check your data'});
    }
    const { identity,password,user,pass } = req.body;

    let existingUser;

    try {
      existingUser = await User.findOne({ identity: identity,password: password });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ res: 'Registration failed, please try again later'});
    }
    
    if (!existingUser) {
        return res.status(422).json({ res: 'User does not exist, please try again '});
    }


    const createdDetails = new Password({
        user,
        pass,
        link: identity
      });

    try {
      await createdDetails.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ res: 'Updates failed, please try again'});
    }
  
    res.status(201).json({res: {details: createdDetails.toObject({ getters: true })}});
  };

  const fetch = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ res: 'Invalid inputs passed, please check your data'});
    }
    
    const { identity,password } = req.body;
    
    let existingUser;
    let passwords;

    try {
      existingUser = await User.findOne({ identity: identity, password: password });
      passwords = await Password.findOne({ link: identity });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ res: 'Could not fetch data, please try again later'});
    }
    
    if (existingUser) {
        return res.status(201).json({ res: { user: existingUser, passwords: passwords }});
    } else {
        return res.status(500).json({ res: 'Login failed, please try again later'});
    }

    
}

exports.signup = signup;
exports.login = login;
exports.password = password;
exports.fetch = fetch;