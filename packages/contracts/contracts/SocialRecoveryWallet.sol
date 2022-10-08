// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

/**
 ** This is inspired by
 ** https://vitalik.ca/general/2021/01/11/recovery.html
 ** This impementation is extended from
 ** https://github.com/verumlotus/social-recovery-wallet/blob/main/src/Wallet.sol
 **/

import "@account-abstraction/contracts/samples/SimpleWallet.sol";

contract SocialRecoveryWallet is SimpleWallet {
  /************************************************
   *  STORAGE
   ***********************************************/

  /// @notice true if hash of guardian address, else false
  mapping(address => bool) public isGuardian;

  /// @notice stores the guardian threshold
  uint256 public threshold;

  /// @notice true iff wallet is in recovery mode
  bool public inRecovery;

  /// @notice round of recovery we're in
  uint256 public currRecoveryRound;

  /// @notice struct used for bookkeeping during recovery mode
  /// @dev trival struct but can be extended in future (when building for malicious guardians
  /// or when owner key is compromised)
  struct Recovery {
    address proposedOwner;
    uint256 recoveryRound; // recovery round in which this recovery struct was created
    bool usedInExecuteRecovery; // set to true when we see this struct in RecoveryExecute
  }

  /// @notice mapping from guardian address to most recent Recovery struct created by them
  mapping(address => Recovery) public guardianToRecovery;

  /************************************************
   *  MODIFIERS & EVENTS
   ***********************************************/

  modifier onlyGuardian() {
    require(isGuardian[msg.sender], "only guardian");
    _;
  }

  modifier notInRecovery() {
    require(!inRecovery, "wallet is in recovery mode");
    _;
  }

  modifier onlyInRecovery() {
    require(inRecovery, "wallet is not in recovery mode");
    _;
  }

  /// @notice emit when recovery initiated
  event RecoveryInitiated(address indexed by, address newProposedOwner, uint256 indexed round);

  /// @notice emit when recovery supported
  event RecoverySupported(address by, address newProposedOwner, uint256 indexed round);

  /// @notice emit when recovery is cancelled
  event RecoveryCancelled(address by, uint256 indexed round);

  /// @notice emit when recovery is executed
  event RecoveryExecuted(address oldOwner, address newOwner, uint256 indexed round);

  constructor(IEntryPoint anEntryPoint, address anOwner) SimpleWallet(anEntryPoint, anOwner) {}

  function setGuardians(address[] memory guardians, uint256 _threshold) public {
    require(_threshold <= guardians.length, "threshold too high");
    for (uint256 i = 0; i < guardians.length; i++) {
      require(!isGuardian[guardians[i]], "duplicate guardian");
      isGuardian[guardians[i]] = true;
    }
    threshold = _threshold;
  }

  /**
   * @notice Allows a guardian to initiate a wallet recovery
   * Wallet cannot already be in recovery mode
   * @param _proposedOwner - address of the new propsoed owner
   */
  function initiateRecovery(address _proposedOwner) external onlyGuardian notInRecovery {
    // we are entering a new recovery round
    currRecoveryRound++;
    guardianToRecovery[msg.sender] = Recovery(_proposedOwner, currRecoveryRound, false);
    inRecovery = true;
    emit RecoveryInitiated(msg.sender, _proposedOwner, currRecoveryRound);
  }

  /**
   * @notice Allows a guardian to support a wallet recovery
   * Wallet must already be in recovery mode
   * @param _proposedOwner - address of the proposed owner;
   */
  function supportRecovery(address _proposedOwner) external onlyGuardian onlyInRecovery {
    guardianToRecovery[msg.sender] = Recovery(_proposedOwner, currRecoveryRound, false);
    emit RecoverySupported(msg.sender, _proposedOwner, currRecoveryRound);
  }

  /**
   * @notice Allows the owner to cancel a wallet recovery (assuming they recovered private keys)
   * Wallet must already be in recovery mode
   * @dev TODO: allow guardians to cancel recovery
   * (need more than one guardian else trivially easy for one malicious guardian to DoS a wallet recovery)
   */
  function cancelRecovery() external onlyOwner onlyInRecovery {
    inRecovery = false;
    emit RecoveryCancelled(msg.sender, currRecoveryRound);
  }

  /**
   * @notice Allows a guardian to execute a wallet recovery and set a newOwner
   * Wallet must already be in recovery mode
   * @param newOwner - the new owner of the wallet
   * @param guardianList - list of addresses of guardians that have voted for this newOwner
   */
  function executeRecovery(address newOwner, address[] calldata guardianList) external onlyGuardian onlyInRecovery {
    // Need enough guardians to agree on same newOwner
    require(guardianList.length >= threshold, "more guardians required to transfer ownership");

    // Let's verify that all guardians agreed on the same newOwner in the same round
    for (uint256 i = 0; i < guardianList.length; i++) {
      // cache recovery struct in memory
      Recovery memory recovery = guardianToRecovery[guardianList[i]];

      require(recovery.recoveryRound == currRecoveryRound, "round mismatch");
      require(recovery.proposedOwner == newOwner, "disagreement on new owner");
      require(!recovery.usedInExecuteRecovery, "duplicate guardian used in recovery");

      // set field to true in storage, not memory
      guardianToRecovery[guardianList[i]].usedInExecuteRecovery = true;
    }

    inRecovery = false;
    address _oldOwner = owner;
    owner = newOwner;
    emit RecoveryExecuted(_oldOwner, newOwner, currRecoveryRound);
  }
}
