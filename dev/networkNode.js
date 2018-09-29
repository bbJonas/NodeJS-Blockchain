const express = require('express');
const bodyParser = require('body-Parser');
const uuid = require('uuid/v1');
const rp = require('request-promise');
const port = process.argv[2] || 3000;

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
  const newTransaction = req.body;
  const blockIndex = playbucks.addTransactionToPendingTransactions(newTransaction);
  res.json({ note: `Transaction will be added on block ${blockIndex}` });
});


app.post('/transaction/broadcast', (req, res) => {
  const newTransaction = playbucks.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  playbucks.addTransactionToPendingTransactions(newTransaction);

  const requestPromises = [];
  playbucks.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/transaction',
      method: 'POST',
      body: newTransaction,
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
  .then(data => {
    res.json({ note: 'Transaction created and broadcast successfully.' });
  });
});


// mine a block
app.get('/mine', (req, res) => {
  const lastBlock = playbucks.getLastBlock();
  const previousBlockHash = lastBlock.hash;
  const currentBlockData = {
    transactions: playbucks.pendingTransactions,
    index: lastBlock.index + 1
  };

  const nonce = playbucks.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = playbucks.hashBlock(previousBlockHash, currentBlockData, nonce);
  const newBlock = playbucks.createNewBlock(nonce, previousBlockHash, blockHash);

  const requestPromises = [];
  playbucks.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/receive-new-block',
      method: 'POST',
      body: { newBlock: newBlock },
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
  .then(data => {
    const requestOptions = {
      uri: playbucks.currentNodeUrl + '/transaction/broadcast',
      method: 'POST',
      body: {
        amount: 10,
        sender: '0000000',
        recipient: nodeAddress
      },
      json: true
    };

    return rp(requestOptions);
  })
  .then(data => {
    res.json({
      note: "New block mined & broadcast successfully.",
      block: newBlock
    });
  });
});


app.post('/receive-new-block', (req, res) => {
  const newBlock = req.body.newBlock;
  const lastBlock = playbucks.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock.index + 1 === newBlock.index;

  if (correctHash && correctIndex) {
    playbucks.chain.push(newBlock);
    playbucks.pendingTransactions = [];
    res.json({
      note: 'New block received and accepted.',
      newBlock: newBlock
    });
  } else {
    res.json({
      note: 'New block rejected.',
      newBlock: newBlock
    });
  }
});


// register node and broadcast it to the network
app.post('/register-and-broadcast-node', (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;
  if (playbucks.networkNodes.indexOf(newNodeUrl) == -1) playbucks.networkNodes.push(newNodeUrl);

  const regNodesPromises = [];
  playbucks.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/register-node',
      method: 'POST',
      body: {newNodeUrl: newNodeUrl},
      json: true
    };

    regNodesPromises.push(rp(requestOptions));
  });

  Promise.all(regNodesPromises)
  .then(data => {
    const bulkRegisterOptions = {
      uri: newNodeUrl + '/register-nodes-bulk',
      method: 'POST',
      body: { allNetworkNodes: [...playbucks.networkNodes, playbucks.currentNodeUrl] },
      json: true
    };

    return rp(bulkRegisterOptions);
  })
  .then(data => {
    res.json({ note: 'New node registered with network successfully.' });
  });
});


// register a node with the network
app.post('/register-node', (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent = playbucks.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = playbucks.currentNodeUrl !== newNodeUrl;
  if (nodeNotAlreadyPresent && notCurrentNode) playbucks.networkNodes.push(newNodeUrl);
  res.json({ note: 'New node registered successfully.' });
});


// register multiple nodes at once
app.post('/register-nodes-bulk', (req, res) => {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach(networkNodeUrl => {
    const nodeNotAlreadyPresent = playbucks.networkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNode = playbucks.currentNodeUrl !== networkNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) playbucks.networkNodes.push(networkNodeUrl);
  });

  res.json({ note: 'Bulk registration successful.' });
});


app.get('/consensus', (req, res) => {
  const requestPromises = [];

  playbucks.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/blockchain',
      method: 'GET',
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
  .then(blockchains => {
    const currentChainLength = playbucks.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach(blockchain => {
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions =  blockchain.pendingTransactions;
      };
    });

    if (!newLongestChain || (newLongestChain && !playbucks.chainIsValid(newLongestChain))) {
      res.json({
        note: 'Current chain has not been replaced.',
        chain: playbucks.chain
      });
    }
    else if (newLongestChain && playbucks.chainIsValid(newLongestChain)) {
      playbucks.chain = newLongestChain;
      playbucks.pendingTransactions = newPendingTransactions;
      res.json({
        note: 'This chain has been replaced.',
        chain: playbucks.chain
      });
    }
    else {
      res.json({
        note: 'Something went wrong.'
      });
    }
  });
});


app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
