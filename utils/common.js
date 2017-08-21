const http = require('http')

exports.getJSON = function (url, scope, callback) {
  http.get(url, (res) => {
    const { statusCode } = res
    if (statusCode != 200) {
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
};

exports.removeAccent = function (text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
}
