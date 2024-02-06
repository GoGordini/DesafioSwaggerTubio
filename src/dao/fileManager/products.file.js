import fs from 'fs';
import {v4 as uuidv4} from "uuid";

export default class ProductManager {

    constructor(path){
        this.path=path;
    }

    getAll = async ()=> {
        
                if (fs.existsSync(this.path)) {
                    const data = await fs.promises.readFile(this.path, 'utf-8');
                    const products = JSON.parse(data);
                    return products;
                } else {
                    return [];
                }
                }
    getProductById=async (id_buscada)=>{
                    const products = await this.getAll();
                    const product_found=products.find((producto) => producto._id===id_buscada);
                    return product_found;
                    };
    
    delete=async (id_a_eliminar)=>{
                const products = await this.getAll();
                const productIndex = products.findIndex(producto => producto._id === id_a_eliminar);
                if(productIndex===-1){
                    return "Product not found"
                };
                const productoEliminado=products.splice(productIndex,1);
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
                return productoEliminado;
                };

    update=async (id,producto)=>{
                    const products = await this.getAll();
                    const productIndex = products.findIndex(producto => producto._id === id);
                    if(productIndex===-1){
                        return "Product not found"
                    };
                    producto._id=id;
                    products[productIndex]=producto;
                    await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
                    return producto;
                    };

    save = async (product) =>{
            const products = await this.getAll();
            const product_found=products.find((producto) => producto.code===product.code);
            if (product_found){
                return "Product already exists"
            };
            product._id= uuidv4().replace(/-/g, '').substring(0, 24);
            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            return product;}
           
}