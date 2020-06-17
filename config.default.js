const CONFIG = {
  "apiToken": "",
  "prefix": ["/"],
  "pinoSup": {
    "chatIds": [],
    "remotes": ["127.0.0.1"],
    "port": 1337,
    "webHook": {
        port: 5001,
        host: "127.0.0.1"
    },
    "ircChan": []
  },
  "pinoIrc": {
    "server": "chat.freenode.net",
    "channels": {}
  }
}

module.exports = CONFIG;
