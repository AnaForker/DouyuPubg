const request = require('superagent')
const colors = require('colors')
const crypto = require('crypto')

function PubgList(limit=30) {
  const start = new Date()
  request
    .get(`http://capi.douyucdn.cn/api/v1/live/jdqs?limit=${limit>30?30:limit}`)
    .then(response=>handleResponse(JSON.parse(response.text, null, 2)))
    .catch(err=>console.error(err))

  const handleResponse = res => {
    if (res.error) console.error('Error...emmm')
    const rooms = res.data
    // console.log(rooms) // for debug
    for ({room_id, room_name, show_time} of rooms) {
      let up_hours = `${Math.round((new Date() / 1000 - show_time) / 3600)}h`
      console.log(`[*] id:${room_id.padStart(7, '0').rainbow} up_time:${colors.green(up_hours)} ${room_name}`)
    }
    const ms = new Date() - start
    console.log(`[*] Response time ${`${ms}ms`.green}`)
  }
}

PubgList(10)
