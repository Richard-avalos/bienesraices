import nodemailer from 'nodemailer'

const emailverification  = async (data) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

    const {name, email, token} = data

    //Send email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta en bienesRaices.com',
        text: 'Confirma tu cuenta en bienesRaices.com',
        html: `
            <p>Hola ${name}, comprueba tu cuenta en bienesRaices.com</p>

            <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/checkAccount/${token}">Confirmar tu cuenta</a> </p>

            <p>Si tu no has creado esta cuenta, puedes ignorar este mensaje</p>
        `
    })
}

const emailForgotPassword = async (data) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

    const {name, email, token} = data

    //Send email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Reestablece tu contraseña en bienesRaices.com',
        text: 'Reestablece tu contraseña en bienesRaices.com',
        html: `
            <p>Hola ${name}, has solicitado reestablecer tu contraseña en bienesRaices.com</p>

            <p>Sigue el siguiente enlace para genera una contraseña nueva:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/forgotPassword/${token}">Restablecer contraseña</a> </p>

            <p>Si tu no has solicitado el cambio de contraseña, puedes ignorar este mensaje</p>
        `
    })
}

export {
    emailverification,
    emailForgotPassword,
}