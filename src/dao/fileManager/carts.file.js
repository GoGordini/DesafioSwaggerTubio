import fs from 'fs';
import {v4 as uuidv4} from "uuid";
import { productPath } from '../../utils.js';

export default class CartManager {

    constructor(path){
        this.path=path;
    }

    getAll = async ()=> {        
                if (fs.existsSync(this.path)) {
                    const data = await fs.promises.readFile(this.path, 'utf-8');
                    const carts = JSON.parse(data);
                    return carts;
                } else {
                    return [];
        }
    }
    
    getCartById=async (id_buscada)=>{
            const carts = await this.getAll();
            const cart_found=carts.find((carrito) => carrito._id===id_buscada)
            return cart_found;       
            };
    
    delete=async (id_a_eliminar)=>{
                const carts = await this.getAll();
                const cartIndex = carts.findIndex(carrito => carrito._id === id_a_eliminar);
                if(cartIndex===-1){
                    return "Cart not found"
                };
                const carritoEliminado=carts.splice(cartIndex,1);
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
                return carritoEliminado;
                };

    update=async (id,productos)=>{
                    const carts = await this.getAll();
                    const cartIndex = carts.findIndex(carrito => carrito._id === id);
                    if(cartIndex===-1){
                        return "Cart not found"
                    };                    
                    carts[cartIndex].products=productos.products;
                    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
                    return carts[cartIndex];
                    };
    
    updateOne=async (id,pid,productos)=>{
                        const carts = await this.getAll();
                        const cartIndex = carts.findIndex(carrito => carrito._id === id);
                        if(cartIndex===-1){
                            return "Cart not found"
                        };        
                        if (productos.length===1){
                            productos[0].product={_id:pid};
                        } else {
                        productos[productos.length-1].product={_id:pid}};
                        carts[cartIndex].products=productos;
                        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
                        return carts[cartIndex];
                        };

    save = async () =>{ //Crea carrito vacío
                        const cart = {_id: uuidv4().replace(/-/g, '').substring(0, 24),products:[]}
                        const carts = await this.getAll();
                        carts.push(cart);
                        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
                        return cart;
                }
}