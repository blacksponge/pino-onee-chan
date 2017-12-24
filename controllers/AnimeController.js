const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController

const {postJson} = require('../utils/common')

class AnimeController extends TelegramBaseController {

  characterSearchHandler ($) {
    let searchQuery = $.message.text
      .split(' ')
      .slice(1)
      .join(' ')
    let url = 'https://graphql.anilist.co'
    let query = `query ($query: String) {
  Page {
    characters(search: $query) {
      id
      siteUrl
      name {
        first
        last
      }
      image {
        medium
        large
      }
    }
  }
}`
    postJson(url, {query: query, variables: {query: searchQuery}}, $, (body) => {
      if (body.data === null) {
        $.sendMessage('Something bad must have happened.')
        return
      }
      if (body.data.Page.characters.length === 0) {
        $.sendMessage('Could not found what your were looking for.')
        return
      }
      let charac = body.data.Page.characters[0]
      $.sendPhoto({url: charac.image.large})
        .then((resolve) => {
          $.sendMessage(`${charac.name.first} ${charac.name.last}\n${charac.siteUrl}`)
        })
    })
  }

  get routes () {
    return {
      'characterSearchCommand': 'characterSearchHandler'
    }
  }
}

module.exports = AnimeController
