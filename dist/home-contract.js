'use strict';
(function(){
 const address='0x642d8dddBc72668DA64187D583c3923a4eFB7777';
 const sidebar=document.querySelector('aside.left');if(!sidebar)return;
 const section=document.createElement('section');section.className='card token-contract';section.setAttribute('aria-label','项目代币合约地址');
 section.innerHTML='<div class="section-head"><h2>代币合约 · CA</h2><span class="muted">BSC</span></div><code class="token-ca">'+address+'</code><div class="token-ca-actions"><button type="button">复制地址</button><a href="https://bscscan.com/address/'+address+'" target="_blank" rel="noopener noreferrer">BscScan ↗</a></div><span class="token-ca-status" role="status"></span>';
 section.querySelector('button').onclick=async()=>{
  const status=section.querySelector('.token-ca-status');
  try{await navigator.clipboard.writeText(address);status.textContent='地址已复制';}
  catch{status.textContent='请手动复制上方完整地址';}
  setTimeout(()=>{status.textContent='';},2500);
 };
 sidebar.prepend(section);
})();
