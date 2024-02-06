import { UserManager } from '../dao/factory.js';
import { userPath } from '../utils.js';
import  UserManagerRepository  from '../repositories/users.repository.js';
const userManager = new UserManager(userPath);
const userManagerRepository= new UserManagerRepository(userManager);

export const getUserCurrent= async (email) => {
    const user = await userManagerRepository.getUserByEmailRepository(email);
    return user;
}

export const getUserById= async (uid) => {
    const user = await userManagerRepository.getUserByIdRepository(uid);
    return user;
}

export const updatePremiumStatus= async (uid,role) => {
    const user = await userManagerRepository.updatePremiumStatusRepository(uid,role);
    return user;
}