'use strict'

const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand

const fs = require('fs')

const PingController = require('./controllers/PingController')

const config = JSON.parse(fs.readFileSync('config.json'))

const tg = new Telegram.Telegram(config.apiToken)

tg.router
  .when(
    new TextCommand('!ping', 'pingCommand'),
    new PingController()
  )
