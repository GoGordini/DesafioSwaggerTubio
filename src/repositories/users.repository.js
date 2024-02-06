import UsersDto from '../DTO/users.dto.js';

// export default class UsersRepository {
//     constructor (dao){
//         this.dao=dao;
//     }

//     getUsers = async() => {
//         const result = await this.dao.get();
//         return result;
//     }

//     createUser = async (user) => {
//         const userToInsert = new UsersDto(user);
//        // const result = await this.dao.create(userToInsert);
//         return userToInsert;
//     }
// }

//recibe como parámetro el dao con el que nos vamos a conectar. Luego hago la implementación del CRUD.
//En el router, en lugar de importar 

export default class UsersRepository {
    constructor (dao){
        this.dao=dao;
    }

        getUserByEmailRepository = async (email) => {
            const user = await this.dao.getUserByEmail(email);
            const userToReturn = new UsersDto(user);
            return userToReturn;
        }     
        
        getUserByIdRepository = async (uid) => {
            const user = await this.dao.getUserById(uid);
            return user;
        }    
        
        updatePremiumStatusRepository = async (uid,role) =>{
            const user= await this.dao.updatePremiumStatus(uid,role);
            return user;
        }

        saveRepository = async () => { 
            const result = await this.dao.save();
            return result;
        }
                
}

// (req, res) => {
//     const data = new UsersDto(req.user);
//     res.send({ status: 'success', payload: data });
// }
