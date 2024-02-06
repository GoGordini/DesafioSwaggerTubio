import usersModel from "./models/users.model.js";
        
export default class Users {
constructor (){
}

getUserByEmail = async (email) => {
    const user = await usersModel.findOne({email}).lean();
    return user;
}

getUserById = async (uid) => {
    const user = await usersModel.findOne({_id:uid}).lean();
    return user;
}

updatePremiumStatus = async (uid,role) =>{
    const user = await usersModel.updateOne({_id:uid},{$set:{role:role}});
    return user;
}

save = async (user) => {
const result = await usersModel.create(user);
return result;
}
}