import { parseAbi } from "viem";

export default parseAbi([
  "error CallFailed()",
  "function aggregate((address, bytes)[] calls) returns (uint256 blockNumber, bytes[] returnData)",
  "function getBlockHash(uint256 blockNumber) view returns (bytes32 blockHash)",
  "function getCurrentBlockCoinbase() view returns (address coinbase)",
  "function getCurrentBlockGasLimit() view returns (uint256 gaslimit)",
  "function getCurrentBlockTimestamp() view returns (uint256 timestamp)",
  "function getEthBalance(address addr) view returns (uint256 balance)",
  "function getLastBlockHash() view returns (bytes32 blockHash)",
]);
