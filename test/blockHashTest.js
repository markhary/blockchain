const blockHash = require('../blockHash');
const expect = require('chai').expect;

const b125552 = 125552;
const b390624 = 390624;
const b490624 = 490624;

describe('#blockHash()', function() {
  this.timeout(20000);
  this.slow(10000);

  context(`Testing Block Height ${b125552}`, function() {
    it('Should pass (version 1)', async () => {
      const blockHeight = b125552;
      const calculatedHash = await blockHash.calculateHash(blockHeight);
      const hash = await blockHash.getBlockHash(blockHeight);
      expect(calculatedHash).to.equal(hash);
    });
  });
  
  context(`Testing Block Height ${b390624}`, function() {
    it('Should pass (version 4)', async () => {
      const blockHeight = b390624;
      const calculatedHash = await blockHash.calculateHash(blockHeight);
      const hash = await blockHash.getBlockHash(blockHeight);
      expect(calculatedHash).to.equal(hash);
    });
  });

  context(`Testing Block Height ${b490624}`, function() {
    it('Should pass (version 0x20000000)', async () => {
      const blockHeight = b490624;
      const calculatedHash = await blockHash.calculateHash(blockHeight);
      const hash = await blockHash.getBlockHash(blockHeight);
      expect(calculatedHash).to.equal(hash);
    });
  });
});