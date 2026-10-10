'use strict';
(async()=>{
 try{
  const response=await fetch('/social-links.json',{cache:'no-store'});if(!response.ok)return;
  const config=await response.json();if(!config.x)return;
  const url=new URL(config.x);
  if(url.protocol!=='https:'||!['x.com','www.x.com','twitter.com','www.twitter.com'].includes(url.hostname)||url.username||url.password)return;
  document.querySelectorAll('[data-social-x]').forEach(link=>{
   link.href=url.href;link.target='_blank';link.rel='noopener noreferrer';link.removeAttribute('aria-disabled');link.textContent='𝕏 官方 X';link.title='打开口袋奇物社官方 X';
  });
 }catch{/* A missing social URL must never block the shop. */}
})();
