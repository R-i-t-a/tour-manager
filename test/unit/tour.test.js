const { getErrors } = require('./helpers');
const Tour = require('../../lib/models/Tour');
const Chance = require('chance');
const chance = new Chance();

describe('Tours model', () => {
    it('validates a good model', () => {
        const data = {
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

        const tour = new Tour(data);
        const jsonTour = tour.toJSON();
        expect(jsonTour).toEqual({ ...data, _id: expect.any(Object) });
    });

    it('title is required', () => {
        const tour = new Tour({
            activities: [chance.word()],
            launchDate: chance.date(),
            stops: [{ location: chance.word(), zip: chance.natural({ min: 10000, max: 99999 }) }]
        });

        const errors = getErrors(tour.validateSync(), 1);
        expect(errors.title.properties.message).toEqual('Path `title` is required.');
    });
});

