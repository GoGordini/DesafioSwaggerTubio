import {getUserCurrent as getUserCurrentService, getUserById as getUserByIdService, updatePremiumStatus as updatePremiumStatusService} from "../services/users.service.js";

export const getUserCurrent= async (req, res) => {
    try{
    const email=req.user.email;
    const user = await getUserCurrentService(email);
    return res.status(200).send({status: "success", payload:user})}
    catch(error) {return res.send({ status: 'error', error: error })}
}

export const updatePremiumStatus= async (req, res) => {
    try{
    const {uid} =req.params;
    const user = await getUserByIdService(uid);
    if (!user){
        return res.status(404).send({status:"error",message:"User not found"})
    }
    if (user.role=="admin"){
        return res.status(404).send({status:"error",message:"User is Admin"})
    }
    const role = (user.role=="user")? ("premium") : ("user");
    const result = await updatePremiumStatusService(uid,role);
    return res.status(200).send({status: "success", payload:result})}
    catch(error) {res.status(500).send({error:error.message})}
}
