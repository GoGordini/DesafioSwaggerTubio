import {cartsModel} from "./models/carts.model.js";
        
export default class Carts {
constructor (){
}

getAll = async ()=>{
const carts = await cartsModel.find().lean();
return carts;
}

getCartById = async (id) => {
    const cart = await cartsModel.findOne({_id:id}).lean();
    return cart;
}

update = async (cid,products) =>{
    const result = await cartsModel.updateOne({_id:cid},products);
    return result;
}

// updateOne = async (cid,pid,productos) =>{
//     const result = await cartsModel.updateOne({_id:cid},productos);
//     return result;
// }

delete = async (cid) =>{
    const result = await cartsModel.updateOne({_id:cid},{$set:{products:[]}});
    return result;
}

deleteProduct = async (cid,pid) =>{
     const result = await cartsModel.updateOne({_id:cid},{$pull:{products:{product:{_id:pid}}}});
     return result
 }

save = async () => { //Crea carrito vacío
const result = await cartsModel.create({});
return result;
}


}