//Solo para Github. Con ruta api/users/ no anda el callback.

import { Router } from 'express';
import passport from 'passport';
import {passportStrategiesEnum,accessRolesEnum} from "../config/enums.js";
import { config } from 'dotenv';
import { generateToken,authorization} from '../utils.js';

const router = Router();

//Redirige para que nos autentiquemos con github.
router.get('/github', passport.authenticate(passportStrategiesEnum.GITHUB, {scope: ['user:email']}), async(req, res) => {
    res.send({ status: 'success', message: 'user registered' }); //dentro del middleware pongo "github" porque en passport.use lo llamé github. El scope tb viene de ahí.
});

//callback para que una vez autenticados con github, nos redireccione a nuestra app.
router.get('/github-callback', passport.authenticate(passportStrategiesEnum.GITHUB, { failureRedirect: '/login' }), async(req, res) => {
  //  req.session.user = req.user; //en la ruta de arriba la parte de api/sessions no hace falta. La parte de session no cambia.
//   req.session.user = {
//     first_name: req.user.first_name,
//     last_name: req.user.last_name,
//     email: req.user.email,
//     age: req.user.age,
//     cart: req.user.cart,
//     isAdmin:(req.user.email=="adminCoder@coder.com")
// }  
    req.newUser=req.user
    req.newUser = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
    cart: req.user.cart,
    isAdmin:(req.user.email=="adminCoder@coder.com"),
    role: req.user.role
}  
    const accessToken=generateToken(req.newUser);
    res.cookie('coderCookieToken', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }).redirect('/products');
});


export default router;