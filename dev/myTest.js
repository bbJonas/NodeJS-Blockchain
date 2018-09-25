const sha256 = require('js-sha256');

const Blockchain = require('./blockchain');
const playbuck = new Blockchain();

var FakeTx = function() {
  this.amount = Math.round(Math.random()*100),
  this.sender = sha256(JSON.stringify(Math.random())),
  this.recipient = sha256(JSON.stringify(Math.random()))
};


for (i = 0; i < 100; i++) {

  var tx1 = new FakeTx();
  var tx2 = new FakeTx();

  playbuck.pendingTransactions.push(tx1, tx2);

  var currentBlockData = playbuck.pendingTransactions
  var lastBlock = playbuck.getLastBlock();

  var powNonce = playbuck.proofOfWork(lastBlock.hash, currentBlockData);
  var currentBlockHash = playbuck.hashBlock(lastBlock.hash, currentBlockData, powNonce);

  playbuck.createNewBlock(powNonce, lastBlock.hash, currentBlockHash);

  console.log(lastBlock);
};
