const express = require('express');
const router = express.Router();
const redis = require('../models/redis');

router.get('/', function(req, res, next) {
  const itemsPerPage = 12;
  const page = 1 * req.query.page || 1;

  redis.search('events:*', events => 
    res.render('index', { 
      title: 'Express', 
      events: events.slice(itemsPerPage * (page * 1 - 1), itemsPerPage * (page * 1)),
      maxPage: Math.ceil(events.length / itemsPerPage),
      page
    })
  )
});

router.get('/register/:id', function(req, res, next) {
  redis.get(`events:${req.params.id}`, event => 
    res.render('register', { title: 'Express', id: req.params.id, ...event})
  )
});

router.post('/register/:id', function(req, res, next) {
  redis.set(`participants:${req.params.id}:${req.body.email}`, req.body)
  res.redirect(`/participants/${req.params.id}`)
});

router.get('/participants/:id', function(req, res, next) {
  redis.get(`events:${req.params.id}`, event => 
    redis.search(`participants:${req.params.id}:*`, participants => 
      res.render('participants', { title: 'Express', participants, ...event })
    )
  )
});

module.exports = router;