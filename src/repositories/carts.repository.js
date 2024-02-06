export default class CartsRepository {
    constructor (dao){
        this.dao=dao;
    }

    getAllRepository = async ()=>{
        const carts = await this.dao.getAll();
        return carts;
        }
        
    getCartByIdRepository = async (id) => {
        const cart = await this.dao.getCartById(id);
        return cart;
        }
        
    updateRepository = async (cid,products) =>{
        const result = await this.dao.update(cid,products);
        return result;
        }
        
    deleteRepository = async (cid) =>{
        const result = await this.dao.delete(cid);
        return result;
        }
            
    deleteProductRepository = async (cid,pid) =>{
        const result = await this.dao.deleteProduct(cid,pid);
        return result
        }

    saveRepository = async () => { //Crea carrito vacío
        const result = await this.dao.save();
        return result;
        }
                
}