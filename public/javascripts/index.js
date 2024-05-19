const container = document.querySelector('.main_container')
let isLocked = false;
let page = location.search.match(/page=(\d+)/) || 1;

document.addEventListener('scroll', e => {
    if (!isLocked && scrollY + innerHeight >= document.querySelector('body').clientHeight){
        isLocked = true;
        setTimeout(_ => isLocked = false, 1000)

        page = ++page

        console.debug('Infinite scroll start')
        fetch('/api/events?' + changeParam(location.search, 'page', page)).then(response => {
            response.json().then(data => {
                console.log(data)
                data.events.map(el =>
                    container.innerHTML += 
                    `<div class="wrapper">
                        <div class="wrapper_title">
                            <h2>${el.title}</h2>
                            <img src="https://media.themoviedb.org/t/p/w64_and_h64_face${el.image}" class="picture">
                        </div>          
                        <div class="desc">${el.description}</div>
                        <div class="wrapper_date">${el.date}</div>
                        <div class="wrapper_link">
                            <a href="/register/${el.id}" class="link">Register</a>
                            <a href="/participants/${el.id}" class="link">View</a>
                        </div>
                    </div>`
                )
            })
        })
    }
})

function changeParam(q, k, v){
    const u = new URLSearchParams(q)
    u.delete(k)
    u.set(k, v)
    return u.toString()
}