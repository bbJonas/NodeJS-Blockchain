const Blockchain = require('../blockchain');
const playbucks = new Blockchain();

const bc1 = {
chain: [
{
index: 1,
timestamp: 1538245974429,
transactions: [ ],
nonce: 100,
hash: "ThisIsTheGenesisBlockHash",
previousBlockHash: "0"
},
{
index: 2,
timestamp: 1538245975266,
transactions: [ ],
nonce: 139699,
hash: "0000766bfbabc901743cd1b684853fd4d398f9f898f3a95086d1c98828a40d3c",
previousBlockHash: "ThisIsTheGenesisBlockHash"
},
{
index: 3,
timestamp: 1538246428010,
transactions: [
{
amount: 10,
sender: "0000000",
recipient: "14559dc0c41611e89d4baffbb2e9bfad",
transactionId: "14dbbdb0c41611e89d4baffbb2e9bfad"
},
{
amount: 1,
sender: "JONAS9FE6A2CEE724GFWTFD",
recipient: "KENNYFVAs823rJHASF8FAd2",
transactionId: "19f7c400c41711e89d4baffbb2e9bfad"
},
{
amount: 20,
sender: "JONAS9FE6A2CEE724GFWTFD",
recipient: "KENNYFVAs823rJHASF8FAd2",
transactionId: "1c386530c41711e89d4baffbb2e9bfad"
},
{
amount: 1110,
sender: "JONAS9FE6A2CEE724GFWTFD",
recipient: "KENNYFVAs823rJHASF8FAd2",
transactionId: "1ed81650c41711e89d4baffbb2e9bfad"
}
],
nonce: 198273,
hash: "00005731bcae5e22fbf958f3032d2a8fff10d3a1d54b274771df11203758e197",
previousBlockHash: "0000766bfbabc901743cd1b684853fd4d398f9f898f3a95086d1c98828a40d3c"
},
{
index: 4,
timestamp: 1538246469060,
transactions: [
{
amount: 10,
sender: "0000000",
recipient: "14559dc0c41611e89d4baffbb2e9bfad",
transactionId: "22b131d0c41711e89d4baffbb2e9bfad"
},
{
amount: 410,
sender: "JONAS9FE6A2CEE724GFWTFD",
recipient: "KENNYFVAs823rJHASF8FAd2",
transactionId: "30aa9e20c41711e89d4baffbb2e9bfad"
},
{
amount: 20,
sender: "JONAS9FE6A2CEE724GFWTFD",
recipient: "KENNYFVAs823rJHASF8FAd2",
transactionId: "331c3a60c41711e89d4baffbb2e9bfad"
},
{
amount: 60,
sender: "JONAS9FE6A2CEE724GFWTFD",
recipient: "KENNYFVAs823rJHASF8FAd2",
transactionId: "371253c0c41711e89d4baffbb2e9bfad"
}
],
nonce: 229683,
hash: "0000f7f945e1b2be0559c58299222b910ba1798398525573cb8f8bfaa9c57eaf",
previousBlockHash: "00005731bcae5e22fbf958f3032d2a8fff10d3a1d54b274771df11203758e197"
},
{
index: 5,
timestamp: 1538246470260,
transactions: [
{
amount: 10,
sender: "0000000",
recipient: "14559dc0c41611e89d4baffbb2e9bfad",
transactionId: "3b28c660c41711e89d4baffbb2e9bfad"
}
],
nonce: 41768,
hash: "00001030b9d8b646e708d419c3ff245ee0e7b653dd5ac5c5959dc90fd0319626",
previousBlockHash: "0000f7f945e1b2be0559c58299222b910ba1798398525573cb8f8bfaa9c57eaf"
},
{
index: 6,
timestamp: 1538246471419,
transactions: [
{
amount: 10,
sender: "0000000",
recipient: "14559dc0c41611e89d4baffbb2e9bfad",
transactionId: "3bdfe160c41711e89d4baffbb2e9bfad"
}
],
nonce: 9752,
hash: "00001340e8c929d9abb7af99450bed282e10b9fa29659c74323f9a8bd41c9897",
previousBlockHash: "00001030b9d8b646e708d419c3ff245ee0e7b653dd5ac5c5959dc90fd0319626"
}
],
pendingTransactions: [
{
amount: 10,
sender: "0000000",
recipient: "14559dc0c41611e89d4baffbb2e9bfad",
transactionId: "3c90e1e0c41711e89d4baffbb2e9bfad"
}
],
currentNodeUrl: "http://localhost:3001",
networkNodes: [ ]
}

console.log('Valid:', playbucks.chainIsValid(bc1.chain));
