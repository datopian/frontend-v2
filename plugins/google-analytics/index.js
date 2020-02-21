const config = require('../../config')
const {GaApi} = require('./api')

module.exports = function(app) {

    if (process.env.GA_ID) {
        app.use((req, res, next) => {
            res.locals.$GA_ID = config.get('GA_ID');
            next();
        })
    }

    if (process.env.GA_CLIENT_EMAIL) {
        app.set('ga-api', new GaApi())
    }

};