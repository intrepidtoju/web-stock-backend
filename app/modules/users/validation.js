import Joi from 'joi';

export default {
  register: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  },
  login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  },
};
