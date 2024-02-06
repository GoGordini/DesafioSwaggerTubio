//Esto es para probar custom routers, no es parte del proyecto en sí.

import { Router as expressRouter } from 'express';
import passport from 'passport';
//import jwt from 'jsonwebtoken';
import { accessRolesEnum,passportStrategiesEnum } from '../config/enums.js';

export default class Router {
    constructor() {
        this.router = expressRouter();
        this.init(); //es que nuestra padre tenda la definición del método y las clases hijas tengan la implementación
    }

    getRouter() {
        return this.router;
    }

    init() {}

    //get, post, put, delete, patch
    //router.get('/users', middlewares, callback (req, res) => {})
    //(1, 2, 3, 4, 5, 6, 7)
    //[1,2,3,4, 5,6,7]
    get(path, policies,strategy,...callbacks) {
        this.router.get(
            path,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }
    
    post(path, policies, strategy,...callbacks) {
        this.router.post(
            path,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    applyCallbacks(callbacks) {
        //mapear los callbacks 1 a 1, obteniedo sus parámetros (req, res)
        return callbacks.map((callback) => async (...params) => {
            try {
                //apply, va a ajecuttar la función callback, a la instancia de nuestra clase que es el router
                await callback.apply(this, params);
            } catch (error) {
                params[1].status(500).json({ status: 'error', message: error.message })
            }
        }) //[req, res]
    }

    applyCustomPassportCall = (strategy) => (req, res, next) => {
        if (strategy === passportStrategiesEnum.JWT) {
            //custom passport call
            passport.authenticate(strategy, function (err, user, info) {
                if(err) return next(err);

                if(!user) {
                    return res.status(401).send({
                        error: info.messages ? info.messages : info.toString()
                    })
                }

                req.user = user;
                next();
            })(req, res, next);
        } else {
            next();
        }
    }

    handlePolicies = (policies) => (req, res, next) => {
        // ['PUBLIC']
        if(policies[0] === accessRolesEnum.PUBLIC) return next();
        // Lo de abajo lo hace passport directamente.

        // const authToken = req.headers['authorization'];
            // if(!authToken)
            //     return res.status(401).json({ error: 'no token provide' });
            // //Bearer JSDFKSJADFHK23453W54
            // const token = authToken.split(" ")[1];
            // const user = jwt.verify(token, 'secretCoder');
            // // {
            // //     email: 'user@gmail.com',
            // //     role: 'ADMIN'
            // // }
            const user = req.user;

            if(!policies.includes(user.role.toUpperCase()))
                return res.status(403).json({ error: 'not permissions' });

        //req.user = user;
        next();
    }
    generateCustomResponse = (req, res, next) => {
        res.sendSuccess = (data) => {
            res.status(200).json({ data });
        };

        res.sendSuccessNewResourse = (data) => {
            res.status(201).json({ data });
        };
        
        res.sendServerError = (error) => {
            res.status(500).json( { error } )
        };

        res.sendClientError = (error) => {
            res.status(400).json({ error });
        };

        next();
    }
}
