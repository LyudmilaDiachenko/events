const redis = require('redis');
const request = require('request');

const db = redis.createClient({
    password: 'sYjjTQwUgBvcqCiWX7UsqlLE6QF5v53f',
    socket: {
        host: 'redis-17141.c6.eu-west-1-1.ec2.redns.redis-cloud.com',
        port: 17141
    }
})
db.connect();
db.flushAll()

function parseDB(page = 1){
    console.debug('Start page: ', page)
    request({
        url: `https://api.themoviedb.org/3/discover/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&include_adult=false&language=uk-UA&year=2025&page=${page}`,
        json: true
    }, (err, resp, data) => {
        // console.debug(data)
        data.results.map(
            event => {
                // console.debug(event)
                db.hSet(
                    `events:${event.id}`, 
                    {
                        id: event.id,
                        title: event.title, 
                        // description: event.overview, 
                        // date: event.release_date,
                        // image: event.poster_path,
                        // background: event.backdrop_path,
                        // organizer: 
                        // https://image.tmdb.org/t/p/w600_and_h900_bestv2/
                    }
                )
            }
        )
        console.debug('Finished page: ', data.page)
    })
}
for(let page = 1; page <= 10; page++){
    parseDB(page)
}