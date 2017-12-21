'use strict'

const config = require('../../config')

class GroupToChannelMap {
  constructor () {
    // stores map {channel => {groups}}
    this._chatIds = new Map()
    // stores map {group => {channels}}
    this._channels = new Map()

    for (let channel in config.pinoIrc.channels) {
      for (let chatId of config.pinoIrc.channels[channel]) {
        this._addToMap(this._chatIds, channel, chatId)
        this._addToMap(this._channels, chatId, channel)
      }
    }
  }

  static get instance () {
    if (this._instance === undefined) {
      this._instance = new GroupToChannelMap()
    }
    return this._instance
  }

  _addToMap (map, key, value) {
    let updatedSet = null

    if (map.has(key)) {
      updatedSet = map.get(key)
    } else {
      updatedSet = new Set()
    }

    updatedSet.add(value)
    map.set(key, updatedSet)
  }

  get chatIds () {
    return this._chatIds
  }

  get channels () {
    return this._channels
  }
}

module.exports = GroupToChannelMap
