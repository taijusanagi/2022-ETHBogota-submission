// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import "./SocialRecoveryWallet.sol";

/**
 * a sampler deployer contract for SocialRecoveryWallet
 * the "initCode" for a wallet hold its address and a method call (deployWallet) with parameters, not actual constructor code.
 */
contract SocialRecoveryWalletDeployer {
  function deployWallet(
    IEntryPoint entryPoint,
    address owner,
    address[] memory guardians,
    uint256 threshold,
    uint256 salt
  ) public returns (SocialRecoveryWallet) {
    return new SocialRecoveryWallet{salt: bytes32(salt)}(entryPoint, owner, guardians, threshold);
  }
}
