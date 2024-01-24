const Joi = require('joi');


exports.CardValid = Joi.object({
    title: Joi.string().required(),
    subtitle: Joi.string().required(),
    description: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().required(),
    web: Joi.string().required(),
    image: Joi.object({
        url: Joi.string().required(),
        alt: Joi.string()
    }).required(),
    address: Joi.object({ state: Joi.string(), country: Joi.string().required(), city: Joi.string().required(), street: Joi.string().required(), houseNumber: Joi.number().required(), zip: Joi.number() }),
});