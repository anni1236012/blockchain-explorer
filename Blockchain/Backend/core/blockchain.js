require("dotenv").config();
const { hash256 } = require("../util/util");
const block = require("./block");
const blockchain = require("./blockHeader");
const Block = require("../database/model/blockSchema");
const connect = require("../database/dbtest");
const getLastBlock = require("../database/read");

VERSION = 1;
const ZERO_HASH = String("0").padStart(64, "0");

let mongoose = "";

class Blockchain {
  async GenesisBlock() {
    try {
      console.log(mongoose.connection.readyState);
      const BlockHeight = 0;
      const prevBlockHash = ZERO_HASH;
      await this.addBlock(BlockHeight, prevBlockHash);
    } catch (err) {
      console.log(`Error in Genesis Blockchain Function \n ${err}`);
    }
  }

  async addBlock(BlockHeight, prevBlockHash) {
    let timestamp = Date.now();
    let Transaction = `Codies Alert sent ${BlockHeight} to Anni Maan`;
    let merkleRoot = hash256(Transaction);
    let bits = "ffff001f";
    let blockHeader = new blockchain.BlockHeader(
      VERSION,
      prevBlockHash,
      merkleRoot,
      timestamp,
      bits
    );
    blockHeader.mine();

    let BlockObj = {
      Height: BlockHeight,
      BlockSize: 1,
      blockHeader: {
        version: 1,
        prevBlockHash: blockHeader.prevBlockhash,
        merkleroot: merkleRoot,
        timestamp: timestamp,
        bits: bits,
        nonce: blockHeader.nonce,
        blockhash: blockHeader.blockhash,
      },
      TxCount: 1,
      Transactions: Transaction,
    };

    // Mongoose Schema, Write data
    try {
      await new Block(BlockObj).save();
      console.log(BlockObj);
      console.log("Block Written Successfully");
      this.chain = new block.Block(BlockHeight, 1, blockHeader, 1, Transaction);
    } catch (err) {
      console.log(`Error in addBlock Function \n ${err}`);
    }
  }

  // Main Function to trigger the process
  async main() {
    const lastBlock = await getLastBlock.main(true);
    console.log(lastBlock[0]);
    this.chain = lastBlock[0];

    if (!this.chain) {
      await this.GenesisBlock();
    }

    while (true) {
      console.log(mongoose.connection.readyState);
      let lastBlock = this.chain;
      let Blockheight = lastBlock.Height + 1;
      let prevBlockHash = lastBlock.blockHeader.blockhash;
      await this.addBlock(Blockheight, prevBlockHash);
    }
  }
}

const createConnection = async () => {
  try {
    mongoose = await connect();
    const blockchain = new Blockchain();
    blockchain.main();
  } catch (err) {
    console.log("Error while con", err);
  }
};

createConnection();
