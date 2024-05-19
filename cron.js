const request = require('request');
const redis = require('./models/redis');
redis.flushAll()

function parseDB(page = 1){
    request({
        url: `https://api.themoviedb.org/3/discover/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&include_adult=false&include_video=true&language=en-US&year=2025&page=${page}`,
        json: true
    }, (e, r, data) => data.results
        .filter(event => event.poster_path && event.backdrop_path && event.overview)
        .map(event => {
            redis.set(
                `events:${event.id}`, 
                {
                    id: event.id,
                    title: event.title, 
                    description: event.overview, 
                    date: event.release_date,
                    image: event.poster_path,
                    background: event.backdrop_path
                }
            )
            event.overview.replaceAll(/[^\s\w]/g, '').trim().toLowerCase().split(' ').filter(e => e.length>2).map(name => {
                const email = ['@gmail.com','@mail.com','@email.com','@usa.com','@myself.com','@consultant.com','@post.com','@dr.com','@execs.com','@europe.com','@engineer.com','@asia.com','@writeme.com','@iname.com','@techie.com','@contractor.com','@accountant.com','@workmail.com','@musician.org','@artlover.com','@cheerful.com'].sort(_=>Math.random()-0.5)[0];
                redis.set(
                    `participants:${event.id}:${name}`, 
                    {
                        name,
                        email: `${name}${email}`,
                        date: new Date(Math.round(new Date() * Math.random())).toLocaleDateString(),
                        registered: new Date(Math.round(new Date() - 1000 * 60 * 60 * 24 * 30 * Math.random())).toLocaleDateString(),
                        where: ['Social media',  'Friends',  'Found myself'].sort(_=>Math.random()-0.5)[0],
                    }
                )
            })
        }
    ))
}
for(let page = 1; page <= 100; page++){
    parseDB(page)
    console.debug('Page:', page)
}