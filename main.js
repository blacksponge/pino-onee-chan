'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand

const fs = require('fs')

const PingController = require('./controllers/PingController')
const ImagesController = require('./controllers/ImagesController')

const PinoCommandFilter = require('./utils/PinoCommandFilter');

const config = JSON.parse(fs.readFileSync('config.json'))

const tg = new Telegram.Telegram(config.apiToken)


tg.router
  .when(
    new PinoCommandFilter(config.prefix, 'ping', 'pingCommand'),
    new PingController()
  )
  .when(
    new PinoCommandFilter(config.prefix, 'flip_table', 'flipTableCommand'),
    new ImagesController()
  )
