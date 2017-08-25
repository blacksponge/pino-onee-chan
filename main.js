'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand

const fs = require('fs')

const PingController = require('./controllers/PingController')
const ImagesController = require('./controllers/ImagesController')
const DefinitionController = require('./controllers/DefinitionController')
const CogitoController = require('./controllers/CogitoController')

const PinoCommandFilter = require('./utils/PinoCommandFilter')
const PinoQuestionsFilter = require('./utils/PinoQuestionsFilter')

const config = require('./config')

const tg = new Telegram.Telegram(config.apiToken)


tg.router
  .when(
    new PinoCommandFilter(config.prefix, 'ping', 'pingCommand'),
    new PingController()
  )
  .when(
    [new PinoCommandFilter(config.prefix, 'flip_table', 'flipTableCommand'),
    new PinoCommandFilter(config.prefix, 'pic', 'danbooruCommand')],
    new ImagesController()
  )
  .when(
    new PinoCommandFilter(config.prefix, 'define', 'defineCommand'),
    new DefinitionController()
  )
  .when(
    new PinoQuestionsFilter('questionCommand'),
    new CogitoController()
  )
