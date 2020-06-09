const fetch = require('node-fetch');
const crypto = require('crypto');

// Perhaps irresponsible, but I will hardcode URL for now
async function fetchBlock(blockHeight) {
  let response = await fetch(`https://blockchain.info/block-height/${blockHeight}?format=json`);
  let data = await response.json();
  return data;
}

async function getBlockHash(blockHeight) {
  let response = await fetch(`https://blockchain.info/block-height/${blockHeight}?format=json`);
  let data = await response.json();
  return data.blocks[0].hash;
}

async function calculateHash(blockHeight) {
  const block = await fetchBlock(blockHeight);
  const block0 = block.blocks[0];

  const version = block0.ver.toString(16).padStart(8, '0');
  const previousBlock = block0.prev_block.toString(16);
  const merkleRoot = block0.mrkl_root;
  const timestamp = block0.time.toString(16).padStart(8, '0');
  const difficultyBits = block0.bits.toString(16).padStart(8, '0');
  // treat nonce as an unsigned int
  const nonce = (block0.nonce >>> 0).toString(16).padStart(8, '0');

  // Convert to Little Endian
  const versionLE = version
    .match(/.{1,2}/g)
    .reverse()
    .join('');
  const previousBlockLE = previousBlock
    .match(/.{1,2}/g)
    .reverse()
    .join('');
  const merkleRootLE = merkleRoot
    .match(/.{1,2}/g)
    .reverse()
    .join('');
  const timestampLE = timestamp
    .match(/.{1,2}/g)
    .reverse()
    .join('');
  const difficultyBitsLE = difficultyBits
    .match(/.{1,2}/g)
    .reverse()
    .join('');
  const nonceLE = nonce
    .match(/.{1,2}/g)
    .reverse()
    .join('');

  // From https://bitcoin.org/en/developer-reference
  // Size (B)     Field                Description
  // --           --                   --
  // 4            Version              The bitcoin version number
  // 32           Previous Block Hash  The previous block header hash
  // 32           Merkle Root          A hash of the root of the merkle tree of this block's transactions
  // 4            Timestamp            The UNIX timestamp of the block (GMT)
  // 4            Difficulty Target    The difficulty target for the block
  // 4            Nonce                The counter used by miners to generate a correct hash

  const header = versionLE + previousBlockLE + merkleRootLE + timestampLE + difficultyBitsLE + nonceLE;

  const firstPassHash = crypto.createHash('sha256').update(header, 'hex').digest('hex');
  const headerHashLE = crypto.createHash('sha256').update(firstPassHash, 'hex').digest('hex');
  const headerHash = headerHashLE
    .match(/.{1,2}/g)
    .reverse()
    .join('');

  return headerHash;
}

// exports the functions above
module.exports.fetchBlock = fetchBlock;
module.exports.calculateHash = calculateHash;
module.exports.getBlockHash = getBlockHash;
