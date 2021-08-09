import Joi from 'joi';

export default {
  create: {
    body: {
      productId: Joi.number().required(),
      quantity: Joi.number().required(),
    },
  },
};
