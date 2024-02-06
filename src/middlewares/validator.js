import expressJoiValidation from "express-joi-validation";

const validator = expressJoiValidation.createValidator({ //crea el validador
    passError:true //lo dejo en true porque quiero que el error se propague para que lo cachee el middleware global que está en app.js
}); 

export default validator;