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
            stops: [{ 
                location: {
                    city: chance.word(), 
                    zip: chance.natural({ min: 10000, max: 99999 }) 
                }
            }]
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
        return dropCollection('events');
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
                    launchDate: chance.date(),
                    stops: [{
                        location: {
                            city: 'Portland',
                            zip: 97212
                        }
                    }]
                });
            });

    });
});
