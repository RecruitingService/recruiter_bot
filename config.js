/**
 * Node.js App configs
 */

const config = {

    mongoConf: {
        url: 'mongodb://ds061208.mlab.com:61208/recruiter',
        options: {
            db: { native_parser: true },
            server: { poolSize: 5 },
            user: 'admin',
            pass: 'admin2018'
        }
    }

};

module.exports = config;