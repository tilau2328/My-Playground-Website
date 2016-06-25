// api/users/util/token.js

'use strict';

const jwt = require('jsonwebtoken');
const secret = require('../../../config/token_config');

function createToken(user) {
  let scopes;
  if (user.admin) {
    scopes = 'admin';
  }
  return jwt.sign({ id: user._id, username: user.username, scope: scopes }, secret, { algorithm: 'HS256', expiresIn: "1h" } );
}

module.exports = createToken;
