// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

interface IPocketBinding {
    function token() external view returns(address);
    function eligibility() external view returns(address);
}

/// @notice Qualification registry. A trusted indexer attests buys;
/// this contract does NOT independently prove historical chain events.
contract PocketEligibility {
    address public immutable token;
    address public immutable registrar;
    address public immutable admin;
    address public vault;
    struct Qualification { address wallet; uint256 quote; bool used; }
    mapping(bytes32 => Qualification) public qualifications;
    event VaultBound(address indexed vault);
    event Registered(bytes32 indexed id, bytes32 indexed transactionHash, address indexed wallet, uint256 quote);
    event Consumed(bytes32 indexed id,address indexed wallet);

    constructor(address token_,address registrar_,address admin_) {
        require(block.chainid==56 || block.chainid==97 || block.chainid==1337 || block.chainid==31337,"unsupported chain");
        require(token_!=address(0) && registrar_!=address(0) && admin_!=address(0),"configuration");
        token=token_;registrar=registrar_;admin=admin_;
    }
    function bindVault(address vault_) external {
        require(msg.sender==admin,"admin");
        require(vault==address(0) && vault_.code.length>0,"binding");
        require(IPocketBinding(vault_).token()==token && IPocketBinding(vault_).eligibility()==address(this),"wrong vault");
        vault=vault_;emit VaultBound(vault_);
    }
    function idFor(bytes32 transactionHash) public view returns(bytes32) {
        return keccak256(abi.encode(block.chainid,token,transactionHash));
    }
    /// @dev One immutable record per transaction, not per log or wallet.
    /// Registrar can fabricate attestations: production requires a secured service and review.
    function register(bytes32 transactionHash,address wallet,uint256 quote) external returns(bytes32 id) {
        require(msg.sender==registrar,"registrar");
        require(vault!=address(0),"not bound");
        require(transactionHash!=bytes32(0) && wallet!=address(0) && quote>=.05 ether,"invalid buy");
        id=idFor(transactionHash);
        require(qualifications[id].wallet==address(0),"already registered");
        qualifications[id]=Qualification(wallet,quote,false);
        emit Registered(id,transactionHash,wallet,quote);
    }
    function consume(bytes32 id,address wallet) external returns(uint256 quote) {
        require(msg.sender==vault && vault!=address(0),"vault only");
        Qualification storage q=qualifications[id];
        require(q.wallet!=address(0) && q.wallet==wallet && !q.used,"invalid qualification");
        q.used=true;emit Consumed(id,wallet);return q.quote;
    }
}
