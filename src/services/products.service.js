import { productPath } from '../utils.js';

import  ProductManagerRepository  from '../repositories/products.repository.js';
import { ProductManager } from '../dao/factory.js';

const productManager= new ProductManager(productPath);
const productManagerRepository= new ProductManagerRepository(productManager);

export const getProduct= async () => {
    const products = await productManagerRepository.getAllRepository();
    return products;
}

export const getProductById= async (pid) => {
    const product = await productManagerRepository.getProductByIdRepository(pid)
    return product;
}

export const deleteProduct= async (pid) => {
    const result = await productManagerRepository.deleteRepository(pid);
    return result;
}

export const createProduct= async (product) => {
    const result = await productManagerRepository.saveRepository(product);
    return result;
}

export const updateProduct= async (pid,product) => {
    const result = await productManagerRepository.updateRepository(pid,product);
    return result;
}



