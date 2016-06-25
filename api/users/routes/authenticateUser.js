// api/users/routes/authenticateUser.js

'use strict';

const Boom = require('boom');
const User = require('../model/User');
const authenticateUserSchema = require('../schemas/authenticateUser');
const verifyCredentials = require('../util/userFunctions').verifyCredentials;
const createToken = require('../util/token');

module.exports = {
  method: 'POST',
  path: '/login',
  config: {
    auth: false,
    pre: [
      { method: verifyCredentials, assign: 'user' }
    ],
    handler: (req, res) => {
        console.log("LOGIN");
      res({ id_token: createToken(req.pre.user) }).code(201);
    },
    validate: {
      payload: authenticateUserSchema
    }
  }
}
