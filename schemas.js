const Joi = require('joi');
module.exports.todoSchema = Joi.object({
    Todo: Joi.object({
        item: Joi.string().required()
    }).required()
});

