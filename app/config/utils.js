'use strict';
import nodeMailer from 'nodemailer';
import config from './config';
import jwt from 'jsonwebtoken';
import multer, { diskStorage } from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import path from 'path';
import Axios from 'axios';
import cryptr from 'cryptr';
import { readFile as ReadFile, unlink, existsSync, access } from 'fs';
import Slugify from 'slugify';
import { AllHtmlEntities } from 'html-entities';

const entities = new AllHtmlEntities(),
  crypto = new cryptr(config.CRYPTR_SECRET);

export const success = true;

/* Send emails */
export async function sendMail({ to, subject, body }) {
  try {
    const transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.MAILER_EMAIL,
        pass: config.MAILER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: 'NGCareers <no_reply@ngcareers.com>',
      to,
      subject,
      html: body,
    });
  } catch (err) {
    throw err;
  }
}

export function formatUrl(url) {
  return (
    config.BASE_URL + url.replace(/[ &#,+()$~%'"*<>{}]/g, '-').toLowerCase()
  );
}

export function addBaseUrl(url) {
  return (
    config.BASE_URL + url.replace(/[ &#,+()$~%'"*<>{}]/g, '-').toLowerCase()
  );
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

const s3 = new aws.S3({
  accessKeyId: config.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_S3_SECRET_ACCESS_KEY,
  Bucket: config.AWS_S3_BUCKET,
});

export function uploadFile({
  name = null,
  /* 5mb default file upload limit */
  limit = 5,
  /* image format default file format */
  allowedFormat = config.ALLOWED_IMAGE_FORMAT,
  /* Location to store the file */
  location = 'public/',
}) {
  /* Set storage to s3 */
  const storage = multerS3({
    s3: s3,
    bucket: config.AWS_S3_BUCKET,
    acl: 'public-read',
    key: function(req, file, cb) {
      name = Boolean(name) ? name : Date.now() + '-' + randomString(10);
      const temp = `${location + file.fieldname}/${path.basename(
        name + path.extname(file.originalname),
      )}`;
      cb(null, temp.toLowerCase());
    },
  });

  /* Limit is converted to bytes from megabyte */
  const limits = { fileSize: limit * 1000000 };

  /* Restrict file format to allowed ones */
  const fileFilter = (req, file, cb) => {
    const fileFormat = file.originalname
      .split('.')
      .pop()
      .toLowerCase();
    if (allowedFormat.includes(fileFormat)) {
      return cb(null, true);
    } else {
      return cb(
        `File format not allowed, allowed formats are: ${allowedFormat.join(
          ', ',
        )}`,
      );
    }
  };

  return multer({ storage, limits, fileFilter });
}

export function uploadFileLocal({
  // name = null,
  limit = 5,
  allowedFormat = config.ALLOWED_IMAGE_FORMAT,
  location = config.IMAGE_PATH,
}) {
  // Set storage to local
  const storage = diskStorage({
    destination: function(req, file, cb) {
      cb(null, location);
    },
    filename: (req, file, cb) => {
      let mimetype = file.mimetype.split('/')[1];
      const name = `${Date.now()}-${randomString(5)}.${mimetype}`;
      cb(null, name);
    },
  });
  /* Limit is converted to bytes from megabyte */
  const limits = { fileSize: limit * 1000000 };

  /* Restrict file format to allowed ones */
  const fileFilter = (req, file, cb) => {
    if (
      allowedFormat.includes(
        file.originalname
          .split('.')
          .pop()
          .toLowerCase(),
      )
    ) {
      return cb(null, true);
    } else {
      return cb(
        `File format not allowed, allowed formats are: ${allowedFormat.join(
          ', ',
        )}`,
      );
    }
  };

  return multer({ storage, limits, fileFilter });
}

export async function deleteFileLocal(file) {
  try {
    /* Check if file exist */
    access(file, async err => {
      if (err) return err;
      /* Remove file */
      unlink(file, err => {
        if (err) {
          throw err;
        }
        return true;
      });
    });

    return true;
  } catch (err) {
    throw err;
  }
}

/* Download file from amazon s3 */
export async function s3Download(link, res) {
  try {
    const Key = link.split('.com/').pop(),
      Bucket = config.AWS_S3_BUCKET;

    res.attachment(Key);
    s3.getObject({ Key, Bucket })
      .createReadStream()
      .pipe(res);
  } catch (err) {
    throw err;
  }
}

/* Delete file in amazon s3 */
export async function s3Delete(fileUrl) {
  try {
    /* Get s3 key from file url */
    const Key = fileUrl.split('.com/').pop(),
      Bucket = config.AWS_S3_BUCKET,
      params = { Key, Bucket };

    /* Check if file exists */
    await s3.headObject(params).promise();

    /* Delete file */
    await s3.deleteObject(params).promise();
    return true;
  } catch (err) {
    if (err.code == 'NotFound') throw new Error('File not found');
    throw err;
  }
}

/* Send GET HTTP Request */
export async function getContent(url, token) {
  try {
    const result = await Axios({
      method: 'GET',
      url,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: token,
      },
    });

    return result.data;
  } catch (err) {
    throw err.response ? err.response.data || err.response : err;
  }
}

/* Send POST HTTP Request */
export async function postContent({ url, token, data, method = 'POST' }) {
  try {
    const result = await Axios({
      method,
      url,
      data,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: token,
      },
    });

    return result.data;
  } catch (err) {
    throw err.response ? err.response.data || err.response : err;
  }
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

export function slugify(value) {
  return Slugify(value).toLowerCase();
}

export function htmlEncode(value) {
  return entities.encodeNonUTF(value);
}

export function htmlDecode(value) {
  return entities.decode(value);
}
