const http = require('http')
const request = require('tiny_request')

exports.getJSON = function (url, scope, callback) {
  http.get(url, (res) => {
    const { statusCode } = res
    if (statusCode !== 200) {
      scope.sendMessage(`The remote server is rude, answered me with ${statusCode} code`)
      res.resume()
      return
    }

    res.setEncoding('utf-8')
    let rawData = ''
    res.on('data', (chunk) => {
      rawData += chunk
    })
    res.on('end', () => {
      try {
        let parsedData = JSON.parse(rawData)
        callback(parsedData)
      } catch (e) {
        console.log(e)
        scope.sendMessage('Those data are too difficult to understand. Giving up..')
      }
    })
  })
}

exports.postJson = function (url, data, scope, callback) {
  request.post({url: url, jsonData: data, json: true}, (body, response, err) => {
    if (response.statusCode !== 200) {
      scope.sendMessage(`The remote server is rude, answered me with ${response.statusCode} code`)
      return
    }

    if (err) {
      console.log(err)
      scope.sendMessage('Those data are too difficult to understand. Giving up..')
      return
    }
    callback(body)
  })
}

exports.removeAccent = function (text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
}
