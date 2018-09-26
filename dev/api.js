const express = require('express');
const bodyParser = require('body-Parser');
const uuid = require('uuid/v1');

const Blockchain = require('./blockchain');
const nodeAddress = uuid().split('-').join('');

const playbucks = new Blockchain();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/blockchain', (req, res) => {
  res.send(playbucks)
});


app.post('/transaction', (req, res) => {
  const blockIndex = playbucks.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  res.json({note: `Transaction will be added on block ${blockIndex}.`});
});


app.get('/mine', (req, res) => {
  const lastBlock = playbucks.getLastBlock();
  const previousBlockHash = lastBlock.hash;
  const currentBlockData = {
    transactions: playbucks.pendingTransactions,
    index: lastBlock.index + 1
  };

  const nonce = playbucks.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = playbucks.hashBlock(previousBlockHash, currentBlockData, nonce);

  playbucks.createNewTransaction(50, '00', nodeAddress);

  const newBlock = playbucks.createNewBlock(nonce, previousBlockHash, blockHash);
  res.json({
    note: "New block mined successfully",
    block: newBlock
  });
});




var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
