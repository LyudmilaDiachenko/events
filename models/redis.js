const redis = require('redis');

module.exports = {
    db: null,
    init: function(){
        this.db = redis.createClient({
            password: 'sYjjTQwUgBvcqCiWX7UsqlLE6QF5v53f',
            socket: {
                host: 'redis-17141.c6.eu-west-1-1.ec2.redns.redis-cloud.com',
                port: 17141
            }
        })
        this.db.connect();
    },
    checkConnection: function(){
        this.db || this.init()
    },
    get: function(key, cb){
        this.checkConnection()
        this.db.hGetAll(key)
        .then(cb)
    },
    set: function(key, val){
        this.checkConnection()
        this.db.hSet(key, val)
    },
    search: function(key, cb){
        this.checkConnection()
        this.db.keys(key)
        .then(keys => {
            Promise.all(keys.map(key => this.db.hGetAll(key)))
            .then(cb)
        });
    },
    flushAll: function(){
        this.checkConnection()
        this.db.flushAll()
    }
}

