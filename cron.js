const db = redis.createClient({
    password: 'sYjjTQwUgBvcqCiWX7UsqlLE6QF5v53f',
    socket: {
        host: 'redis-17141.c6.eu-west-1-1.ec2.redns.redis-cloud.com',
        port: 17141
    }
})
db.connect();

API.getAll()
.then(list => 
    list.map(
        event => db.hSet(
            `events:${event.title}`, 
            {
                title: event.title, 
                description: event.description, 
                date: event.date
            }
        )
    )
)