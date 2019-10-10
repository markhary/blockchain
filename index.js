const blockHash = require('./blockHash');

const start = async (blockHeights) => {
    blockHeights.forEach(async (bh) => {
      const hash = await blockHash.calculateHash(bh);
      console.log(`Calculated hash for block ${bh}: ${hash}`);
    });
};

const blockHeights = process.argv.slice(2);
if (blockHeights.length < 1) {
    console.log('usage: node index.js [blockHeights]');
    console.log ('   e.g. shell> node index.js 125552 390624 490624');
} else {
    start(blockHeights);
}