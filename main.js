'use strict'

const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand

const fs = require('fs')

const PingController = require('./controllers/PingController')
const ImagesController = require('./controllers/ImagesController')

const config = JSON.parse(fs.readFileSync('config.json'))

const tg = new Telegram.Telegram(config.apiToken)


let imagesController = new ImagesController()
tg.router
  .when(
    new TextCommand('!ping', 'pingCommand'),
    new PingController()
  )
  .when(
    new TextCommand('!flip_table', 'flipTableCommand'),
    imagesController
  )
