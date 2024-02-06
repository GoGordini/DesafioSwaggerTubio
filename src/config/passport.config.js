import passport from 'passport';
import jwt from "passport-jwt";
import local from 'passport-local'; 
import usersModel from '../dao/dbManager/models/users.model.js';
import { createHash, isValidPassword,cartPath } from '../utils.js';
import GitHubStrategy from 'passport-github2';
import CartManager from "../dao/dbManager/carts.db.js";
import configs from "../config.js";
import {passportStrategiesEnum} from "./enums.js"
import {UserManager} from "../dao/factory.js";

const userManager= new UserManager();
const cartManager = new CartManager(cartPath);
const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt; //define de dónde extrae el token de acceso.

const initializePassport = () => {
    //Implementación de nuestro mecanismo de autenticación con github
    passport.use(passportStrategiesEnum.GITHUB, new GitHubStrategy({ //los 3 primeros parámetros salen de la app de git.
        clientID: 'Iv1.e0b3de4024dcd9c8',
        clientSecret: configs.gitHubClientSecret,
        callbackURL: 'http://localhost:8080/api/sessions/github-callback',
        scope: ['user:email'] //esto trae del usuario el email, con los que me estoy logueando en github.
    }, async (accessToken, refreshToken, profile, done) => { //los dos primeros por ahora no los uso, son para JWT.
        try {
          // console.log(profile); //el profile me llega de github
            // {
                    // _json: {
                    //     name: 'alex'
                    // }
            //     emails: [{value: 'ap@hotmail.com'}]
            // }
            const carrito = await cartManager.save();
            
            const email = profile.emails[0].value; //en profile llega un atributo que se llama emails: emails: [{value: 'ap@hotmail.com'}]
//            const user = await usersModel.findOne({ email });
            const user = await userManager.getUserByEmail(email);

            if(!user) {
                //crear la cuenta o usuario desde cero. Obtengo lo que puedo de Github.  _json: { name: 'alex' }
                const newUser = {
                    first_name: profile._json.login,
                    last_name: ' ', //no viene de github
                    age: 5000, //no viene de github, pongo algo por defecto.
                    email,
                    cart: carrito._id,
                    password: ' ' //no la necesito con este mecanismo de aut, por eso seteo vacío.
                }

                //const result = await usersModel.create(newUser);
                const result = await userManager.save(newUser);
                return done(null, result); //req.user {first,last,age,email}
            } else {
                return done(null, user);
            }
        } catch (error) {
            
            return done(`Incorrect credentials`)
        }
    }));

passport.use(passportStrategiesEnum.REGISTER, new LocalStrategy({ //segundo parámetro es la estrategia
        passReqToCallback: true, //permite acceder al objeto request como cualquier otro middleware
        usernameField: 'email' //porque no tenemos un username sino un email
    }, async (req, username, password, done) => {
        try {
            const { first_name, last_name, age, cart } = req.body; //obvio email y password porque ya los tengo de dos líneas antes
            if (!first_name|| !last_name || !username || !age || !password) {
                return done(null,false);
            }
            //const user = await usersModel.findOne({ email: username }); //el email no vino en el body como tal sino que tengo el username.
            const user = await userManager.getUserByEmail(username);
            if(user) {
                return done(null, false); //null es sin errores es la búsqueda, false es que no pudo autenticar porque el email ya existe.
            }

            const userToSave = {
                first_name,
                last_name,
                email: username,
                age,
                password: createHash(password),
                cart,
                role: username==="adminCoder@coder.com"? ("admin") : ("user")
            }

            //const result = await usersModel.create(userToSave);
            const result = await userManager.save(userToSave);
            return done(null, result); //req.user {first,last,age,email}. Passport genera el user dentro de request con esos atributos.
        } catch (error) {
            return done(`Incorrect credentials`)
        }
    }));

 passport.use(passportStrategiesEnum.LOGIN, new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            //const user = await usersModel.findOne({ email: username });
            const user = await userManager.getUserByEmail(username);
            if(!user || !isValidPassword(password, user.password)) {
                return done(null, false)
            }
        
 return done(null, user); //req.user

        } catch (error) {
            return done(`Incorrect credentials`)
        }      
    }));

passport.use(passportStrategiesEnum.CURRENT, new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: configs.privateKeyJWT
    }, async(jwt_payload, done) => {
        // {
        //     "user": {
        //       "name": "prueba",
        //       "email": "prueba@gmail.com"
        //     }
        //   }
        try {
            // if(!jwt_payload.test) {
            //     return done(null, false, { messages: 'error invalid attribute' });
            // }

            return done(null, jwt_payload.user); //req.user
        } catch (error) {
            return done(error);
        }
    }))

// passport.use(passportStrategiesEnum.JWT, new JWTStrategy({
//         jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),//de dónde obtengo el jwt: de los headers, con un método de passport.
//         secretOrKey: configs.privateKeyJWT//con qué firmo o hago las validaciones de JWT
//     }, async(jwt_payload, done) => {
//         try {
//             return done(null, jwt_payload.user)//req.user
//         } catch (error) {
//             return done(error);
//         }
//     }))

//Serializaccion y DeSerializaccion
 passport.serializeUser((user, done) => {
        done(null, user._id); //almacena el id del usuario para poder consultarlo si hace falta. No hay error (solo setea id), almacena el user._id.
    });

 passport.deserializeUser(async(id, done) => { //busca en la DB el user en cuestión por id.
        const user = await usersModel.findById(id);
        done(null, user); //no hay error. Una vez que lo tengamos, retorna el user con todos sus datos a partir del id que le corresponde.
    })
}

const cookieExtractor = req => {
    let token = null;
    if(req && req.cookies) {
        token = req.cookies['coderCookieToken'];
    }
    return token;
}

export const passportCall = (strategy) => {
    return async(req, res, next) => {
        passport.authenticate(strategy, { session: false }, function(err, user, info) {
            if(err) return next(err);
            if(!user) {
                return res.status(401).send({ status: 'error', error: info.messages ? info.messages : info.toString() })
            }
            req.user = user;
            next();
        })(req, res, next);
    }}

export {
    initializePassport
}