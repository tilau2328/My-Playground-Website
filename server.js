// server.js

'use strict';

const Path = require("path");
const Hapi = require('hapi');
const Inert = require('inert');
const Boom = require('boom');
const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');
const secret = require('./config');

const server = new Hapi.Server();

// The connection object takes some
// configuration, including the port
server.connection({ port: 3000 });

const dbUrl = 'mongodb://localhost:27017/hapi-app';

server.register(require('inert'), (err) => {
    if(err) throw err;

    server.register(require('hapi-auth-jwt'), (err) => {
        if(err) throw err;
        // We're giving the strategy both a name
        // and scheme of 'jwt'
        server.auth.strategy('jwt', 'jwt', {
            key: secret,
            verifyOptions: { algorithms: ['HS256'] }
        });

        // Look through the routes in
        // all the subdirectories of API
        // and create a new route for each
        glob.sync('api/**/routes/*.js', {
            root: __dirname
        }).forEach(file => {
            const route = require(path.join(__dirname, file));
            server.route(route);
        });
    });

    server.route([{method: "GET", path: "/", handler: { file: Path.join(__dirname, "public", "index.html") } },
                  {method: "GET", path: "/{param*}", handler: { directory: { path: Path.join(__dirname, "public", "static") } } }]);

    // Start the server
    server.start((err) => {
        if (err) {
            throw err;
        }
        // Once started, connect to Mongo through Mongoose
        mongoose.connect(dbUrl, {}, (err) => {
        if (err) {
            throw err;
        }
        });
        console.log('Server running at:', server.info.uri);
    });
});
