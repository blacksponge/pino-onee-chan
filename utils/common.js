const http = require('http')
const request = require('tiny_request')

exports.getJSON = function (url, scope, callback) {
  request.get({url: url, json: true}, (body, response, err) => {
    if (err) {
      console.log(err)
      scope.sendMessage('Those data are too difficult to understand. Giving up..')
      return
    }

    if (response.statusCode !== 200) {
      scope.sendMessage(`The remote server is rude, answered me with ${statusCode} code`)
      res.resume()
      return
    }

    callback(body)
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
