// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import "./SocialRecoveryWallet.sol";

contract SocialRecoveryWalletDeployer {
  function deployWallet(
    IEntryPoint entryPoint,
    address owner,
    uint256 salt
  ) public returns (SocialRecoveryWallet) {
    return new SocialRecoveryWallet{salt: bytes32(salt)}(entryPoint, owner);
  }
}
