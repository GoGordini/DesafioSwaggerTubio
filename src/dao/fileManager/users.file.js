import fs from 'fs';
import {v4 as uuidv4} from "uuid";

export default class UserManager {

    constructor(path){
        this.path=path;
    }

    getUserByEmail=async (email)=>{
                    const users = await this.getAll();
                    const user_found=users.find((user) => user.email===email);
                    return user_found;
                    };
    
    save = async (user) =>{
            const users = await this.getAll();
            const user_found=users.find((usuario) => usuario.email===user.email);
            if (user_found){
                return "User already exists"
            };
            user._id= uuidv4().replace(/-/g, '').substring(0, 24);
            users.push(user);
            await fs.promises.writeFile(this.path, JSON.stringify(users, null, '\t'));
            return user;}
           
}