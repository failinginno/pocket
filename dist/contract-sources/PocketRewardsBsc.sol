// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

interface IEligibility { function consume(bytes32 id, address wallet) external returns(uint256 quote); function token() external view returns(address); }
interface IRandomSource { function request(bytes32 id) external; }

/// @notice Fixed-rule rewards. Deployment starts inactive; activation is a separate step.
contract PocketRewardsBsc {
    address public immutable eligibility;
    address public immutable randomSource;
    address public token;
    bool public enabled;
    mapping(bytes32 => uint256) public randomWords;
    mapping(bytes32 => bool) public randomReady;
    address public immutable controller;

    uint256 public accounted;
    uint256 public rewardPool;
    uint256 public reserved;
    uint256 public liabilities;
    uint256 public totalPaid;
    uint256 public currentDay;
    uint256 private entered;
    struct Visit { address wallet; uint256 day; uint256 basis; uint256 maximum; bool settled; }
    mapping(bytes32 => Visit) public visits;
    mapping(address => uint256) public claimable;
    mapping(address => bytes32) public active;
    // Statistics only: neither timestamp nor count restricts participation.
    mapping(address => uint256) public lastFinished;
    mapping(address => mapping(uint256 => uint256)) public dailyCount;
    event Revenue(uint256 amount);
    event Queued(bytes32 indexed id, address indexed wallet, uint256 maximum);
    event Settled(bytes32 indexed id, address indexed wallet, uint256 tier, bool accepted, uint256 amount);
    event Paid(address indexed wallet, uint256 amount);
    event PaymentDeferred(address indexed wallet, uint256 amount);
    modifier guard() { require(entered == 0, "reentrancy"); entered = 1; _; entered = 0; }
    modifier onlyController() { require(msg.sender == controller, "controller"); _; }
    constructor(address eligibility_, address randomSource_, address admin_) {
        require(block.chainid == 56 || block.chainid == 1337 || block.chainid == 31337 || block.chainid == 97, "unsupported chain");
        require(eligibility_.code.length > 0 && randomSource_.code.length > 0 && admin_ != address(0), "configuration");
        eligibility=eligibility_; randomSource=randomSource_; controller=admin_;
        currentDay=block.timestamp / 1 days;
    }
    event TokenBound(address indexed token);
    event Enabled();
    function bindToken(address token_) external onlyController {
        require(token == address(0) && token_.code.length > 0, "already bound or missing code");
        require(token_ == IEligibility(eligibility).token(), "wrong token");
        token=token_; emit TokenBound(token_);
    }
    function enable() external onlyController { require(token != address(0) && !enabled,"configuration"); enabled=true; emit Enabled(); }
    receive() external payable { _sync(); }
    function sync() external { _sync(); }
    /// @notice Maximum is 20% of unreserved funds, with no fixed BNB cap.
    function maximumFor(uint256 available) public pure returns (uint256) {
        return available / 5;
    }
    function _sync() private {
        currentDay = block.timestamp / 1 days;
        uint256 balance = address(this).balance;
        if (balance <= accounted) return;
        uint256 amount = balance - accounted; accounted = balance;
        rewardPool += amount;
        emit Revenue(amount);
    }
    /// @notice Anyone may relay; eligibility is checked by an immutable verifier.
    /// @dev The production verifier must map each qualifying buy to one canonical ID.
    /// No cooldown or daily limit; one active visit per wallet, one use per ID.
    function enqueue(bytes32 id, address wallet) external guard {
        require(enabled,"not enabled");
        uint256 quote=IEligibility(eligibility).consume(id,wallet);
        _sync();
        require(id != bytes32(0) && wallet != address(0) && visits[id].wallet == address(0), "duplicate/invalid");
        require(quote >= .05 ether && active[wallet] == bytes32(0), "eligibility");
        uint256 basis = rewardPool - reserved;
        uint256 maximum = maximumFor(basis);
        require(maximum > 0, "empty pool");
        visits[id] = Visit(wallet, currentDay, basis, maximum, false);
        reserved += maximum;
        active[wallet] = id; dailyCount[wallet][currentDay]++;
        emit Queued(id, wallet, maximum);
        IRandomSource(randomSource).request(id);
    }
    /// @notice Callback only stores randomness. No transfers or token calls here.
    function fulfill(bytes32 id,uint256 word) external {
        require(msg.sender == randomSource,"random source");
        require(visits[id].wallet != address(0) && !randomReady[id],"unknown/duplicate");
        randomWords[id]=word; randomReady[id]=true;
    }
    /// @notice Settlement is permissionless and cannot replace a delivered random word.
    function settle(bytes32 id) external guard {
        require(randomReady[id],"random pending");
        uint256 entropy=randomWords[id];
        _sync(); Visit storage v = visits[id];
        require(v.wallet != address(0) && !v.settled, "closed/missing");
        uint256 roll = uint256(keccak256(abi.encode(entropy, id, uint8(0)))) % 100;
        uint256 tier = roll < 58 ? 0 : roll < 85 ? 1 : roll < 96 ? 2 : roll < 99 ? 3 : 4;
        uint256[5] memory chances = [uint256(40),28,16,3,1];
        uint256[5] memory shares = [uint256(30),80,200,1000,2000];
        bool accepted = uint256(keccak256(abi.encode(entropy,id,uint8(1)))) % 100 < chances[tier];
        uint256 amount = accepted ? v.basis * shares[tier] / 10000 : 0;
        if (amount > v.maximum) amount = v.maximum;
        v.settled = true; reserved -= v.maximum;
        rewardPool -= amount; liabilities += amount; claimable[v.wallet] += amount;
        active[v.wallet] = bytes32(0); lastFinished[v.wallet] = block.timestamp;
        emit Settled(id,v.wallet,tier,accepted,amount);
    }
    /// @notice Anyone may fund gas for payout, but can never redirect the recipient.
    function pay(address payable wallet) external guard returns (bool success) {
        _sync(); uint256 amount = claimable[wallet]; require(amount > 0, "nothing owed");
        claimable[wallet] = 0; liabilities -= amount; accounted -= amount;
        (success,) = wallet.call{value: amount, gas: 100000}("");
        if (!success) {
            claimable[wallet] = amount; liabilities += amount; accounted += amount;
            emit PaymentDeferred(wallet,amount); return false;
        }
        totalPaid += amount; emit Paid(wallet,amount);
    }
}
