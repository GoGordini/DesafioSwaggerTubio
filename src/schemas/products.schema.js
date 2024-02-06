import Joi from "joi";

export const productSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    thumbnail: Joi.string(),
    code:  Joi.string().required(),
    category:  Joi.string().required(),
    stock: Joi.number().required(),
    status: Joi.boolean()
});

export const getProductByIdSchema = Joi.object({
    pid: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{24}$')).required()
    })

