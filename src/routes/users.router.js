import { Router } from 'express';
import passport from 'passport';
import {passportStrategiesEnum,accessRolesEnum} from "../config/enums.js";
import { config } from 'dotenv';
import { generateToken,authorization,createHash,isValidPassword} from '../utils.js';
import {passportCall} from "../config/passport.config.js";
import {getUserCurrent,updatePremiumStatus} from "../controllers/users.controller.js";
//import {usersSchema} from "../schemas/users.schema.js";
import usersModel from '../dao/dbManager/models/users.model.js';
import {sendEmail} from "../services/mail.services.js" 
const router = Router();


router.post("/register",passport.authenticate(passportStrategiesEnum.REGISTER,{failureRedirect: "fail-register"}), async (req, res) => {
    res.status(201).send({ status: 'success', message: 'user registered' })}) //passport.auth es un middleware. Pongo register, primer parámetro, porque en config puse passport.use("register"). Segundo parámetro es el camino como plan B (si falla va a la ruta fail-register).

router.get('/fail-register', async (req, res) => {
    res.status(500).send({ status: 'error', message: 'register fail' });
});

router.post('/login', passport.authenticate(passportStrategiesEnum.LOGIN, { failureRedirect: 'fail-login' }), async (req, res) => {
    if(!req.user) { //user me lo trae passport
        return res.status(401).send({ status: 'error', message: 'invalid credentials' })
    }
    req.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        cart: req.user.cart,
        isAdmin:(req.user.email==config.mailAdmin),
        role: req.user.role,
    }
    const accessToken=generateToken(req.user);
    res.cookie('coderCookieToken', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }).send({ status: 'success', message: 'login success' })

    //res.send({ status: 'success', message: 'login success',access_token:accessToken })
});

router.get('/current', passportCall("jwt"), authorization(accessRolesEnum.ADMIN),getUserCurrent);

router.get('/fail-login', async (req, res) => {
    res.status(500).send({ status: 'error', message: 'login fail' });
});

router.get('/logout', (req, res) => {
    res.clearCookie("coderCookieToken").redirect('/login');
     //vuelve al login.
    });

router.put('/premium/:uid', updatePremiumStatus);

router.post("/restore",async(req,res)=>{
    try{
        const userEmail=req.body;
        const user = await usersModel.findOne(userEmail);
        if (!user){
            return res.status(404).send({status:"error",message:"User not found"})
        }
        req.user = {
            email: user.email,
        }
        const accessToken=generateToken(req.user);

        await sendEmail(userEmail.email)
    
        return res.cookie('coderCookieToken', accessToken, { maxAge: 1 * 60 * 1000, httpOnly: true }).send({status:"success",message:"Correo Enviado"});
    }
    catch(error){
        res.status(500).send({error:error.message})
    }

})

 router.put("/reset",async(req,res)=>{
    try{
    const { email, password } = req.body;
    const user = await usersModel.findOne({email:email});
    if (!user){
        return res.status(404).send({status:"error",message:"User not found"})
    }
    if(isValidPassword(password, user.password)){
        return res.status(404).send({status:"error",message:"La nueva contraseña debe ser diferente de la anterior"})
    }
    const result= await usersModel.updateOne({email:email},{$set:{password:createHash(password)}})
    return res.clearCookie("coderCookieToken").send({status:"success",payload:result})    
    }catch(error){
        res.status(500).send({error:error.message})
    };
 })

export default router;
