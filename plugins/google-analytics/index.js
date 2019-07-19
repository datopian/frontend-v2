const config = require('../../config')

module.exports = function(app) {
    app.use((req, res, next) => {
        res.locals.$GA_ID = config.get('GA_ID');
        next();
    })
};