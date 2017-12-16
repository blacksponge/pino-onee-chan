'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand
const RegexpCommand = Telegram.RegexpCommand

const fs = require('fs')
const cluster = require('cluster')

const PingController = require('./controllers/PingController')
const ImagesController = require('./controllers/ImagesController')
const DefinitionController = require('./controllers/DefinitionController')
const CogitoController = require('./controllers/CogitoController')
const TelegramToIrcController = require('./controllers/TelegramToIrcController')

const PinoCommandFilter = require('./utils/PinoCommandFilter')
const PinoQuestionsFilter = require('./utils/PinoQuestionsFilter')

const PinoSup = require('./lib/sup/PinoSup')
const PinoProbePing = require('./lib/sup/PinoProbePing')

const PinoIrc = require('./lib/irc/PinoIrc')

const config = require('./config')

const tg = new Telegram.Telegram(config.apiToken)


let pinoIrc = null
let pinoSup = null

if (cluster.isMaster) {
  pinoSup = new PinoSup(tg.api, [
    new PinoProbePing()
  ])
  pinoIrc = new PinoIrc(tg.api)
}

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
  .when(
    new RegexpCommand(/^!/g, 'proxyTelegramToIrcCommand'),
    new TelegramToIrcController()
  )
