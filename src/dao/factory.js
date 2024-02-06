import configs from '../config.js';

const persistence = configs.persistence;

let CartManager;
let ProductManager;
let ChatManager;
let UserManager;
let TicketManager;

switch(persistence) {
    case 'DB':
        console.log('Persistence: DB');
        //Import dinámicos
        //const mongoose = await import('mongoose');
        //await mongoose.connect(configs.mongoUrl); //solo conecta si uso DB
        const { default: ProductsDB } = await import('./dbManager/products.db.js'); //alias del export default class.
        ProductManager = ProductsDB; //exporto el DAO
        const { default: CartsDB } = await import('./dbManager/carts.db.js');
        CartManager = CartsDB;
        const { default: ChatDB } = await import('./dbManager/chat.db.js');
        ChatManager = ChatDB;
        const { default: UsersDB } = await import('./dbManager/users.db.js');
        UserManager = UsersDB;
        const { default: TicketsDB } = await import('./dbManager/tickets.db.js');
        TicketManager = TicketsDB;
        break;
    case 'File':
        console.log('Persistence: File');
        const { default: ProductsFile } = await import('./fileManager/products.file.js');
        ProductManager = ProductsFile;
        const { default: CartsFile } = await import('./fileManager/carts.file.js');
        CartManager = CartsFile;
        const { default: ChatFile} = await import('./fileManager/chat.file.js');
        ChatManager = ChatFile;
        const { default: UsersFile } = await import('./dbManager/users.db.js');
        UserManager = UsersFile;
        const { default: TicketsFile } = await import('./dbManager/tickets.db.js');
        TicketManager = TicketsFile;
        break;
}

export {
    ProductManager,
    CartManager,
    ChatManager,
    UserManager,
    TicketManager
}