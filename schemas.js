const Joi = require('joi');
module.exports.todoSchema = Joi.object({
    Todo: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
    }).required()
});

