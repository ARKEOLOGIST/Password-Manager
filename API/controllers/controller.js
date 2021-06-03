const { validationResult } = require('express-validator');
const crypto = require('crypto');
const { User, Password } = require('../models/user');

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ res: 'Invalid inputs passed, please check your data'});
    }
    const { name,email,identity,password,masterPassword} = req.body;

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
    const salt = crypto.randomBytes(8).toString('hex');
    const hash=crypto.createHash('md5').update(masterPassword).digest('hex');
    const createdUser = new User({
      name,
      email,
      identity,
      salt,
      password,
      hash,
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
/*const masterPasswordValidator = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ res: 'Invalid inputs passed, please check your data'});
  }
  
  const {identity, masterP } = req.body;
  const masterP_hash=crypto.createHash('md5').update(masterP).digest('hex');
  let existingUser;

  try {
    existingUser = await User.findOne({ identity:identity,masterPassword:masterP_hash});
  } catch (err) {
      console.log(err);
      return res.status(500).json({ res: 'Error occured'});
  }
  
  if (existingUser) {
      return res.status(201).json({res: {user: existingUser}});
  } else {
      return res.status(500).json({ res: 'Error occured'});
  }
}*/


const password = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ res: 'Invalid inputs passed, please check your data'});
    }
    const { identity,user,website,pass,masterP } = req.body;
    const masterP_hash=crypto.createHash('md5').update(masterP).digest('hex');
    let existingUser;

    try {
      existingUser = await User.findOne({ identity: identity,masterPassword:masterP_hash});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ res: 'Registration failed, please try again later'});
    }
    
    if (!existingUser) {
        return res.status(422).json({ res: 'User does not exist, please try again '});
    }
    const hpass = crypto.pbkdf2Sync(masterPass, existingUser.salt, 100000, 16, 'sha512').toString('hex');
    const encryptedpass = crypto.createCipher("aes-256-gcm",hpass).update(pass, "utf-8", "hex");
    const encypteduser= crypto.createCipher("aes-256-gcm",hpass).update(user, "utf-8", "hex");
    const createdDetails = new Password({
        website,
        encrypteduser,
        encryptedpass,
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

  const Decryptedval = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ res: 'Invalid inputs passed, please check your data'});
    }
    
    const { identity,password, masterPassword,user,pass } = req.body;
    let existingUser;
    let passwords;

    try {
      existingUser = await User.findOne({ identity: identity, password: password });
      passwords = await Password.findOne({ link: identity, user:user, pass:pass });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ res: 'Could not fetch data, please try again later'});
    }
    
    if (existingUser && passwords) {
        const hpass = crypto.pbkdf2Sync(masterPassword, existingUser.salt, 100000, 16, 'sha512').toString('hex');
        const decryptedpass = crypto.createDecipher("aes-256-gcm", hpass).update(pass, "hex", "utf-8");
        const decrypteduser = crypto.createDecipher("aes-256-gcm", hpass).update(user, "hex", "utf-8");
        const password= {user:decrypteduser, password:decryptedpass};
        return res.status(201).json({ res: { user: existingUser, password: password }});
    } else {
        return res.status(500).json({ res: 'Login failed, please try again later'});
    }

    
}
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
exports.Decryptedval=Decryptedval;
exports.fetch = fetch;