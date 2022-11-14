const moment = require('moment')
const date = moment().format('YYYY-MM-DD HH:mm:ss');


function getCurrentDate(){
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth()
    var today = date.getDate()
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds()
    var milliseconds = date.getMilliseconds()
    return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds))
}

const dateTime = getCurrentDate()

module.exports = dateTime