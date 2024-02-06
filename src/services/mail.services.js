import nodemailer from 'nodemailer';
import configs from '../config.js';

const transporter=nodemailer.createTransport({
 	service:"gmail",
 	port: 587, //lo indica gmail
 	auth:{
     user:configs.userNodemailer,
     pass:configs.passwordNodemailer} //sin espacios
 })

export const sendEmail = async (email) => {
    await transporter.sendMail({
        from: 'GordiniApp',
        to: email,
        subject: "Solicitud Para Restablecer Contraseña",
        html:`<!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Restablecer Contraseña</title>
        </head>
        <body>
        
            <div>               
                <p>Haga clic en el siguiente botón para restablecer su contraseña:</p>
                <a href="http://localhost:8080/reset" style="text-decoration: none; color: white;">
                    <button style="background-color: #007BFF; color: white; padding: 10px; border: none; cursor: pointer;">Restablecer Contraseña</button>
                </a>
            </div>        
        </body>
        </html>`,
        attachments:[]
    });
}