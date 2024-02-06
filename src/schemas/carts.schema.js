import Joi from "joi";

export const updateProductInCartSchema = Joi.object({
    quantity: Joi.number().required()
})

export const updateFullCartSchema = Joi.object({
    products: Joi.array().items(Joi.object({
        product: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{24}$')).required(),
        quantity: Joi.number().required()
    })

    )
})

export const getCartByIdSchema = Joi.object({
    cid: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{24}$')).required()
    })

export const productCartSchema = Joi.object({
        cid: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{24}$')).required(),
        pid: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{24}$')).required()
        })
    