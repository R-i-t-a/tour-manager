const router = require('express').Router();
const Tour = require('../models/Tour');
const createWeatherLocation = require('../util/createWeatherLocation')();

module.exports = router
    .post('/', (req, res) => {
        const { title, activities, launchDate, stops } = req.body;
        Tour.create({ title, activities, launchDate, stops }).then(tour =>
            res.json(tour)
        );
    })

    .get('/', (req, res) => {
        Tour.find().then(tours => res.json(tours));
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;
        Tour.findById(id).then(tour => res.json(tour));
    })

    .post('/:id/stops', createWeatherLocation, (req, res) => {
        const { id } = req.params;
        const { location } = req;
        Tour.findByIdAndUpdate(id, 
            { $push: { stops: location } },
            { new: true, runValidators: true }
        )
            .lean()
            .then(tour => res.json(tour));
    })

    .delete('/:id/stops/:stopId', (req, res) => {
        const { id, stopId } = req.params;
        Tour.findByIdAndUpdate(id, 
            { $pull: { stops: { id: stopId } } },
            { new: true }
        )
            .lean()
            .then(updatedTour => res.json(updatedTour));
    })

    .put('/:id/stops/:stopId/attendance', (req, res) => {
        const { id, stopId } = req.params;
        const { attendance } = req.body;
        Tour.findOneAndUpdate(
            { _id: id, 'stops._id': stopId },
            { $set: { 'stops.$.attendance': attendance } },
            { new: true, runValidators: true }
        )
            .then(updatedTour => res.json(updatedTour));
    });


