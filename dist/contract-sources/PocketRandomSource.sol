// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;
import {IVRFCoordinatorV2Plus} from "../vendor/chainlink/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import {VRFV2PlusClient} from "../vendor/chainlink/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
interface IRandomVault {
    function randomSource() external view returns(address);
    function fulfill(bytes32 id,uint256 word) external;
}
/// @notice Non-upgradeable random adapter. All configuration is constructor-immutable.
/// @dev Uses official request ABI, but deliberately omits the migratable consumer base.
contract PocketRandomSource {
    address public immutable vault;
    IVRFCoordinatorV2Plus public immutable coordinator;
    uint256 public immutable subscriptionId;
    bytes32 public immutable keyHash;
    uint16 public immutable confirmations;
    uint32 public immutable callbackGasLimit;
    bool public immutable nativePayment;
    struct Request { bytes32 visit; bool exists; bool ready; bool delivered; uint256 word; }
    mapping(uint256=>Request) public requests;
    mapping(bytes32=>bool) public requested;
    mapping(bytes32=>uint256) public requestFor;
    event Requested(bytes32 indexed visit,uint256 indexed requestId);
    event RandomStored(uint256 indexed requestId);
    event Delivered(uint256 indexed requestId,bytes32 indexed visit);
    constructor(address coordinator_,address vault_,uint256 sub,bytes32 key,uint16 conf,uint32 gasLimit,bool nativePay) {
        require(block.chainid==56 || block.chainid==97 || block.chainid==1337 || block.chainid==31337,"unsupported chain");
        require(coordinator_.code.length>0 && vault_!=address(0) && sub>0 && key!=bytes32(0) && conf>=3 && gasLimit>=100000,"configuration");
        coordinator=IVRFCoordinatorV2Plus(coordinator_);vault=vault_;
        subscriptionId=sub;keyHash=key;confirmations=conf;callbackGasLimit=gasLimit;nativePayment=nativePay;
    }
    function request(bytes32 visit) external {
        require(msg.sender==vault && vault!=address(0),"vault only");
        require(visit!=bytes32(0) && !requested[visit],"duplicate");
        requested[visit]=true;
        uint256 id=coordinator.requestRandomWords(VRFV2PlusClient.RandomWordsRequest({
            keyHash:keyHash,subId:subscriptionId,requestConfirmations:confirmations,
            callbackGasLimit:callbackGasLimit,numWords:1,
            extraArgs:VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment:nativePayment}))
        }));
        require(!requests[id].exists,"request collision");
        requests[id]=Request(visit,true,false,false,0);requestFor[visit]=id;emit Requested(visit,id);
    }
    function rawFulfillRandomWords(uint256 id,uint256[] calldata words) external {
        require(msg.sender==address(coordinator),"coordinator only");
        Request storage r=requests[id];
        // Keep callback bounded and free of external calls. Ignore duplicate/unknown callbacks.
        if(!r.exists || r.ready || words.length!=1)return;
        r.word=words[0];r.ready=true;emit RandomStored(id);
    }
    function deliver(uint256 id) external {
        Request storage r=requests[id];require(r.exists && r.ready && !r.delivered,"not deliverable");
        r.delivered=true;IRandomVault(vault).fulfill(r.visit,r.word);emit Delivered(id,r.visit);
        // A failed downstream call rolls back delivered, so the SAME word can be retried.
    }
}
