'use strict'

const http = require('http')
const config = require('../../config')

class WebHook {
    constructor (api) {
        this._api = api
        this._channels = config.pinoSup.chatIds
        this._server = http.createServer()
        this._server.on('request', this.handle.bind(this))
        this._server.listen(
            config.pinoSup.webHook.port,
            config.pinoSup.webHook.host)
    }

    handle (req, res) {
        let msg = ''
        req.on('data', (data) => {
            msg += data
        })
        req.on('end', () => {
            try {
                let alertMsg = JSON.parse(msg)
                this.processAlert(alertMsg)
                res.writeHead(202)
            } catch (e) {
                console.log(e)
                res.writeHead(400)
            }
            res.end()
        })
    }

    processAlert (alertMsg) {
        let prefix = alertMsg.status == 'firing' ? '⛑️' : '🥬'
        let message = `${prefix} ${alertMsg.status.toUpperCase()}`;

        for (let alert of alertMsg.alerts) {
            console.log(alert)
            let labels = {...alertMsg.commonLabels, ...alert.labels}
            let annotations = {...alertMsg.commonAnnotations, ...alert.annotations}
            let name = labels.alertname
            delete labels.alertname
            let finalMessage = `${message} <b>${name}</b>\n\n`
            finalMessage += Object.entries(annotations).map(e => `<b>${e[0]}</b>: ${e[1]}`).join('\n')
            finalMessage += '\n\n'
            finalMessage += Object.entries(labels).map(e => `${e[0]}: <code>${e[1]}</code>`).join(', ')
            for (let channel of this._channels) {
                this._api.sendMessage(channel, finalMessage, {
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                  })
            }
        }

    }
}

module.exports = WebHook
