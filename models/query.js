module.exports = {
    put: (q, k, v) => {
        const u = new URLSearchParams(q)
        u.delete(k)
        u.set(k, v)
        return u.toString()
    }
}