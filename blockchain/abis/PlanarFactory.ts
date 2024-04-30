import { parseAbi } from "viem";

export default parseAbi([
  "constructor(address feeTo_)",
  "event FeePercentOwnershipTransferred(address indexed prevOwner, address indexed newOwner)",
  "event FeeToTransferred(address indexed prevFeeTo, address indexed newFeeTo)",
  "event OwnerFeeShareUpdated(uint256 prevOwnerFeeShare, uint256 ownerFeeShare)",
  "event OwnershipTransferred(address indexed prevOwner, address indexed newOwner)",
  "event PairCreated(address indexed token0, address indexed token1, address pair, uint256 length)",
  "event ReferrerFeeShareUpdated(address referrer, uint256 prevReferrerFeeShare, uint256 referrerFeeShare)",
  "event SetStableOwnershipTransferred(address indexed prevOwner, address indexed newOwner)",
  "function OWNER_FEE_SHARE_MAX() view returns (uint256)",
  "function REFERER_FEE_SHARE_MAX() view returns (uint256)",
  "function allPairs(uint256) view returns (address)",
  "function allPairsLength() view returns (uint256)",
  "function createPair(address tokenA, address tokenB) returns (address pair)",
  "function feeInfo() view returns (uint256 _ownerFeeShare, address _feeTo)",
  "function feePercentOwner() view returns (address)",
  "function feeTo() view returns (address)",
  "function getPair(address, address) view returns (address)",
  "function owner() view returns (address)",
  "function ownerFeeShare() view returns (uint256)",
  "function referrersFeeShare(address) view returns (uint256)",
  "function setFeePercentOwner(address _feePercentOwner)",
  "function setFeeTo(address _feeTo)",
  "function setOwner(address _owner)",
  "function setOwnerFeeShare(uint256 newOwnerFeeShare)",
  "function setReferrerFeeShare(address referrer, uint256 referrerFeeShare)",
  "function setSetStableOwner(address _setStableOwner)",
  "function setStableOwner() view returns (address)"
]);