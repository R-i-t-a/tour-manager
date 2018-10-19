require('dotenv').config();
const createWeatherLocation  = require('../../lib/util/createWeatherLocation');

describe('finds location by zip code', () => {
    it('calls next when given a bad zip', (done) => {
        const req = { body: { zip: '0009999' } };

        const error = { statusCode: 404 };
        const api = () => {
            return Promise.reject(error);
        };
        
        const middleware = createWeatherLocation(api);

        const next = err => {
            expect(err).toEqual(error);
            done();
        };
        middleware(req, null, next);
    });

    it('call next when given a good zip', (done) => {
        const req = { body: { zip: '98399' } };

        const weatherLocation = { weather: 'Partly Cloudy', location: 'Portland' };
        const api = () => {
            return Promise.resolve(weatherLocation);
        };
        
        const middleware = createWeatherLocation(api);

        const next = err => {
            expect(err).toBeUndefined;
            expect(req.body).toEqual(weatherLocation);
            done();
        };
        middleware(req, null, next);
    });
});
