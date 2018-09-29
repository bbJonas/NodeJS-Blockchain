const sha256 = require('js-sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];

  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];

  this.createNewBlock(100, '0', 'ThisIsTheGenesisBlockHash')
};


Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce: nonce,
    hash: hash,
    previousBlockHash: previousBlockHash
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
    transactionId: uuid().split('-').join('')
  };

  return newTransaction;
};


Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
  this.pendingTransactions.push(transactionObj);
  return this.getLastBlock().index + 1;
};


Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
  const dataAsString = previousBlockHash + JSON.stringify(currentBlockData) + JSON.stringify(nonce);
  const hash = sha256(dataAsString);
  return hash;
};


Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

  while (hash.substring(0, 5) !== '00000') {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  };

  return nonce
};


Blockchain.prototype.chainIsValid = function(blockchain) {
  let validChain = true;

  for (var i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i];
    const previousBlock = blockchain[i - 1];
    const blockHash = this.hashBlock(previousBlock.hash, {
      transactions: currentBlock.transactions,
      index: currentBlock.index
    }, currentBlock.nonce);

    if (blockHash.substring(0, 4) !== '0000') validChain = false;
    if (currentBlock.previousBlockHash !== previousBlock.hash) validChain = false;
  };

  const genesisBlock = blockchain[0];
  const correctNonce = genesisBlock.nonce === 100;
  const correctPreviousHash = genesisBlock.previousBlockHash === '0';
  const correctHash = genesisBlock.hash === 'ThisIsTheGenesisBlockHash';
  const correctTransactions = genesisBlock.transactions.length === 0;

  if (!correctNonce || !correctPreviousHash || !correctHash || !correctTransactions) validChain = false;

  return validChain;
};


module.exports = Blockchain;
