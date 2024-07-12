import {check, validationResult} from 'express-validator'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import {generateJWT, generateId} from '../helpers/tokens.js'
import {emailverification,emailForgotPassword} from '../helpers/email.js'

const formLogin =  (req, res) =>{
    res.render('auth/login', {
       page: 'Iniciar Sesión', 
       csrfToken: req.csrfToken()
    })
}

const authenticate = async (req, res) => {
    //Validate
    await check('email').isEmail().withMessage('El Email es obligatorio').run(req)
    await check('password').notEmpty().withMessage('La contraseña es obligatorio').run(req)

    let result = validationResult(req)

    //Check the result
    if(!result.isEmpty()){
        //Errors
        return res.render('auth/login', {
            page: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errors: result.array(),
        })  

    }

    const { email, password } = req.body

    //Check user
    const user = await User.findOne({ where : { email }})

    if(!user){
        return res.render('auth/login', {
            page: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errors:[{msg: 'El usuario no existe'}],
        })  

    }

    //Check if the user is verified

    if(!user.confirmed){
        return res.render('auth/login', {
            page: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errors:[{msg: 'Tu cuenta no ha sido verificada'}],
        })  

    }

    //Verify password
    if(!user.verifyPassword(password)){
        return res.render('auth/login', {
            page: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errors:[{msg: 'La contraseña es incorrecta'}],
        })  

    }

    //Authenticate the user
    const token = generateJWT({ id: user.id, name: user.name})

    console.log(token)


    //Store token
    
    return res.cookie('_token', token, {
        httpOnly: true,
        //secure: true,
    }).redirect('/my-properties')


}

const formRegister =  (req, res) =>{
    res.render('auth/register', {
        page: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
}

const register = async (req, res) => {

    //Validation
    await check('name').notEmpty().withMessage('El nombre es obligatorio').run(req)
    await check('email').isEmail().withMessage('Esto no es una direccion de correo electrónico').run(req)
    await check('password').isLength({min: 6}).withMessage('La contraseña debe ser de al menos 6 caracteres').run(req)
    await check('repeat_password').custom((value, { req }) => value === req.body.password).withMessage('Las contraseñas no coinciden').run(req);
   
 
    let result = validationResult(req)

    //Check the result
    if(!result.isEmpty()){
        //Errors
        return res.render('auth/register', {
            page: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errors: result.array(),
            user: {
                name: req.body.name,
                email: req.body.email
            }
        })  

    }

    //Extract data
    const {name, email, password} = req.body

    //Verify user
    
    const existUser = await User.findOne( { where: {  email } })
    if(existUser ) {
        return res.render('auth/register', {
            page: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errors: [{msg: 'El usuario ya esta registrado'}],
            user: {
                name: req.body.name,
                email: req.body.email
            }
        })  
    }

    //Store user
    const user = await User.create({
        name,
        email,
        password,
        token: generateId()
    })

    //Send confirmation email
    emailverification({
        name: user.name,
        email: user.email,
        token: user.token
    })

    //Send confirmation message
    res.render('templates/message', {
        page: 'Cuenta Creada Correctamente',
        message: 'Hemos Enviado un Email de Confirmacion, presiona en el enlace'
    })

}

const signOff = (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}

//Check account
const checkAccount = async (req, res, ) => {
    
    const {token} = req.params;

    //Verify token
   const user = await User.findOne({ where : {token}})
   
   if (!user) {
        return res.render('auth/confirmAccount', {
            page: 'Error al confirmar tu cuenta',
            message: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true
        })
    }

    //Verify user
    user.token = null
    user.confirmed = true,
    await user.save();

    res.render('auth/confirmAccount', {
        page: 'Cuenta Confirmada',
        message: 'La cuenta se confirmo Correctamente',
        
    })
   

}

const formForgotPassword =  (req, res) =>{
    res.render('auth/forgotPassword', {
        page: 'Recuperar contraseña',
        csrfToken: req.csrfToken(),
    })
}

const resetPassword = async(req, res) => {
    //Validation
    await check('email').isEmail().withMessage('Esto no es una direccion de correo electrónico').run(req)

    let result = validationResult(req)

    //Check the result
    if(!result.isEmpty()){
        //Errors
        return res.render('auth/forgotPassword', {
            page: 'Recuperar contraseña',
            csrfToken: req.csrfToken(),
            errors: result.array()
        })  
    }

    //Search user
    const { email } = req.body
    
    const user = await User.findOne({where: {email}})

    if(!user) {
        return res.render('auth/forgotPassword', {
            page: 'Recuperar contraseña',
            csrfToken: req.csrfToken(),
            errors: [{msg: "El Email no pertenece a ningun usuario"}]
        })
    }

    //Generate token and send email
    user.token = generateId();
    await user.save();

    //Send Email
    emailForgotPassword({
        email: user.email,
        nombre: user.name,
        token: user.token
    })

    //Render a message
    res.render('templates/message', {
        page: 'Reestablece tu contraseña',
        message: 'Hemos Enviado un Email con las instrucciones'
    })
}

const checkToken = async (req, res, ) => {

    const { token } = req.params;

    const user = await User.findOne({ where : {token} })
    if(!user) {
        return res.render('auth/confirmAccount', {
            page: 'Reestablece tu contraseña',
            message: 'Hubo un error al validar tu informacion, intenta de nuevo',
            error: true
        })
    }

    //Show form
    res.render('auth/resetPassword', {
        page: 'Restablecer contraseña',
        csrfToken: req.csrfToken(),


    })
}

const newPassword = async (req, res) => {
    //Validate password
    await check('password').isLength({min: 6}).withMessage('La contraseña debe ser de al menos 6 caracteres').run(req)

    let result = validationResult(req)

    //Check the result
    if(!result.isEmpty()){
        //Errors
        return res.render('auth/resetPassword', {
            page: 'Restablecer contraseña',
            csrfToken: req.csrfToken(),
            errors: result.array(),
        })  

    }

    const { token } = req.params
    const { password } = req.body;

    //Identify where the change comes from
    const user = await User.findOne({ where : {token}})

    //Hash new password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash( password, salt);
    user.token = null;

    await user.save();

    res.render('auth/confirmAccount', {
        page: 'Contraseña reestablecida',
        message: 'La contreaseña se guardo correctamente',
        
    })
}

export {
    formLogin,
    authenticate,
    formRegister,
    register,
    signOff,
    checkAccount,
    formForgotPassword,
    resetPassword,
    checkToken,
    newPassword,

}