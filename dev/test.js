const Blockchain = require('./blockchain');
const playbucks = new Blockchain();

const previousBlockHash = '82AfDLEWFBN83rkbYSLLFiwafbASD';
const currentBlockData = [
  {
    amount: 10,
    sender: 'JONASlkdan2309AWaf12498AADF8214F',
    recipient: 'JUSTUSl9021rkjwefNLKFNfasf23raDAF'
  },
  {
    amount: 30,
    sender: 'ALKNF929rhaklsnfqasgsg3w978urfa',
    recipient: 'JFdfhAOfj23fLslipgfnq3r9acfwfF'
  },
  {
    amount: 69,
    sender: 'NklANCF9q3tr9hwq3t0akelkgntso98ef',
    recipient: 'Klanebfiuzabnr038927g3rbfhjabk783r'
  }
];

console.log(playbucks.proofOfWork(previousBlockHash, currentBlockData));
