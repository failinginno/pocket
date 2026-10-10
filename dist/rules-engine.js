(function(root){
'use strict';
const UNIT=1000000;
const RULES={version:'PF-BSC-0.6',minimum:50000,roundMs:9000,maxShareBps:2000,tiers:[{name:'普通',weight:58,chance:40,share:30,item:'苔光生态瓶',icon:'🌿'},{name:'稀有',weight:27,chance:28,share:80,item:'月航罗盘',icon:'🧭'},{name:'史诗',weight:11,chance:16,share:200,item:'蘑菇八音盒',icon:'🍄'},{name:'传说',weight:3,chance:3,share:1000,item:'星鲸许愿瓶',icon:'🐋'},{name:'神话',weight:1,chance:1,share:2000,item:'星鲸许愿瓶',icon:'🐋'}]};
const day=t=>new Date(t).toISOString().slice(0,10);
async function hash(text){const data=await root.crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return Array.from(new Uint8Array(data),b=>b.toString(16).padStart(2,'0')).join('')}
function randomHex(){return Array.from(root.crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('')}
function roll(h){return parseInt(h.slice(0,12),16)/281474976710656*100}
class Engine{
 constructor(saved,clock=()=>Date.now()){this.clock=clock;this.state=saved?.version===RULES.version?saved:{version:RULES.version,pool:2480000,reserved:0,paid:0,operations:0,days:{},wallets:{},visits:[],seen:[],sequence:0};this.ensureDay()}
 ensureDay(){const d=day(this.clock());if(!this.state.days[d])this.state.days[d]={reserved:0,spent:0};return this.state.days[d]}
 wallet(address){return this.state.wallets[address]||(this.state.wallets[address]={balance:0,lastFinished:null,counts:{}})}
 snapshot(){return JSON.parse(JSON.stringify(this.state))}
 stats(){this.ensureDay();const available=this.state.pool-this.state.reserved;return {pool:this.state.pool/UNIT,available:available/UNIT,reserved:this.state.reserved/UNIT,paid:this.state.paid/UNIT,maximum:this.maximum(available)/UNIT,operations:this.state.operations/UNIT}}
 maximum(available){return Math.floor(available/5)}
 income(micro){if(!Number.isSafeInteger(micro)||micro<=0)throw Error('收入必须是正整数');const reward=Math.floor(micro*.7);this.state.pool+=reward;this.state.operations+=micro-reward;return {reward,operations:micro-reward}}
 rewardIncome(micro){if(!Number.isSafeInteger(micro)||micro<=0)throw Error('收入必须是正整数');this.state.pool+=micro;}
 receive(e){if(!e||typeof e.txId!=='string'||!e.txId||typeof e.wallet!=='string'||!e.wallet||!['buy','sell','transferOut','transferIn'].includes(e.type)||!Number.isSafeInteger(e.quote)||e.quote<0||!Number.isSafeInteger(e.tokens)||e.tokens<=0)throw Error('交易格式无效');const key=e.type==='buy'?e.txId:e.txId+':'+(e.logIndex??0);if(this.state.seen.includes(key))return {ok:false,reason:'重复交易'};this.state.seen.push(key);this.ensureDay();const w=this.wallet(e.wallet);if(e.type==='sell'||e.type==='transferOut'){w.balance=Math.max(0,w.balance-e.tokens);return {ok:true,type:e.type}}
 w.balance+=e.tokens;if(e.type==='transferIn')return {ok:true,type:e.type};let reason='';const d=day(this.clock());if(e.quote<RULES.minimum)reason='单笔买入不足0.05 BNB';else if(this.pending(e.wallet).length)reason='该钱包已有待判定资格';const budget=this.state.days[d],basis=this.state.pool-this.state.reserved,max=this.maximum(basis);if(!reason&&(max<1))reason='可用奖池不足，暂停新资格';if(reason){w.balance-=e.tokens;this.state.seen.pop();return {ok:false,reason}}const v={id:++this.state.sequence,wallet:e.wallet,mine:!!e.mine,txId:e.txId,logIndex:e.logIndex??0,day:d,acceptedAt:this.clock(),version:RULES.version,status:'已预留资金 · 排队',valid:true,required:w.balance-Math.floor(e.tokens*.1),minBalance:w.balance,basis,max,amount:0,win:false,settled:false,released:false,attempts:0};this.state.pool=Math.max(0,this.state.pool);this.state.reserved+=max;budget.reserved+=max;w.counts[d]=(w.counts[d]||0)+1;this.state.visits.push(v);return {ok:true,visit:v}}
 pending(wallet){return this.state.visits.filter(v=>!v.released&&(!wallet||v.wallet===wallet))}
 begin(v,proof){if(v.released)throw Error('轮次已关闭');if(v.proof)return v;let cursor=0;const tier=RULES.tiers.find(t=>proof.tierRoll<(cursor+=t.weight))||RULES.tiers[4];v.proof=proof;v.tier=tier.name;v.item={name:tier.item,icon:tier.icon,rarity:tier.name,chance:tier.chance/100,share:tier.share/10000};if(tier.name==='普通'&&v.id%2===0){v.item.name='蜗牛邮差钟';v.item.icon='🐌'}v.win=proof.dealRoll<tier.chance;v.amount=v.win?Math.min(Math.floor(v.basis*tier.share/10000),v.max):0;v.status='鉴定中';return v}
 release(v){if(v.released)return;this.state.reserved-=v.max;this.state.days[v.day].reserved-=v.max;v.released=true}
 reject(v){if(v.settled)return;v.amount=0;v.win=false;v.status=v.valid?'拒绝收下':'资格失效';this.release(v)}
 submit(v){if(v.settled)return v.receipt;if(!v.valid){this.reject(v);return null}if(!v.win||v.released)throw Error('无可结算奖励');v.attempts++;v.status='模拟结算已提交';v.receipt='SIM-PF-'+String(v.id).padStart(6,'0');return v.receipt}
 confirm(v,fail=false){if(v.settled)return true;if(!v.valid){this.reject(v);return false}if(fail){v.status='模拟提交失败 · 等待重试';return false}if(!v.receipt||v.released)throw Error('尚未提交结算');this.state.pool-=v.amount;this.state.paid+=v.amount;this.state.days[v.day].spent+=v.amount;this.release(v);v.settled=true;v.status='模拟结算已确认';return true}
 finish(v){if(!v.released)throw Error('资金尚未完成结算或释放');if(v.finishedAt)return;v.finishedAt=this.clock();v.outcome=v.settled?'已模拟结算':v.valid?'拒绝收下':'资格失效';v.status='已离场';this.wallet(v.wallet).lastFinished=v.finishedAt}
}
async function prepareProof(v,persist=()=>{}){if(!v.seed){v.seed=randomHex();v.commitment=await hash(v.seed);v.committedAt=Date.now();persist()}if(!v.entropy){v.entropy=randomHex();v.entropyAt=Date.now();persist()}const tierDigest=await hash(v.seed+':'+v.entropy+':'+v.id+':tier:'+v.version),dealDigest=await hash(v.seed+':'+v.entropy+':'+v.id+':deal:'+v.version);return {seed:v.seed,commitment:v.commitment,entropy:v.entropy,tierDigest,dealDigest,tierRoll:roll(tierDigest),dealRoll:roll(dealDigest),source:'浏览器模拟随机源，非链上随机数'}}
async function verify(v){if(!v.proof)return false;const p=v.proof;return p.commitment===v.commitment&&p.tierRoll===roll(p.tierDigest)&&p.dealRoll===roll(p.dealDigest)&&(await hash(p.seed))===p.commitment&&(await hash(p.seed+':'+p.entropy+':'+v.id+':tier:'+v.version))===p.tierDigest&&(await hash(p.seed+':'+p.entropy+':'+v.id+':deal:'+v.version))===p.dealDigest}
const api={Engine,RULES,UNIT,prepareProof,verify};root.PocketRules=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);


