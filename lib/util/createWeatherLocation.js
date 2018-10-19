const { HttpError } = require('./errors');
const weatherHelper = require('../../weather-service-example');

module.exports = function createWeatherLocation(api = weatherHelper) {
    
    return (req, res, next) => {
        if(req.body.zip) {
            api(req.body.zip)
                .then((results) => {
                    req.body = results;
                    next();
                })
                .catch(next);
        }
        else {
            const httpError = new HttpError({
                code: 401,
                message: 'Forbidden'
            });
            next(httpError);
        }
    };
};
