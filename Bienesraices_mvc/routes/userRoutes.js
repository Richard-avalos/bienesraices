import express from 'express'
import {formLogin, authenticate, formRegister, register, checkAccount, formForgotPassword, 
    resetPassword, checkToken, newPassword, signOff } from '../controllers/UserController.js'

const router = express.Router();

//Routing
router.get('/login', formLogin);
router.post('/login', authenticate)

router.get('/register', formRegister);
router.post('/register', register);

// Sign off
router.post('/signOff', signOff)

router.get('/checkAccount/:token', checkAccount);

router.get('/forgotPassword', formForgotPassword);
router.post('/forgotPassword', resetPassword);

//Store new password
router.get('/forgotPassword/:token', checkToken);
router.post('/forgotPassword/:token', newPassword);






export default router