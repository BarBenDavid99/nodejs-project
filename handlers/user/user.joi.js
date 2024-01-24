const Joi = require('joi');

exports.SignupValid = Joi.object({
    name: Joi.object({
        first: Joi.string().required(),
        middle: Joi.string(),
        last: Joi.string().required()
    }).required(),
    email: Joi.string().required(),
    password: Joi.string()
        .required()
        .min(6)
        .max(30)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    phone: Joi.string().required(),
    image: Joi.object({
        url: Joi.string().required(),
        alt: Joi.string()
    }).required(),
    address: Joi.object({
        state: Joi.string(),
        country: Joi.string().required(),
        city: Joi.string().required(),
        street: Joi.string().required(),
        houseNumber: Joi.number().required(),
        zip: Joi.number()
    }).required(),
    isBusiness: Joi.boolean()
});

exports.LoginValid = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});

exports.EditUserValid = Joi.object({
    name: Joi.object({
        first: Joi.string().required(),
        middle: Joi.string(),
        last: Joi.string().required()
    }).required(),
    phone: Joi.string().required(),
    image: Joi.object({
        url: Joi.string().required(),
        alt: Joi.string()
    }).required(),
    address: Joi.object({
        state: Joi.string(),
        country: Joi.string().required(),
        city: Joi.string().required(),
        street: Joi.string().required(),
        houseNumber: Joi.number().required(),
        zip: Joi.number()
    }).required(),
}
);