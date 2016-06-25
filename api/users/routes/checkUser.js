// api/users/routes/checkUser.js

'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const User = require('../model/User');
const checkUserSchema = require('../schemas/checkUser');
const verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser;

module.exports = {
  method: 'POST',
  path: '/users/check',
  config: {
    auth: false,
    pre: [
      { method: verifyUniqueUser, assign: 'user' }
    ],
    handler: (req, res) => {
      res(req.pre.user);
    },
    validate: {
      payload: checkUserSchema
    }
  }
}
