var sinon = require('sinon')
var Transaction = require('bitcoinjs-lib').Transaction
var ECKey = require('bitcoinjs-lib').ECKey

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

  addInputAndOutput(txs[0], txs[13], 0)

  addInputAndOutput(txs[2], txs[1], 0)
  addInputAndOutput(txs[2], txs[10], 0)

  addInputAndOutput(txs[14], txs[2], 0)
  addInputAndOutput(txs[3], txs[2], 1)

  addInputAndOutput(txs[3], txs[5], 0)
  addInputAndOutput(txs[3], txs[7], 0)

  addInputAndOutput(txs[4], txs[7], 1)

  addInputAndOutput(txs[5], txs[6], 0)

  addInputAndOutput(txs[6], txs[8], 0)
  addInputAndOutput(txs[6], txs[9], 0)

  addInputAndOutput(txs[7], txs[6], 1)

  addInputAndOutput(txs[8], txs[10], 1)

  addInputAndOutput(txs[9], txs[10], 2)
  addInputAndOutput(txs[9], txs[12], 0)

  addInputAndOutput(txs[10], txs[11], 0)

  addInputAndOutput(txs[15], txs[14], 0)
  addInputAndOutput(txs[16], txs[14], 1)

  return txs
}

function addInputAndOutput(tx, prevTx, prevOutputIndex) {
  tx.addInput(prevTx.getId(), prevOutputIndex)
  var value = (prevOutputIndex + 1) * 1000
  prevTx.addOutput(ECKey.makeRandom().pub.getAddress(), value)
}

module.exports = {
  buildTxs: buildTxs,
  fakeTxId: fakeTxId
}

