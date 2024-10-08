const { celebrate, Joi, Segments } = require('celebrate');

const addProduct = celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().trim().required(),
      price: Joi.number().required(),
      stock: Joi.number().required(),
      description: Joi.string().trim().required(),
      category: Joi.string().trim().required(),
    },{ warnings: true })
  });

module.exports = {
    addProduct
  };