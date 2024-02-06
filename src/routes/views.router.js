import {Router} from "express";
import passport from "passport";
const router = Router();
import { productPath,authorization,chatPath,cartPath } from '../utils.js';
//import ProductManager from '../dao/dbManager/products.db.js';
//import ChatManager from "../dao/fileManager/chat.file.js"
import { ProductManager, ChatManager,CartManager } from '../dao/factory.js';
import {mockingProducts} from '../controllers/products.controller.js';
import { generateProduct } from "../utils.js";

//import ChatManager from "../dao/dbManager/chat.db.js";
//import CartManager from "../dao/dbManager/carts.db.js";
import { productsModel } from "../dao/dbManager/models/products.model.js";
import {accessRolesEnum} from "../config/enums.js";

const productManager= new ProductManager(productPath);
const chatManager= new ChatManager(chatPath);
const cartManager= new CartManager(cartPath);

const publicAccess = (req, res, next) => {
   // if(req.user) return res.redirect('/');
    next();
}
// middleware para ver si esá logueado o no. Si no está creado el atributo user es porque no inició sesión. Si inició sesión, redirijo al profile (si ya está logueado no mando ni a login ni a register).
// si no está el user, continúa con la ejecución normal (en el registro, ve el formulario de registro y en el login, ve el form de login).

// const privateAccess = (req, res, next) => {
//     if(!req.user) return res.redirect('/login'); //si no tiene user es porque no inició sesión, redirijo al login.
//     next();
// }
//middleware para especificar qué vistas son privadas. En este caso, la única es la vista del perfil.
//Si no inicié sesión, me manda al login.

//RUTAS DE PRODUCTOS
router.get("/realtimeproducts",redirectToLogin,async(req,res)=>{
   try{
    const products = await productManager.getAll();
    res.render("realTimeProducts",{products:products});}
    catch(error) {return res.send({ status: 'error', error: error })}
})

// router.get('/mockingproducts', mockingProducts);
router.get('/mockingproducts',async(req,res)=>{
    try{
        let products = []; 
        for(let i=0; i < 100; i++) {
            products.push(generateProduct());
        }
     res.render("realTimeProducts",{products:products});}
     catch(error) {return res.send({ status: 'error', error: error })}
 })

 router.get('/loggerTest', (req, res) => {
    req.logger.fatal('prueba fatal');
    req.logger.error('prueba error');
    req.logger.warning('prueba warning');
    req.logger.info('prueba info');
    req.logger.http('prueba http');
    req.logger.debug('prueba debug');

    res.send({ result: 'OK' });
});

router.get("/products",redirectToLogin,async (req,res)=>{
    try{
     const {page=1,limit=10,sort,queryValue,query} = req.query; 
     //si no manda nada, asumo page 1 y limit 10.
     const filtered = (query=="price"||query=="stock")?({[query]: { $gt: queryValue }}):((queryValue)? {[query]:{$regex: queryValue,$options:"i"}} : {});
     const sorted = sort? ({price:sort}) : ({});
     const {docs,hasPrevPage,hasNextPage,nextPage,prevPage}=await productsModel.paginate(filtered,{sort:sorted,page,limit,lean:true})
        //flags para saber si botón hacia adelante o hacia atrás. 
        //primer parámetro de paginate filtro de búsqueda; segundo parámetro parámetros de paginación. Limit fijado en 5, page viene del query. Lean por el POJO.
        const prevLink=queryValue? `/products?page=${prevPage}&limit=${limit}&queryValue=${queryValue}&query=${query}`:`/products?page=${prevPage}&limit=${limit}`;
        const nextLink = queryValue? `/products?page=${nextPage}&limit=${limit}&queryValue=${queryValue}&query=${query}`:`/products?page=${nextPage}&limit=${limit}`;
        //console.log(req.session.user);
        res.render("home",{
            products:docs,
            //objeto products lo obtengo de docs
            user:req.user,
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage,
            limit,
            query,
            queryValue,
            prevLink,
            nextLink
        });}
        catch(error) {return res.send({ status: 'error', error: error })}
    });
router.get("/home",redirectToLogin,async (req,res)=>{
        try{
            const {page=1,limit=10,sort} = req.query;
            //si no manda nada, asumo page 1 y limit 10.
    //        const {docs,hasPrevPage,hasNextPage,nextPage,prevPage}=await productsModel.paginate({},{sort:{price:1},page,limit,lean:true})
            const {docs,hasPrevPage,hasNextPage,nextPage,prevPage,totalPages}=await productsModel.paginate({},{sort:{price:sort},page,limit,lean:true});
            //flags para saber si botón hacia adelante o hacia atrás. 
            //primer parámetro de paginate filtro de búsqueda; segundo parámetro parámetros de paginación. Limit fijado en 5, page viene del query. Lean por el POJO.
            //const products = await productManager.getAll();
            const prevLink = hasPrevPage ? `/?page=${prevPage}&limit=${limit}` : null;
            const nextLink= hasNextPage ? `/?page=${nextPage}&limit=${limit}` : null;
            res.send({status:"success",payload:docs,hasPrevPage,hasNextPage,nextPage,prevPage,totalPages,page,prevLink,nextLink
            });}
            catch(error) {return res.send({ status: 'error', error: error })}
        });

//RUTA DE CARRITO
router.get("/carts/:cid",async(req,res)=>{
        try{
            const cid = req.params.cid;
            const cart = await cartManager.getCartById(cid);
            res.render("cart",{cart});
        }
        catch(error){
            console.error(error.message);
        }
    });

//RUTA DE CHAT
router.get("/chat",redirectToLogin,authorization(accessRolesEnum.USER),async(req,res)=>{
    const messages = await chatManager.getAll();
    res.render("chat",{messages});
})

//RUTAS DE USUARIOS
//register y login son de acceso público; aplico el middleware publicAccess.
router.get('/register', (req, res) => {
    res.render('register')
});

router.get('/login', (req, res) => {
    res.render('login')
});

router.get('/restore', (req, res) => {
    res.render('restore')
});

router.get('/failed-restore', (req, res) => {
    res.render('restoreFailed')
});

router.get('/restore-success', (req, res) => {
    res.render('restoreSuccess')
});

router.get('/reset', redirectToReset,(req, res) => {
    res.render('reset')
});
//acá aplico el middleware privateAccess.
router.get('/', redirectToLogin, (req, res) => {
    res.render('profile', {
        user: req.user
    })
});

function redirectToLogin(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err || !user) {
        // Redirige a la ruta de login si la autenticación falla
        return res.redirect('/login');
      }
      req.user = user;
      return next();
    })(req, res, next);
  }

  function redirectToReset(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err || !user) {
        // Redirige a la ruta de login si la autenticación falla
        return res.redirect('/restore');
      }
      req.user = user;
      return next();
    })(req, res, next);
  }
// router.get('/', passport.authenticate("jwt",{session:false}), (req, res) => {
//     res.render('profile', {
//         user: req.user
//     })
// });
export default router;


