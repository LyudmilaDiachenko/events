const express = require('express');
const router = express.Router();
const redis = require('../models/redis');

router.get('/events', function(req, res, next) {
  const itemsPerPage = 12;
  const page = 1 * req.query.page || 1;
  redis.search('events:*', events => 
    res.json({
      events: events
        .sort((a,b) => a[req.query.sort] > b[req.query.sort] ? 1 : -1)
        .slice(itemsPerPage * (page * 1 - 1), itemsPerPage * (page * 1))
    })
  )
});
module.exports = router;