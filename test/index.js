var assert = require('assert')
var TxGraph = require('bitcoin-tx-graph')
var exportData = require('../index').exportData
var buildTxs = require('./helper').buildTxs
var fakeTxId = require('./helper').fakeTxId

describe('visualize', function() {
  var txs = buildTxs()
  var graph = new TxGraph()

  txs.forEach(function(tx) {
    tx.value = parseInt(Math.random() * 1000)
    tx.fee = parseInt(Math.random() * 10)
    graph.addTx(tx)
  })

  describe('exportData', function() {
    var data = exportData(graph)

    it('returns the expected nodes', function() {
      var expectedIds = [0, 3, 4, 15, 16, 13, 2, 5, 7, 14, 1, 10, 6, 11, 8, 9, 12]
      var actualNames = data.nodes.map(function(n) { return n.name })
      assert.deepEqual(actualNames, expectedIds.map(fakeTxId))

      data.nodes.forEach(function(n) {
        var tx = graph.findNodeById(n.name).tx
        if(!tx) return;

        assert.equal(n.fee, tx.fee)
        assert.equal(n.amount, tx.value)
      })
    })

    it('returns the expected links', function() {
      var sortedLinks = data.links.sort(function(a, b) {
        var targetDiff = a.target - b.target
        if(targetDiff !== 0) {
          return targetDiff
        }

        return a.source - b.source
      })
      assert.deepEqual(data.links, [
        { source: 5, target: 0, value: 1},
        { source: 6, target: 1, value: 1},
        { source: 7, target: 1, value: 1},
        { source: 8, target: 1, value: 1},
        { source: 8, target: 2, value: 1},
        { source: 9, target: 3, value: 1},
        { source: 9, target: 4, value: 1},
        { source: 10, target: 6, value: 1},
        { source: 11, target: 6, value: 1},
        { source: 12, target: 7, value: 1},
        { source: 12, target: 8, value: 1},
        { source: 6, target: 9, value: 1},
        { source: 13, target: 11, value: 1},
        { source: 14, target: 12, value: 1},
        { source: 15, target: 12, value: 1},
        { source: 11, target: 14, value: 1},
        { source: 11, target: 15, value: 1},
        { source: 16, target: 15, value: 1}
      ])
    })
  })
})

