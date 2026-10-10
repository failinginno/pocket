window.PocketEnglish=Object.fromEntries(`
打开口袋奇物社官方 X|Open the official Pocket Finds X account
官方 X|Official X
正在加载角色与家具…|Loading characters and furniture…
布置你的奇物小店|Preparing your curiosity shop
角色与家具|Characters and furniture
赤狐 · 阿枫|Maple · Fox
浣熊 · 木木|Woody · Raccoon
小熊 · 蜜朵|Honey · Bear
钱包|Wallet
3D奇物小店，可旋转视角|3D curiosity shop. Drag to rotate.
3D 场景未能启动。请使用支持 WebGL2 的浏览器并开启硬件加速，然后刷新页面。错误：|3D scene could not start. Enable hardware acceleration in a WebGL2-capable browser and reload. Error: 
店主决定收下它！|The shopkeeper accepts it!
这次，先留着它吧。|Keep this find for now.
你的奇物找到了喜欢它的人。|Your find has found a new home.
每一件奇物都有自己的归宿，下次再带点新发现。|Every find has a home. Bring another discovery next time.
演示结算，不会向真实钱包转账。|Demo settlement. No funds are sent to a real wallet.
回到小店|Back to the shop
口袋奇物社|Pocket Finds
口袋奇物小店|Pocket Finds Shop
合约透明度|Contract Transparency
返回小店|Back to the Shop
主导航|Main navigation
官方 X 链接待公布|Official X link coming soon
即将开放|Coming soon
规则写入合约。|Rules written into contracts.
结果链上可查。|Outcomes verifiable on-chain.
链上透明|On-chain transparency
公开地址、固定奖励规则、可追踪的结算记录。我们用可核验的合约行为说明资金如何流动，也公开系统仍然依赖谁。|Public addresses, fixed reward rules and traceable settlements. Verifiable contract behavior shows how funds move and which parties the system still relies on.
BSC 主网已部署|Deployed on BSC mainnet
奖励规则固定|Fixed reward rules
公开可查|Publicly accessible
奖励、资格与随机数合约地址公开。资金到账、入队、结算和付款均有链上记录。|Reward, eligibility and randomness contract addresses are public. Funding, queue entries, settlements and payments are recorded on-chain.
参数固定|Fixed parameters
奖励档位、概率、门槛与随机配置没有管理员修改入口，当前部署不使用升级代理。|Administrators cannot change reward tiers, odds, eligibility thresholds or randomness settings. This deployment does not use an upgrade proxy.
结果可核验|Verifiable outcomes
固定 Chainlink Coordinator 接收随机数；结算使用已存储的随机结果，不允许重抽替换。|Randomness is received from a fixed Chainlink Coordinator. Settlement uses the stored result; rerolling to replace it is not allowed.
合约地址簿|Contract directory
网络：|Network: 
小店奖励金库|Shop Reward Vault
奖励资金|Reward funds
接收奖励资金、预留每轮额度，并将已结算奖金付给固定获奖钱包。|Receives reward funds, reserves each round's maximum, and pays settled rewards to the recorded winning wallet.
在 BscScan 查看|View on BscScan
复制地址|Copy address
查看源码|View source
买入资格登记|Buy Eligibility Registry
防重复使用|Single-use entries
每笔交易登记一次资格，绑定钱包和金额；已使用资格不可重复入队。|Each transaction registers one entry tied to its wallet and amount. A consumed entry cannot be queued again.
固定随机数适配器|Fixed Randomness Adapter
固定 Coordinator、订阅、Key Hash 和回调参数。每次请求只保存首个有效回调结果。|The Coordinator, subscription, Key Hash and callback settings are fixed. Only the first valid callback result is stored per request.
项目代币 CA|Project Token CA
预留地址|Reserved address
资格登记合约中的代币地址已固定。代币是否已发布，请以链上代码及官方公告为准。|The token address in the eligibility contract is fixed. Check deployed on-chain code and official announcements for launch status.
部署区块：|Deployment block: 
查看部署交易|View deployment transaction
查看公开部署回执|View public deployment receipt
本站源码是本地部署工程的公开副本，不等于 BscScan 已完成源码验证。|These sources are public copies of the local deployment project. This does not mean they have been verified on BscScan.
固定规则，清楚计算|Fixed rules. Clear calculations.
规则取自已部署奖励合约|Rules from the deployed reward contract
单笔资格门槛|Minimum qualifying buy
登记买入金额至少达到门槛；一笔交易一次资格，同一钱包同时只能有一轮。实际买入识别与金额口径由监听服务负责。|The registered buy amount must meet the minimum. One entry per transaction, and one active round per wallet. The monitoring service identifies purchases and determines qualifying amounts.
每轮最高奖励|Maximum reward per round
× 入队时可用池|× available pool at entry
扣除其他轮次已预留金额后锁定基数，并预留本轮最高额度。没有固定 BNB 上限；新到账资金不改变已入队轮次的基数。|The basis is fixed after subtracting reservations for other rounds, and this round's maximum is reserved. There is no fixed BNB cap. Later funding does not change the basis of an existing round.
锁定池奖励比例|Share of locked pool basis
出现概率|Tier probability
收下概率|Acceptance probability
总中奖概率|Overall win probability
档位|Tier
普通|Common
稀有|Rare
史诗|Epic
传说|Legendary
神话|Mythic
珍奇|Exotic
总中奖概率 = 出现概率 × 收下概率；奖励按 BNB 最小单位向下取整。概率描述不保证固定次数中奖。收到的奖励资金全额即时入池，无每日发奖预算。|Overall win probability = tier probability × acceptance probability. Rewards round down to the smallest BNB unit. Odds do not guarantee a win within a fixed number of rounds. All received reward funds enter the pool immediately, with no daily payout budget.
资金与随机数的路径|Funds and randomness flow
计划在 Flap 配置 70% 税收进入小店奖励金库、30% 进入运营钱包；这个分配由外部 Flap 金库执行，奖励合约不会再次抽取运营份额。实际税率和分配请核对代币及分配金库。|The planned Flap split sends 70% of tax revenue to the reward vault and 30% to operations. The external Flap vault executes this split; the reward contract takes no additional operations share. Check the token and distribution vault for actual tax and allocation settings.
合格买入登记|Register qualifying buy
入队锁定额度|Queue and reserve funds
VRF 请求与回调|VRF request and callback
确定性结算|Deterministic settlement
获奖钱包收款|Payment to winning wallet
奖励合约不提供管理员提取奖池的函数。付款目标只能是登记并结算的获奖钱包，转账失败会保留应付余额。任何人都可中继已就绪结果、结算和应付奖金，不能自行替换随机数或收款地址。|The reward contract has no admin pool-withdrawal function. Payments go only to the registered, settled winner; failed transfers preserve the payable balance. Anyone may relay ready results, settlements and payments, but cannot replace randomness or the recipient.
适配器仅接受固定 Coordinator 的回调；管理员不能修改随机参数、手选结果或重新请求同一轮。适配器本身保存回调结果，VRF 证明验证由 Coordinator 负责。|The adapter accepts callbacks only from the fixed Coordinator. Admins cannot alter randomness parameters, select outcomes or request the same round again. The adapter stores callback results; the Coordinator verifies VRF proofs.
谁能做什么|Who can do what
固定参数不代表所有外部依赖都消失|Fixed parameters do not remove all external dependencies
事项|Function
当前设计|Current design
权限边界|Permission boundaries
奖励比例与概率|Reward shares and odds
写在合约代码中|Defined in contract code
无修改函数，无升级代理|No setters or upgrade proxy
VRF 配置|VRF configuration
部署时 immutable 固定|Immutable at deployment
Coordinator、订阅 ID、Key Hash、确认数、Gas、支付方式不可改|Coordinator, subscription ID, Key Hash, confirmations, gas and payment method cannot be changed
买入资格|Buy eligibility
固定 registrar 钱包登记|Registered by the fixed registrar wallet
registrar 可提交资格；合约不独立验证历史买入事件|The registrar submits entries; the contract does not independently verify historical buy events
代币与金库绑定|Token and vault binding
管理员单次绑定|One-time admin binding
代币须有代码且匹配固定 CA；绑定后不能替换|Token code must exist and match the fixed CA; it cannot be replaced after binding
开启奖励|Enable rewards
管理员单次开启|One-time admin activation
当前无关闭或暂停函数|No disable or pause function
奖池转出|Pool outflows
仅已结算奖金付款|Only settled reward payments
无管理员提现，服务钱包不能任意指定付款金额|No admin withdrawals; the service wallet cannot choose arbitrary payout amounts
订阅与服务|Subscription and service
链下维护|Off-chain maintenance
订阅所有者仍可管理充值与 Consumer；停机、移除 Consumer 或余额不足会影响运行|The subscription owner manages funding and Consumers. Downtime, Consumer removal or insufficient balance affect operation
我们公开保留的信任边界|Disclosed trust boundaries
固定 registrar 是本系统的重要信任点：它能够提交未经真实买入支持的资格。随机数可以约束结果，但不能证明资格来源真实。专用钱包的保管和监听服务的准确性仍然重要。|The fixed registrar is a key trust assumption: it can submit entries without a real purchase. Randomness constrains outcomes but does not prove eligibility is genuine. Secure wallet custody and accurate monitoring remain important.
当前买入识别覆盖 Flap 直接曲线买入；DEX 和间接路由仍待补齐。VRF 未返回时轮次与预留资金可能持续等待，当前没有取消退款入口。参数固定也会限制故障后的修复能力。|Buy detection currently covers direct Flap bonding-curve purchases. DEX and indirect routes are not yet covered. Rounds and reserved funds may remain pending if VRF does not return; there is no cancellation/refund entry point. Fixed parameters also limit repairs after failures.
本页面说明奖励系统的设计边界，不代表代币转账、税率、流动性或市场价格获得安全保证。尚未确认真实主网奖励流程已完成验证。|This page describes the reward system's design boundaries, not a safety guarantee for token transfers, taxes, liquidity or market price. End-to-end mainnet reward validation has not been confirmed.
如何自己核验|How to verify
我能查看哪些记录？|Which records can I inspect?
在 BscScan 查询奖励合约的 Revenue、Queued、Settled、Paid 和 PaymentDeferred 事件。Queued 给出预留上限，Settled 给出结果和金额，Paid 给出实际付款；结算成功不一定代表付款已完成。|On BscScan, inspect the reward contract's Revenue, Queued, Settled, Paid and PaymentDeferred events. Queued records the reserved cap, Settled records the outcome and amount, and Paid records the actual payment. Successful settlement does not necessarily mean payment is complete.
页面上的状态是实时的吗？|Is this page live?
地址与部署信息来自已核对的部署回执；本页没有持续刷新链上状态。游戏首页当前仍是演示。是否开启奖励、代币是否发布和资金余额，请查看链上数据及官方公告。|Addresses and deployment details come from a checked deployment receipt. This page does not continuously refresh on-chain state. The game homepage is still a demo. Check on-chain data and official announcements for activation, token launch and balances.
部署与登记钱包是谁？|Which wallets deploy and register entries?
部署管理员：|Deployment admin: 
固定资格登记钱包：|Fixed eligibility registrar: 
随机 Coordinator：|Randomness Coordinator: 
让每一笔奖励都有依据|Every reward, backed by a record
合约地址已复制|Contract address copied
地址已复制|Address copied
请手动复制上方完整地址|Please copy the full address above manually
项目代币合约地址|Project token contract address
代币合约 · CA|Token contract · CA
税收70%奖励 · 到账即时入池|70% of tax to rewards · credited on receipt
累计模拟支付|Total demo payouts
成交次数|Accepted items
奖励池占比|Pool share
奖励池|Reward pool
演示数据|Demo data
演示资金池走势|Demo pool balance trend
最新成交|Latest rewards
本次体验|This demo
柜台刚刚开门。|The shop just opened.
带一件奇物进来吧。|Bring a curiosity inside.
小店约定|Shop guidelines
带奇物入场，排队等待鉴定。|Bring an item and queue for appraisal.
结果会显示在柜台和记录中。|Results appear at the counter and in history.
了解本轮规则|Explore the rules
实时演示|Live demo
背景音乐与欢迎光临语音|Background music and welcome voice
声音：关|Sound: Off
声音：开|Sound: On
今天，会遇到什么奇物呢？|What treasures will we find today?
等待鉴定|Awaiting appraisal
拖动旋转 · 滚轮缩放|Drag to rotate · Scroll to zoom
柜台开放 · 等你进店|Counters open · Come inside
排队中|In queue
还没有客人。|No guests yet.
你可以成为第一位。|Be the first to visit.
我的状态|My status
访客体验|Guest demo
准备好你的第一件奇物。|Get your first curiosity ready.
模拟买入 0.05 BNB|Demo buy 0.05 BNB
模拟门槛 0.05 BNB · 全程自动|Demo minimum 0.05 BNB · Automatic
自动演示：暂停|Auto demo: Paused
自动演示：开|Auto demo: On
自动演示|Auto demo
交易识别|Buy detection
测试：手续费到账|Test: receive tax revenue
支付失败重试|Retry failed payment
重置本机演示|Reset local demo
测试：模拟我的卖出|Test: simulate my sell
小店伙伴|Shop friends
慢慢 / 店主|Momo / Shopkeeper
啾啾 / 助手|Chirpy / Assistant
阿橙 / 快递员|Citrus / Courier
欢迎来到口袋奇物社|Welcome to Pocket Finds
每一件小奇物，都有自己的故事。|Every find has a story.
识别买入|Detect purchase
自动鉴定|Auto appraisal
自动结算|Auto settlement
查看规则|View rules
概念初版 · 金额、角色与成交均为模拟，不涉及链上交易|Concept demo · Amounts, characters and trades are simulated. No on-chain transactions.
体验身份|Try demo identity
演示身份已启用|Demo identity enabled
已启用演示身份，不需要真实钱包|Demo identity enabled. No real wallet needed.
柜台空闲。|Counters are available.
下一件奇物会是什么？|What will the next find be?
暂时还没有成交。|No rewards yet.
下一件或许有惊喜。|The next find may surprise you.
你已入场，正在排队。|You have entered the queue.
本轮已结束，可以再带一件奇物。|Round complete. Bring another find.
当前：|Current: 
神秘奇物|Mystery item
待揭晓|To be revealed
阿枫 · 赤狐|Maple · Fox
木木 · 浣熊|Woody · Raccoon
蜜朵 · 小熊|Honey · Bear
三个鉴定柜台|Three appraisal counters
等你带来奇物|Ready for your next find
个柜台正在接待|counters serving
流程暂停，请刷新恢复|Paused. Refresh to recover.
随机源异常 · 等待恢复|Randomness unavailable · Waiting
下一位，请到一号台来！|Next guest, counter one please!
二号台准备好了，下一位请。|Counter two is ready. Next, please!
下一位朋友，让我看看你的奇物。|Next guest, let's see your treasure.
欢迎光临！带着奇物慢慢来。|Welcome! Bring your curiosity along.
新朋友来啦，请在这边排队。|A new friend! Please queue here.
欢迎来到奇物社，好故事等你来。|Welcome! A new story awaits.
柜台空着呢，带上你的奇物来聊聊吧。|A counter is free. Bring a find and say hello.
每一件奇物都有故事，欢迎来小店看看。|Every find has a story. Come explore.
好奇总会相遇，下一位朋友在哪里？|Curiosity brings us together. Who's next?
退回奇物 · 欢迎再来|Item returned · Visit again
本轮未成交，已退回奇物并自动离场|No reward this round. Item returned; leaving automatically.
待模拟结算|Awaiting demo settlement
拒绝收下|Not accepted
资格失效|Entry invalid
已预留资金|Funds reserved
识别成功|Purchase detected
模拟结算已提交|Demo settlement submitted
模拟结算已确认|Demo settlement confirmed
模拟提交失败 · 自动重试|Demo submission failed · Retrying
模拟提交失败 · 等待重试|Demo submission failed · Awaiting retry
已模拟结算|Demo settled
已自动结算|Automatically settled
正在等待演示买入…|Waiting for a demo purchase…
步行离场|Walking out
已离场|Left the shop
自动排队|Auto queue
正在柜台|At the counter
准备接取|Ready to receive
仔细检查|Inspecting
走向|Walking to
号柜台| counter
号台| counter
号队列| queue
鉴定中|Appraising
暂未成交|Not accepted yet
等候|Waiting 
月亮罐|Moon Jar
四叶草|Four-leaf Clover
发光石|Glowing Crystal
蘑菇标本|Mushroom Specimen
时间沙漏|Hourglass
苔光生态瓶|Mosslight Terrarium
月航罗盘|Moon Compass
蘑菇八音盒|Mushroom Music Box
星鲸许愿瓶|Starwhale Wish Jar
蜗牛邮差钟|Snail Postman's Clock
本轮规则|Round rules
每笔合格买入一次机会，测试门槛 ≥0.05 BNB。同一钱包同时一轮，结算后可用新买入资格立即参与，无冷却、无每日次数限制。当前合约未启用持仓检查，演示卖出不取消已有资格。|One chance per qualifying buy, with a demo minimum of 0.05 BNB. One active round per wallet. After settlement, a new qualifying buy can enter immediately. No cooldown or daily limit. The current contract has no holding check; a demo sell does not cancel an existing entry.
资金分配|Fund allocation
小店奖励池|Shop reward pool
运营钱包|Operations wallet
奖励资金到账即入池，不再二次分账，无每日发奖总预算。|Received rewards enter the pool immediately. No second split and no daily payout budget.
最高奖励怎么算|How the maximum is calculated
锁定可用奖池|Locked available pool
无固定 BNB 上限，随奖池大小动态变化。|No fixed BNB cap. The maximum scales with the pool.
入队时锁定额度|Reserve funds at entry
扣除其他轮次预留奖金，得到可用奖池；入队时锁定基数，并预留本轮最高奖励。表中奖励比例均按该基数计算。|Available funds exclude reservations for other rounds. The basis is locked at entry and the maximum reward is reserved. All reward shares in the table use that basis.
如何理解中奖概率|Understanding the odds
每轮独立判定，最高奖励并非必得，也不保证固定次数中奖。|Each round is independent. The maximum is not guaranteed, nor is a win within any fixed number of rounds.
本版全部为浏览器模拟，本机保存测试记录。随机种子与模拟随机输入可复算，但不能证明服务器公平或替代链上随机源。|This version is entirely simulated in the browser, with records stored locally. Seeds and simulated random inputs can be recomputed, but do not prove server fairness or replace on-chain randomness.
鉴定与结算记录|Appraisal and settlement history
查看判定凭证|View outcome proof
本轮尚未生成判定凭证|No outcome proof for this round yet
判定凭证|Outcome proof
哈希复算通过|Hash verification passed
复算失败|Verification failed
等级随机值：|Tier random value: 
成交随机值：|Acceptance random value: 
收下门槛|Acceptance threshold
锁定池基数：|Locked pool basis: 
结算编号：|Settlement ID: 
未提交|Not submitted
提前承诺哈希|Precommitted hash
公开种子|Public seed
模拟随机输入|Simulated random input
模拟随机源在承诺写入本机记录后生成；这不是可信链上随机数。真实项目需服务端持久化与外部随机源。|Simulated randomness is generated after the commitment is saved locally. It is not trusted on-chain randomness. Production needs server persistence and an external randomness source.
可用奖池|Available pool
已预留奖金|Reserved rewards
新一轮最高|Next round maximum
无冷却 · 不限每日次数 · 每钱包同时一轮|No cooldown · No daily limit · One active round per wallet
最高为可用池20% · 无固定BNB上限|Maximum 20% of available pool · No fixed BNB cap
已模拟卖出；当前合约不取消已有资格|Demo sell recorded; existing eligibility remains valid
自动监听已启动 · 所有交易与结算均为模拟|Auto monitor started · All trades and settlements are simulated
模拟税收0.1 BNB：0.07即时入池，0.03运营|Demo tax 0.1 BNB: 0.07 to the pool, 0.03 to operations
下一笔模拟支付首次提交将失败，然后自动重试|The next demo payment will fail on its first submission, then retry automatically
重置本机演示？|Reset the local demo?
会清空本机测试资格、奖池和记录，不涉及真实资产。|Clears local demo entries, pool and history. No real assets are affected.
确认重置演示|Confirm demo reset
重复交易|Duplicate transaction
单笔买入不足0.05 BNB|Buy below 0.05 BNB
该钱包已有待判定资格|This wallet already has a pending entry
可用奖池不足，暂停新资格|Insufficient available pool. New entries paused.
欢迎光临|Welcome
欢迎来到奇物社|Welcome to Pocket Finds
奇物鉴定大厅|Curiosity Hall
收集|Collect
发现|Discover
分享|Share
生活的小奇迹|Little wonders
奇物让|Curiosities make
平凡的日子|ordinary days
发光|shine
小小奇物|Little finds
大大快乐|Big smiles
好奇总会相遇|Curiosity connects us
小店游戏|Shop game
小店|Shop
玩法|How to play
记录|History
柜台|Counter
门口|Entrance
排队|Queue
日志|Activity
关闭|Close
等级|Tier
出现|Appears
收下|Accepted
可用池|Available pool
最高|Up to
奖励档|reward tier
规则|Rules
买入|Buy
卖出|Sell
成交|Accepted
（模拟）|(demo)
你 ·|You ·
带着|with 
入场|entered
访客|Guest
`.trim().split('\n').map(line=>{const at=line.indexOf('|');return [line.slice(0,at),line.slice(at+1)]}));
