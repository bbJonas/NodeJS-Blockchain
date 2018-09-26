const express = require('express');
const bodyParser = require('body-Parser');

const Blockchain = require('./blockchain');
const playbucks = new Blockchain();

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/blockchain', (req, res) => {
  res.send(playbucks)
});


app.post('/transaction', (req, res) => {
  const blockIndex = playbucks.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  res.json({ note: `Transaction will be added on block ${blockIndex}.`});
});


app.get('/mine', (req, res) => {

});




var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
