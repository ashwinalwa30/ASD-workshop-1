const cache = {}
const TTL = 60 * 1000
function cacheMiddleware(req, res, next) {
    const key = req.originalUrl
    const cached = cache[key]
    if (cached) {
        const age = Date.now() - cached.createdAt
        if (age < TTL) {
            res.set("X-Cache", "HIT")
            return res.status(200).json(cached.data)
        }
        delete cache[key]
    }
    res.set("X-Cache", "MISS")
    req.cacheKey = key
    next()
}
function setCache(key, data) {
    cache[key] = {
        data: data,
        createdAt: Date.now()
    }
}
function clearCache() {
    for (const key of Object.keys(cache)) {
        delete cache[key]
    }
}

module.exports = { cacheMiddleware, setCache, clearCache }