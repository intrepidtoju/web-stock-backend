import Joi from 'joi';

export default {
  create: {
    body: {
      name: Joi.string().required(),
      quantity: Joi.number().required(),
    },
  },
};
