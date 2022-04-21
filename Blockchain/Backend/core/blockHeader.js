const { hash256 } = require("../util/util.js");

class BlockHeader {
  constructor(version, prevBlockhash, merkleRoot, timestamp, bits) {
    this.version = version;
    this.prevBlockhash = prevBlockhash;
    this.timestamp = timestamp;
    this.merkleRoot = merkleRoot;
    this.bits = bits;
    this.nonce = 0;
    this.blockhash = "";
  }

  mine() {
    while (this.blockhash.substring(0, 4) != "0000") {
      // Generate Block Hashes by changing the Nonce Value
      this.blockhash = hash256(
        this.version.toString() +
          this.prevBlockhash +
          this.merkleRoot +
          this.timestamp.toString() +
          this.bits.toString() +
          this.nonce.toString()
      );
      // Increment the Nonce Value
      this.nonce += 1;

      process.stdout.write(
        `Mining Started ${this.nonce} and Hash Value is ${this.blockhash} \r`
      );
    }
  }
}

// Execute only if it is called from the same file
// This won't get executed when imported in another file
if (require.main === module) {
  const blockheader = new BlockHeader(1, 1, Date.now(), 1);
  blockheader.mine();
}

module.exports = { BlockHeader };
