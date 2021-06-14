const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/controller');

const router = express.Router();

router.post(
  '/signup',
  [
      check('name')
      .not()
      .isEmpty(),
      check('email')
      .not()
      .isEmpty(),
      check('identity')
      .not()
      .isEmpty(),
      check('password')
      .not()
      .isEmpty(),
      check('masterPassword')
      .not()
      .isEmpty()
  ],
  usersController.signup
);

router.post(
    '/login',
    [
        check('identity')
        .not()
        .isEmpty(),
        check('password')
        .not()
        .isEmpty()
    ],
    usersController.login
);

router.post(
    '/password',
    [
        check('identity')
        .not()
        .isEmpty(),
        check('user')
        .not()
        .isEmpty(),
        check('pass')
        .not()
        .isEmpty(),
        check('website')
        .not()
        .isEmpty()
    ],
    usersController.password
);
router.post(
    '/decrypt',
    [
        check('identity')
        .not()
        .isEmpty(),
        check('masterPassword')
        .not()
        .isEmpty(),
        check('user')
        .not()
        .isEmpty(),
        check('pass')
        .not()
        .isEmpty()    
    ],
    usersController.decrypt
);
router.post(
    '/fetch',
    [
        check('identity')
        .not()
        .isEmpty(),
        check('password')
        .not()
        .isEmpty()
    ],
    usersController.fetch
);


module.exports = router;