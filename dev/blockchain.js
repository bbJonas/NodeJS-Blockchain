const sha256 = require('js-sha256');

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];

  this.createNewBlock(100, '0', 'ThisIsTheGenesisBlock')
};


Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce,
    hash,
    previousBlockHash
  };

  this.pendingTransactions = [];
  this.chain.push(newBlock);

  return newBlock;
};

Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length -1];
};

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
  const newTransaction = {
    amount,
    sender,
    recipient,
  };

  this.pendingTransactions.push(newTransaction);

  return this.getLastBlock() ['index'] + 1;
};


Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
  const dataAsString = previousBlockHash + JSON.stringify(currentBlockData) + JSON.stringify(nonce);
  const hash = sha256(dataAsString);
  return hash;
};


Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

  while (hash.substring(0, 4) !== '0000') {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  };

  return nonce
};


module.exports = Blockchain;
