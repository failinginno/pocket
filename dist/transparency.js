'use strict';
document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{
 const status=document.getElementById('copy-status');
 try{await navigator.clipboard.writeText(button.dataset.copy);status.textContent='合约地址已复制';}
 catch{status.textContent='请手动复制上方完整地址';}
 clearTimeout(window.pocketCopyTimer);window.pocketCopyTimer=setTimeout(()=>{status.textContent='';},2500);
}));
