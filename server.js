// server.js

'use strict';

const Path = require("path");
const Hapi = require('hapi');
const Inert = require('inert');
const Boom = require('boom');
const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');
const secret = require('./config/token_config');

const server = new Hapi.Server();

// The connection object takes some
// configuration, including the port
server.connection({ port: 3000 });

const dbUrl = require('./config/db_config').url;

server.register(require('inert'), (err) => {
    if(err) throw err;

    server.register(require('hapi-auth-jwt'), (err) => {
        if(err) throw err;
        server.auth.strategy('jwt', 'jwt', {
            key: secret,
            verifyOptions: { algorithms: ['HS256'] }
        });

        glob.sync('api/**/routes/*.js', {
            root: __dirname
        }).forEach(file => {
            const route = require(path.join(__dirname, file));
            server.route(route);
        });
    });

    server.route([{method: "GET", path: "/", handler: { file: Path.join(__dirname, "public", "index.html") } },
                  {method: "GET", path: "/{param*}", handler: { directory: { path: Path.join(__dirname, "public", "static") } } }]);

    server.start((err) => {
        if (err) { throw err; }

        mongoose.connect(dbUrl, {}, (err) => { if (err) { throw err; } });
        console.log('Server running at:', server.info.uri);
    });
});
