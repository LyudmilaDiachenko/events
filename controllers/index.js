const express = require('express');
const router = express.Router();
const redis = require('../models/redis');
const query = require('../models/query');

router.get('/', function(req, res, next) {
  const itemsPerPage = 12;
  const page = 1 * req.query.page || 1;

  redis.search('events:*', events => 
    res.render('index', {
      background: events.sort(_=>Math.random()-.5)[0].background,
      events: events
        .sort((a,b) => a[req.query.sort] > b[req.query.sort] ? 1 : -1)
        .slice(itemsPerPage * (page * 1 - 1), itemsPerPage * (page * 1)),
      sortBase: query.put(req.query, 'sort', ''),
      paginatorBase: query.put(req.query, 'page', ''),
      maxPage: Math.ceil(events.length / itemsPerPage),
      sort: req.query.sort,
      page
    })
  )
});

router.get('/register/:id', function(req, res, next) {
  redis.get(`events:${req.params.id}`, event => 
    res.render('register', { id: req.params.id, ...event})
  )
});

router.post('/register/:id', function(req, res, next) {
  redis.set(`participants:${req.params.id}:${req.body.email}`, {registered: new Date().toLocaleDateString(), ...req.body})
  res.redirect(`/participants/${req.params.id}`)
});

router.get('/participants/:id', function(req, res, next) {
  redis.get(`events:${req.params.id}`, event => 
    redis.search(`participants:${req.params.id}:*`, participants => 
      res.render('participants', { participants, ...event })
    )
  )
});

module.exports = router;