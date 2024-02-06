import {getProduct as getProductService, getProductById as getProductByIdService,deleteProduct as deleteProductService, createProduct as createProductService, updateProduct as updateProductService} from "../services/products.service.js";
import {generateProduct} from "../utils.js";
import CustomError from '../middlewares/errors/CustomError.js';
import EErrors from '../middlewares/errors/enums.js';

export const getProduct= async (req, res) => {
    try{
    const products = await getProductService();
    return res.send({status: "success", payload:products})}
    catch(error) {return res.send({ status: 'error', error: error })}
}

export const getProductById=async(req,res)=>{
    try{
        const {pid} =req.params;
        const product = await getProductByIdService(pid)
        if (!product){
            return res.status(404).send({status:"error",message:"Product not found"})
        }
        res.send({status:"success",payload:product});
    }
    catch(error){
        res.status(500).send({error:error.message});}
}

export const deleteProduct = async (req,res)=>{
    try {
    const {pid} =req.params;
    const product = await getProductByIdService(pid)
    if (product.owner!=req.user.email && req.user.role!="admin"){
        return res.status(403).send({status:"error",message:"Forbidden. You do not own this product."})
    }
    if (!product){
        return res.status(404).send({status:"error",message:"Product not found"})
    }
    const result = await deleteProductService(pid);
    const io = req.app.get('socketio'); //esto no sé en qué capa debería ir.
    io.emit("showProducts", {products: await getProductService()}); //esto no sé en qué capa debería ir.
    res.send({status:"success",payload:result});
    }
    catch(error) {
    res.status(500).send({status:"error",message:error.message})}
    }

export const createProduct= async (req,res)=>{
        try {
        const {title,description,price,thumbnail,code,category,stock,status,owner} = req.body;
        const io = req.app.get('socketio');
        //va segunda la variable que quiero definir, primero va como la recibo.
        // if (!title || !description || !price || !code || !category || stock === null || stock === undefined || stock === '') {
        // return res.status(400).send({status:"error", message:"incomplete values"})};
        if (!title || !description || !price || !code || !category || stock === null || stock === undefined || stock === '') {
            throw CustomError.createError({
                name: 'ProductError',
                cause: 'Invalid data types: title (string), description (string), price (number), code (string), category (string) and stock (number) are required',
                message: 'Error trying to create product',
                code: EErrors.INVALID_TYPE_ERROR
            })
        }
        if (owner!="admin" && owner!=req.user.email && owner!=null){
            throw CustomError.createError({
                name: 'ProductError',
                cause: 'owner should be your email address (default "admin")',
                message: 'Error trying to create product',
                code: EErrors.INVALID_TYPE_ERROR
            })
        }
        const product = {title,description,price,thumbnail,code,category,stock,status,owner}
        const result = await createProductService(product);
        if (!result) {return res.status(400).send({status:"error",message:"product already exists"})};
        const products=await getProductService();
        io.emit("showProducts", {products:products});
        res.status(201).send({status:"success",payload:result});
        }
        catch(error) {
        res.status(500).send({status:"error",message:error.cause})}
        }
export const updateProduct=async (req,res)=>{
            try {
            const {title,description,price,thumbnail,code,category,stock,status} = req.body;
            const {pid} =req.params;
            const productFound = await getProductByIdService(pid)
            if (!productFound){
                return res.status(404).send({status:"error",message:"Product not found"})
            }
            const io = req.app.get('socketio');
            //va segunda la variable que quiero definir, primero va como la recibo.
            // if (!title || !description || !price || !code || !category || stock === null || stock === undefined || stock === '') {
            // return res.status(400).send({status:"error", message:"incomplete values"})};
            const product = {title,description,price,thumbnail,code,category,stock,status}
            const result = await updateProductService(pid,product);
            const products=await getProductService();
            io.emit("showProducts", {products:products});
            res.status(201).send({status:"success",payload:result});
            }
            catch(error) {
            res.status(500).send({status:"error",message:error.message})}
            }

export const mockingProducts= async (req, res) => {
                let products = [];
            
                for(let i=0; i < 100; i++) {
                    products.push(generateProduct());
                }
            
                res.send({
                    status: 'ok',
                    counter: products.length,
                    data: products
                });
            }