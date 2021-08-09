import { compareSync, hashSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DataTypes } from 'sequelize';
import config from '../../config/config';
import db from '../../config/db';

const Schema = {
  id: {
    type: DataTypes.INTEGER(11).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.CHAR(200),
    allowNull: false,
    validate: {
      isEmail: {
        args: true,
        msg: 'Please enter a valid email address',
      },
    },
    unique: { msg: 'Email address already exists' },
    set(val) {
      return this.setDataValue('email', val.trim().toLowerCase());
    },
  },
  password: {
    type: DataTypes.CHAR(100),
    allowNull: false,
    set(val) {
      return this.setDataValue('password', hashSync(val));
    },
    validate: {
      len: {
        args: [6, 100],
        msg: 'Password must be 6 or more characters',
      },
      notNull: {
        msg: 'Please enter your password',
      },
    },
  },
  gendenr: {
    type: DataTypes.ENUM,
    values: ['M', 'F', 'O'],
    defaultValue: 'F',
  },
  status: {
    type: DataTypes.ENUM,
    values: ['active', 'unverifiedEmail', 'suspended', 'deleted', 'deactivated'],
    defaultValue: 'unverifiedEmail',
  },
};

const User = db.define('users', Schema);

User.prototype.authenticate = function (password) {
  return compareSync(password, this.password);
};

User.prototype.getAuthJSON = function () {
  const { id, email } = this;
  return {
    id,
    email,
    token: this.getToken({ id, email }),
  };
};

User.prototype.getToken = function (userDetails) {
  return jwt.sign(userDetails, config.JWT_SECRET, {
    expiresIn: config.JWT_TOKEN_VALIDITY,
  });
};

export default User;
