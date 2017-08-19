'use strict'

const Telegram = require('telegram-node-bot')
const BaseCommand = Telegram.BaseCommand

class PinoCommandFilter extends BaseCommand {
  constructor (prefix, commandName, handler) {
    super()
    this._prefix = prefix.constructor === Array ? prefix : [prefix]
    this._commandName = commandName
    this._handler = handler
  }

  _checkCommand (inputCommand) {
    if (inputCommand.indexOf('@') > -1) {
      let splitedCommand =  inputCommand.split('@')

      return splitedCommand.length === 2 &&
        splitedCommand[0] === this._commandName &&
        splitedCommand[1] === 'PinoOneeChanBot'

    } else {
      return inputCommand === this._commandName
    }
  }

  test ($) {
    return $.message.text &&
      this._prefix.indexOf($.message.text[0]) > -1 &&
      this._checkCommand($.message.text.slice(1).split(' ')[0])
  }

  get handlerName () {
    return this._handler
  }
}

module.exports = PinoCommandFilter
