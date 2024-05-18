const request = require('request');
const redis = require('./models/redis');
redis.flushAll()

function parseDB(page = 1){
    request({
        url: `https://api.themoviedb.org/3/discover/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&include_adult=false&include_video=true&language=en-US&year=2025&page=${page}`,
        json: true
    }, (e, r, data) => data.results.map(
        event => redis.set(
            `events:${event.id}`, 
            {
                id: event.id,
                title: event.title, 
                description: event.overview, 
                date: event.release_date,
                image: event.poster_path || "",
                background: event.backdrop_path || ""
            }
        )
    ))
}
for(let page = 1; page <= 10; page++){
    parseDB(page)
}