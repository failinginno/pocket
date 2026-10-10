// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;
import "./PocketRewardsBsc.sol";
import "./PocketEligibility.sol";
import "./PocketRandomSource.sol";

/// @notice Atomic inactive deployment. No funds, owner powers or activation methods.
contract PocketDeployment {
    address public immutable rewards;
    address public immutable eligibility;
    address public immutable random;
    event Deployed(address rewards,address eligibility,address random);
    constructor(address token,address registrar,address admin,address coordinator,uint256 sub,bytes32 key,uint16 conf,uint32 gasLimit,bool nativePay) {
        require(msg.sender==admin,"deploying account must be admin");
        // A newly created contract's first CREATE nonce is 1. Rewards is child 3.
        address predicted=address(uint160(uint256(keccak256(abi.encodePacked(hex"d694",address(this),hex"03")))));
        PocketRandomSource r=new PocketRandomSource(coordinator,predicted,sub,key,conf,gasLimit,nativePay);
        PocketEligibility e=new PocketEligibility(token,registrar,admin);
        PocketRewardsBsc v=new PocketRewardsBsc(address(e),address(r),admin);
        require(address(v)==predicted,"unexpected deployment address");
        rewards=address(v);eligibility=address(e);random=address(r);
        // Deliberately leave token binding, registry binding and enable for launch.
        emit Deployed(address(v),address(e),address(r));
    }
}
