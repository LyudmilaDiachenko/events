var express = require('express');
var router = express.Router();
var redis = require('redis');

const db = redis.createClient({
  password: 'sYjjTQwUgBvcqCiWX7UsqlLE6QF5v53f',
  socket: {
      host: 'redis-17141.c6.eu-west-1-1.ec2.redns.redis-cloud.com',
      port: 17141
  }
})
db.connect();

router.get('/', function(req, res, next) {
  db.keys('events:*').then(vals => {
    // console.log(vals)
    Promise.all(vals.map(key => db.hGetAll(key)))
    .catch(e => console.error(e))
    .then(events => {
      // console.log(events);
      res.render('index', { title: 'Express', events: events });
    })
  });
});

module.exports = router;
