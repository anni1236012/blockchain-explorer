const connect = require("./Backend/database/dbtest");
const Block = require("./Backend/database/model/blockSchema");

const createConnection = async () => {
  try {
    mongoose = await connect();
    while (true) {
      let BlockObj = {
        Height: 1,
        BlockSize: 1,
        blockHeader: {
          version: 1,
          prevBlockHash: "00000",
          timestamp: Date.now(),
          bits: "dafdaf",
          nonce: 56463,
          blockHash: "adsfadfs",
        },
        TxCount: 1,
        Transactions: "Test Transactions",
      };

      await new Block(BlockObj).save();
      console.log("Block Written Successfully");
    }
  } catch (err) {
    console.log("Error while con", err);
  }
};

createConnection();
