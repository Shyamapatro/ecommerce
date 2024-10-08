const { celebrate, Joi, Segments } = require('celebrate');

const signup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    countryCode: Joi.string().trim().required(),
    phoneNumber: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
   }, { warnings: true })
})

const login = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().trim().required(),
		password: Joi.string().trim().required(),
   }, { warnings: true })
})




module.exports = {
  signup,
  login
  };