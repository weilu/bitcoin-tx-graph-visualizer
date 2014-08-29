var sinon = require('sinon')
var Transaction = require('bitcoinjs-lib').Transaction

function fakeTxHash(i) {
  var hash = new Buffer(32)
  hash.fill(i)
  return hash
}

function fakeTxId(i) {
  var hash = fakeTxHash(i)
  Array.prototype.reverse.call(hash)
  return hash.toString('hex')
}

function fakeTx(i) {
  var tx = new Transaction()
  sinon.stub(tx, "getId").returns(fakeTxId(i))
  return tx
}

function buildTxs() {
  var txs = []

  for(var i=0; i<17; i++) {
    txs[i] = fakeTx(i)
  }

  txs[0].addInput(fakeTxId(13), 0)

  txs[2].addInput(fakeTxId(1), 0)
  txs[2].addInput(fakeTxId(10), 1)

  txs[3].addInput(fakeTxId(2), 0)
  txs[3].addInput(fakeTxId(5), 1)
  txs[3].addInput(fakeTxId(7), 2)

  txs[4].addInput(fakeTxId(7), 0)

  txs[5].addInput(fakeTxId(6), 0)

  txs[6].addInput(fakeTxId(8), 0)
  txs[6].addInput(fakeTxId(9), 1)

  txs[7].addInput(fakeTxId(6), 0)

  txs[8].addInput(fakeTxId(10), 0)

  txs[9].addInput(fakeTxId(10), 0)
  txs[9].addInput(fakeTxId(12), 1)

  txs[10].addInput(fakeTxId(11), 0)

  txs[14].addInput(fakeTxId(2), 0)
  txs[15].addInput(fakeTxId(14), 0)
  txs[16].addInput(fakeTxId(14), 0)

  return txs
}

module.exports = {
  buildTxs: buildTxs,
  fakeTxId: fakeTxId
}

