'use strict'

const http = require('http')
const config = require('../../config')

class WebHook {
    constructor (api) {
        this._api = api
        this._server = http.createServer()
        this._channels = config.pinoSup.chatIds
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
                res.writeHead(202)
                this.processAlert(alertMsg, req.url.substring(1))
            } catch (e) {
                console.log(e)
                res.writeHead(400)
            }
            res.end()
        })
    }

    processAlert (alertMsg, chatId) {
        let prefix = alertMsg.status == 'firing' ? '⛑️' : '🥬'
        let message = `${prefix} ${alertMsg.status.toUpperCase()}`;

        for (let alert of alertMsg.alerts) {
            let labels = {...alertMsg.commonLabels, ...alert.labels}
            let annotations = {...alertMsg.commonAnnotations, ...alert.annotations}
            let name = labels.alertname
            delete labels.alertname
            let finalMessage = `${message} <b>${name}</b>\n(`
            finalMessage += Object.values(labels).map(e => `<code>${e}</code>`).join(', ')
            finalMessage += ')\n\n'
            finalMessage += Object.entries(annotations)
                .map(e => `<b>${e[0].substring(0, 1).toUpperCase()}${e[0].substring(1)}</b>: ${e[1]}`).join('\n')
            this._api.sendMessage(chatId, finalMessage, {
                parse_mode: 'HTML',
                disable_web_page_preview: true
            }).catch(err => console.log(`Could not send ${alertMsg.status} alert "${name}" to chanel "${chatId}"`))
        }

    }
}

module.exports = WebHook
