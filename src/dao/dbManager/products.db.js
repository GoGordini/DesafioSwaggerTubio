//Si tuviera solo DB, esta capa se puede obviar y que las consultas a la DB se hagan directamente de repository.

import {productsModel} from "./models/products.model.js";

export default class Products {
constructor (){
}

getAll = async ()=>{
const products = await productsModel.find().lean();
return products;
}

getProductById = async (id) => {
    const product = await productsModel.findOne({_id:id}).lean();
    return product;
}

update = async (pid,product) =>{
    const result = await productsModel.updateOne({_id:pid},product);
    return result;
}

delete = async (pid) =>{
    const result = await productsModel.deleteOne({_id:pid});
    return result;
}

save = async (product) => {
    const productAlreadyExists= await productsModel.findOne({code:product.code})
    const result = !productAlreadyExists && await productsModel.create(product);
    return result;
    }

};