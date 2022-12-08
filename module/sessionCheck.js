const redisClient = require("redis").createClient()


const sessionCheck = async (req, res, next) => {

    const result = {
        "success": false,
        "message": "",
        "sessionCheck": false
    }
    let data = null

    if (req.session.user) {
        await redisClient.connect()

        data = await redisClient.hGet("session", req.session.user.id) // 가져오고

        await redisClient.disconnect()
    } else {
        result.message = "세션이 없습니다."
        return res.send(result)
    }

    if (data == req.session.id) {
        result.sessionCheck = true
        return next()
    } else {
        req.session.destroy()
        result.message = "세션이 없습니다."
        return res.send(result)
    }
}

module.exports = sessionCheck