import { fileURLToPath } from 'url';
import { dirname,join } from 'path';
import bcrypt from "bcrypt";
import configs from "./config.js";
import jwt from 'jsonwebtoken';
import { faker as faker } from '@faker-js/faker';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const __mainDirname = path.join(__dirname, '..'); ////asdasd/asdasdasd/asdasd/RecursosBackend-Adoptme
//hace un back

export const productPath = join (__dirname,"./files/productos.json");
export const  cartPath = join (__dirname, "./files/carritos.json")
export const  chatPath = join (__dirname, "./files/chats.json")
export const  userPath = join (__dirname, "./files/users.json")

//1. hashear nuestra contraseña
export const createHash = password => //paso como parámetro password a hashear
        bcrypt.hashSync(password, bcrypt.genSaltSync(10)); //primer parámetro es lo que quiero hashear, segundo el número de rondas de hasheo (se recomienda 10)
    //1234
    //ASDASD435@#$#$

//2. validar nuestro password
export const isValidPassword = (plainPassword, hashedPassword) => //plainpassword es lo que valida el usuario, hashedpassword es lo que ya tenemos guardado hasheado.
    bcrypt.compareSync(plainPassword, hashedPassword);

export const generateToken = (user) => {
        const token = jwt.sign({ user }, configs.privateKeyJWT, { expiresIn: '1h' });
        return token;
    }
//Autenticación primer paso lo hace passport
//req.user = {}
export const authorization = (role) => {
    return async (req, res, next) => {
        if(req.user.role !== role) {
            if (!role.includes(req.user.role)) {return res.status(403).send({ status: 'error', message: 'no permissions' })}}
        next();
    }
}

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.url(),
        code: faker.string.alphanumeric(10),
        category: faker.commerce.department(),
        stock: faker.number.int(1),
        id: faker.database.mongodbObjectId(),
        status: faker.datatype.boolean()
        //role: faker.helpers.arrayElement(['cliente', 'vendedor']), //cliente, vendedor
        
        
    }
}