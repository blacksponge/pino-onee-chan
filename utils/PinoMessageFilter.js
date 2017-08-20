'use strict'

const Telegram = require('telegram-node-bot')
const BaseCommand = Telegram.BaseCommand

class PinoMessageFilter extends BaseCommand {
  constructor (handler, regex=/^/, toMe=true) {
    super()
    this._handler = handler
    this._regex = regex
    this._toMe = toMe
  }

  test ($) {
    return ($.message.chat.type === 'private' || (
        $.message.chat.type === 'group' &&
        $.message.text.indexOf('@PinoOneeChanBot') === 0
      )) && this._regex.test($.message.text)
  }

  get handlerName () {
    return this._handler
  }
}

module.exports = PinoMessageFilter;
