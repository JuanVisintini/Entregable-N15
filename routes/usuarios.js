const express = require('express');
const passport = require('passport');
const { getFormLogin, loginUser, logoutUser, getFromRegister, registerUserError, loginUserError } = require('../controllers/userControllers');

const router = express.Router();

//Login
router.get('/login', getFormLogin);

router.post('/login', passport.authenticate('login', {
    failureRedirect: '/api/usuarios/login/error',
    failureMessage: true,
}), loginUser);

router.get('/login/error', loginUserError);

//Register
router.get('/registro', getFromRegister);

router.post('/registro', passport.authenticate('register', {
    failureRedirect: '/api/usuarios/register/error',
    failureMessage: true,
}), loginUser);

router.get('/register/error', registerUserError);

router.post('/logout', logoutUser);

module.exports = router;
