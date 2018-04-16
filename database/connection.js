
/**
 * Module Dependencies
 */

const mongoose = require('mongoose');
const config = require('../config');
const winston = require('winston');

mongoose.Promise = Promise;


/**
 * MongoDB Default Connection
 */

const connectMongo = () => {
    mongoose.connect(config.mongoConf.url, config.mongoConf.options);
};

connectMongo();

mongoose.connection.on('connected', () => {
    winston.log('info', 'MongoDB connected');
});
mongoose.connection.on('error', err => {
    winston.log('error', err);
    setTimeout(connectMongo, 5000);
});
