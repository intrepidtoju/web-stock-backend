'use strict';
import cryptr from 'cryptr';
import { readFile as ReadFile } from 'fs';
import jwt from 'jsonwebtoken';
import config from './config';

const crypto = new cryptr(config.CRYPTR_SECRET);

export const success = true;

export function formatUrl(url) {
  return config.BASE_URL + url.replace(/[ &#,+()$~%'"*<>{}]/g, '-').toLowerCase();
}

export function addBaseUrl(url) {
  return config.BASE_URL + url.replace(/[ &#,+()$~%'"*<>{}]/g, '-').toLowerCase();
}

export function randomString(N) {
  return Array(N + 1)
    .join((Math.random().toString(36) + '00000000000000000').slice(2, 18))
    .slice(0, N);
}

export function decodeJwt(headerToken) {
  if (!headerToken) {
    return false;
  }

  const token = headerToken.split(' ').pop();

  return jwt.verify(token, config.JWT_SECRET, (err, data) => {
    if (err) {
      return false;
    } else {
      return data;
    }
  });
}

export function jwtAuth() {
  return async (req, res, next) => {
    try {
      let token = req.headers.authorization;
      const data = decodeJwt(token);
      console.log('data', data);
      if (!data) throw Error('Supplied token not valid');
      return next();
    } catch (err) {
      return res.status(err.httpStatusCode || 500).json(errorMessage('Kindly login to continue'));
    }
  };
}

export function errorMessage(err = void 0) {
  let message;
  if (err && err.errors) {
    message = err.errors[0].message;
  } else if (err && err.message) {
    message = err.message;
  } else if (typeof err == 'string') {
    message = err;
  } else {
    message = 'Something went wrong';
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(err);
  }
  return { success: false, message };
}

export function successMessage(message) {
  return { success: true, message };
}

/* Encrypt and decrypt data */
export function encrypt(plainText, expire = void 0) {
  if (!plainText) {
    throw new Error('No plain text provided');
  }

  /* Convert expire duration to miliseconds */
  expire = expire ? Date.now() + expire * 60 * 1000 : expire;
  return crypto.encrypt(JSON.stringify({ plainText, expire }));
}

/* Descrypt cipher text */
export function decrypt(cipherText) {
  if (!cipherText) {
    throw new Error('Kindly provide cipher text');
  }

  let { plainText, expire = void 0 } = JSON.parse(crypto.decrypt(cipherText));

  if (expire && Date.now() > expire) {
    throw new Error('Authentication token expired');
  }

  return plainText;
}

/* Read json from file */
export async function readFile(path) {
  return new Promise((ful, rej) => {
    ReadFile(path, (err, data) => {
      if (err) {
        rej(err);
      } else {
        ful(JSON.parse(data));
      }
    });
  });
}

export async function getUsers(payload, token) {
  try {
    if (!Array.isArray(payload)) {
      throw new Error('Payload must be array of userIDs');
    } else if (!token) {
      throw new Error('Kindly provide auth token');
    }

    /* Get users profile details */
    const cipher = encrypt(config.NGC_KEY);
    const { users } = await postContent({
      url: config.AUTH_SERVICE_URL + '/users/many-users',
      token,
      data: { cipher, payload },
      method: 'POST',
    });

    return users;
  } catch (err) {
    throw err;
  }
}
