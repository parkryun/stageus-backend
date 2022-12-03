const sessionCheck = (req, res, next) => {

    const result = {
        "success": false,
        "message": "",
        "sessionCheck": false
    }

    if (req.session.user) {
        result.sessionCheck = true
        return next()
    } else {
        result.message = "세션이 없습니다."
        return res.send(result)
    }
}

module.exports = sessionCheck