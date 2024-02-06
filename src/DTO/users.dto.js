export default class UsersDto {
    constructor(user) {
        this.name = user.first_name;
        this.lastName=user.last_name;
        this.email = user.email;
        this.role=user.role;
    }
    
}

//Recibe como parámetro lo que quiero transformar. El DTO se aplica en el router donde quiero hacer la transformación, pero debería ir en la capa repository.