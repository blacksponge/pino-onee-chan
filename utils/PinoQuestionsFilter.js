'use strict'

const Telegram = require('telegram-node-bot')
const BaseCommand = Telegram.BaseCommand

const {removeAccent} = require('../utils/common')

class PinoQuestionsFilter extends BaseCommand {
  constructor (handler) {
    super()
    this._handler = handler
  }

  test ($) {
    let message = $.message.text
    let questionMarkIndex = message.indexOf('?')
    let questionMark = questionMarkIndex >= 0 && questionMarkIndex >= (message.length - 5)

    if (!questionMark) {
      return false
    }

    // Getting rid of anoying stuff
    let newMessage = message
      .toLowerCase()
      .split(/[ -,']/)
      .filter(el => {return el.length})

    //Looking for words
    let tu = newMessage.indexOf('tu') >= 0 || newMessage.indexOf('t') >= 0

    //Looking for pattern
    newMessage = newMessage.join(' ')

    let questionWord = {word:'', pos: -1}
    let questionWordRegex = /(qu(o?i|e|and)|comment|est ce|ou)/
    let matchedQuestionWord = removeAccent(newMessage).match(questionWordRegex)
    if (matchedQuestionWord) {
      questionWord.pos = matchedQuestionWord.index
      questionWord.word = matchedQuestionWord[0]
    }

    let toMe = $.message.chat.type === 'private' || (
        $.message.chat.type === 'group' &&
        newMessage.indexOf('pino') >= 0)

    $.pinoMessageInfo = {
      toMe: toMe,
      tu: tu,
      questionWord: questionWord
    }

    return true
  }

  get handlerName () {
    return this._handler
  }
}

module.exports = PinoQuestionsFilter;
