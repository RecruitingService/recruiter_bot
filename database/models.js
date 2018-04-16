const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Default Schema
 */

const defaultSchema = new Schema({}, {
    versionKey: false,
    strict: false
});

/**
 * User Model
 */

const VacanciesModel = mongoose.model('vacancies', defaultSchema);

module.exports = {
    VacanciesModel
};