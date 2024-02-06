export default class CustomError {
    static createError({ name = 'Error', cause, message, code = 1 }) { //recibo nombre del error, por default error, la causa y el mensaje del error.
        let error = new Error(message, { cause });
        error.name = name; //seteo nombre y código
        error.code = code;
        return error;
    }
}