const Websocket = require('ws');
const fs = require('fs');
const rq = require('request-promise');
var util = require('util')

// const HTTP_PORT = process.env.HTTP_PORT || 3001; //for information purposes
const HTTP_PORT = process.env.HTTP_PORT || 3001;
const P2P_PORT = process.env.P2P_PORT || 5001;
var peers = process.env.PEERS ? process.env.PEERS.split(',') : [];


class P2pServer {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  listen() {
    const server = new Websocket.Server({ port: P2P_PORT });
    server.on('connection', socket => this.connectSocket(socket));

    this.connectToPeers();

    console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
  }

  connectToPeers() {
    peers.forEach(peer => {
      const socket = new Websocket(peer);

      socket.on('open', () => this.connectSocket(socket));
    });
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.log('Socket connected');

    // console.log(socket._socket.address()); FIND IP OF A CONNECTED SOCKET!!!

    this.blockchain.p2pServers.push(socket._socket.address())
    console.log(this.blockchain.p2pServers);

    this.messageHandler(socket);

    socket.send(JSON.stringify(this.blockchain.chain));
  }

  messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);
      var validChain = this.blockchain.chainIsValid(data);
      console.log(validChain);
      console.log('data', data);
    });
  }

  sendChain(socket) {
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  syncChains() {
    this.sockets.forEach(socket => this.sendChain(socket));
  }

  // getPeers() {
  //   return new Promise(function(resolve, reject) {
  //     fs.readFile('./dev/etc/peers.json', {encoding: "utf8"}, (err, peerList) => {
  //       if (err) reject(err);
  //
  //       var peerListObject = JSON.parse(peerList);
  //
  //       peerListObject.peers.forEach(peer => {
  //         if (peers.indexOf(peer) === -1) {
  //           console.log('hi');
  //           peers.push(peer);
  //           console.log(peers);
  //         }
  //       });
  //       resolve(peers);
  //     });
  //     resolve(peers);
  //   });
  // }

}; //ende

module.exports = P2pServer;
