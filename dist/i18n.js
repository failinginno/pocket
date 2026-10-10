/* Presentation-only localization: never translates ledger data or contract inputs. */
(function () {
 'use strict';
 let lang='zh';try{lang=localStorage.getItem('pf-language')==='en'?'en':'zh'}catch{}
 const dictionary=window.PocketEnglish||{};
 const keys=Object.keys(dictionary).sort((a,b)=>b.length-a.length);
 const pattern=new RegExp(keys.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
 function t(text){return lang==='en'?String(text).replace(pattern,key=>dictionary[key]):String(text)}
 window.PocketI18n={lang,t};document.documentElement.lang=lang==='en'?'en':'zh-CN';
 const skip='script,style,code,pre,textarea,[data-no-translate],.language-switch';
 function translateNode(node){
  if(node.nodeType===3){if(node.parentElement&&!node.parentElement.closest(skip)){const value=t(node.nodeValue);if(value!==node.nodeValue)node.nodeValue=value;}return;}
  if(node.nodeType!==1||node.matches(skip))return;
  for(const attribute of ['title','aria-label','placeholder'])if(node.hasAttribute(attribute)){const value=t(node.getAttribute(attribute));if(value!==node.getAttribute(attribute))node.setAttribute(attribute,value);}
  for(const child of node.childNodes)translateNode(child);
 }
 function start(){
  const target=document.querySelector('.header-right')||document.querySelector('header nav');
  if(target){const group=document.createElement('div');group.className='language-switch';group.setAttribute('role','group');group.setAttribute('aria-label','Language / 语言');
   for(const [value,label] of [['zh','中文'],['en','EN']]){const button=document.createElement('button');button.type='button';button.textContent=label;button.lang=value==='zh'?'zh-CN':'en';button.setAttribute('aria-pressed',String(value===lang));button.onclick=()=>{if(value===lang)return;try{localStorage.setItem('pf-language',value)}catch{}location.reload()};group.append(button);}target.append(group);}
  if(lang!=='en')return;
  document.title=t(document.title);translateNode(document.body);
  const observer=new MutationObserver(records=>{for(const record of records){if(record.type==='childList')record.addedNodes.forEach(translateNode);else translateNode(record.target);}});
  observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','placeholder']});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
