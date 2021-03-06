require('dotenv').config();
const { dropCollection } = require('./db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();

describe('tour pub/sub API', () => {
    let tours = Array.apply(null, { length: 10 }).map(() => {
        return {
            title: chance.word(),
            activities: [chance.word()],
            launchDate: chance.date(),
            stops: []
        };
    });
    let createdTours;

    const createTour = tour => {
        return request(app)
            .post('/api/tours')
            .send(tour)
            .then(res => res.body);
    };

    beforeEach(() => {
        return dropCollection('tours');
    });

    beforeEach(() => {
        return Promise.all(tours.map(createTour)).then(toursRes => {
            createdTours = toursRes;
        });
    });

    it('creates a tour on post', () => {
        return request(app)
            .post('/api/tours')
            .send({
                title: 'CircUs',
                activities: ['hooping', 'souping', 'trouping'],
                launchDate: chance.date(),
                stops: [{
                    location: {
                        city: 'Portland',
                        zip: 97212
                    }
                }]
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    __v: expect.any(Number),
                    title: 'CircUs',
                    activities: ['hooping', 'souping', 'trouping'],
                    launchDate: expect.any(String),
                    stops: [{
                        _id: expect.any(String),
                        location: {
                            city: 'Portland',
                            zip: 97212
                        }
                    }]
                });
            });
    });

    it('gets all tours', () => {
        return request(app)
            .get('/api/tours')
            .then(retrievedTours => {
                createdTours.forEach(createdTour => {
                    expect(retrievedTours.body).toContainEqual(createdTour);
                });
            });
    });

    it('gets all tours by id', () => {
        return request(app)
            .get(`/api/tours/${createdTours[0]._id}`)
            .then(res => {
                expect(res.body).toEqual({ ...createdTours[0], __v: expect.any(Number) });
            });
    });

    it('posts a stop to a tour', () => {
        return request(app)
            .post(`/api/tours/${createdTours[0]._id}/stops`)
            .send({ zip: 21403 })
            .then(res => {
                expect(res.body.stops).toEqual(
                    [{
                        _id: expect.any(String),
                        location: {
                            city: 'Annapolis',
                            state: 'MD',
                            zip: 21403
                        },
                        weather: {
                            windDir: expect.any(String),
                            sunrise: expect.any(String)
                        }

                    }]
                );
            });
    });

    it('removes a stop', () => {
        return request(app)
            .post(`/api/tours/${createdTours[0]._id}/stops`)
            .send({ zip: 97232 })
            .then(tourRes=> {
                return request(app)
                    .delete(`/api/tours/${tourRes.body._id}/stops/${tourRes.body.stops._id}`)
                    .then(res => {
                        expect(res.body).toEqual(createdTours[0]);
                    }); 
            });     
    });

    it('updates attendance', () => {
        return request(app)
            .post(`/api/tours/${createdTours[0]._id}/stops`)
            .send({ zip: 97232 })
            .then(tourRes => {
                return request(app)
                    .put(`/api/tours/${tourRes.body._id}/stops/${tourRes.body.stops[0]._id}/attendance`)
                    .send({ attendance: 10000000 })
                    .then(res => {
                        expect(res.body.stops[0].attendance).toEqual(10000000);
                    });
            });

    });

});
