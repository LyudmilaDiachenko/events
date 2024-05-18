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
  db.keys('events:*')
  .then(keys => {
    Promise.all(keys.map(key => db.hGetAll(key)))
    .then(events => res.render('index', { title: 'Express', events: events }))
  });
});

router.get('/register/:id', function(req, res, next) {
  res.render('register', { title: 'Express', id: req.params.id})
});

router.post('/register/:id', function(req, res, next) {
  db.hSet(`participants:${req.params.id}:${req.body.email}`, req.body)
  res.redirect(`/participants/${req.params.id}`)
});

router.get('/participants/:id', function(req, res, next) {
  db.keys(`participants:${req.params.id}:*`)
  .then(keys => {
    Promise.all(keys.map(key => db.hGetAll(key)))
    .then(participants =>  res.render('participants', { title: 'Express', participants: participants }))
  });
 
});

module.exports = router;
