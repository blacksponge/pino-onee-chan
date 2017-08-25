'use strict'

const child_process = require('child_process')

const config = require('../../config')
const PinoProbeBase = require('./PinoProbeBase')

class PinoProbePing extends PinoProbeBase {
  constructor () {
    super()
    this._host = config.pinoSup.probPing.hosts
    this._intervalTime = config.pinoSup.probPing.interval
    this._intervalId = null
  }

  start () {
    this._probe()
    this._intervalId = setInterval(this._probe.bind(this), this._intervalTime)
  }

  _probe () {
    for (let host of this._host) {
      let pingProc = child_process.spawn('ping', [
        '-W', '1', '-c', '1', host
      ])
      pingProc.on('close', (code) => {
        if (code === 0) {
          this.updateState(host, {success: true, msg: 'PING OK'})
        } else if (code === 1){
          this.updateState(host, {success: false, msg: 'PING DOWN'})
        }
      })
    }
  }
}

module.exports = PinoProbePing;
