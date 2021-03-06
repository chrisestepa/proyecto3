const Alert = require("../models/Alert");
const Center = require("../models/Center");
const User = require("../models/User");
const express = require('express');
const passport = require('passport');
const path = require('path');
const bcrypt = require('bcrypt');
const debug = require('debug')("angularauth:" + path.basename(__filename).split('.')[0]);

const alertRoute = express.Router();

alertRoute.post('/alert/new', (req, res) => {
  const title = req.body.title;
  const speciality = req.body.speciality;
  const center = req.body.center;
  const doctor = req.body.doctor;

  const newAlert = new Alert({
    title,
    speciality,
    center,
    doctor
  });

  newAlert.save()
    .then(alert => {
      User.findByIdAndUpdate(doctor, {
        $push: {
          "alerts": alert._id,
        }
      })
      .then(user => {
        res.status(200).json({
          message: 'New Alert created!',
        })
      })
    })
    .catch(e => res.status(500).json({
      error: e.message
    }));
})

alertRoute.get('/alerts', (req, res) => {
  Alert.find({"doctor":req.user._id}).populate('doctor')
    .populate('center')
    .then(alerts => res.status(200).json(alerts))
    .catch(e => res.status(500).json({
      error: e.message
    }));
});

alertRoute.get('/notifications', (req, res) => {
  Alert.find({"doctor":req.user._id,"status":true}).populate('doctor')
    .populate('center')
    .then(alerts => res.status(200).json(alerts))
    .catch(e => res.status(500).json({
      error: e.message
    }));
});

alertRoute.get('/useralerts', (req, res) => {
  Alert.find({"doctor" : req.user._id})
    .populate('doctor')
    .populate('center')
    .then(alerts => {
      res.status(200).json(alerts)})
    .catch(e => res.status(500).json({
      error: e.message
    }))
});

alertRoute.get('/deletealert/:id', (req, res) => {
  Alert.findByIdAndRemove(req.params.id)
    .then(a => {User.findByIdAndUpdate(req.user._id, {
      $pull: { alerts: req.params.id }
    })
      .then (a => res.status(200).json(a))})
      .catch(e => res.status(500).json({
      error: e.message
    }));
});


module.exports = alertRoute;
