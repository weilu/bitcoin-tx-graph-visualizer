var visualize = require('../').visualize
var bitcoin = require('bitcoinjs-lib')
var TxGraph = require('bitcoin-tx-graph')

var graph = new TxGraph()

var txs = require('./txs.json')
txs.forEach(function(txHex) {
  graph.addTx(bitcoin.Transaction.fromHex(txHex))
})

visualize(graph, 'body')

