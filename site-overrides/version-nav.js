const current=document.body.dataset.version||'v16';
const path=location.pathname;
const navScript=document.currentScript;
const resourceRoot=new URL('./',navScript?.src||location.href);
const resourceUrl=relative=>new URL(relative,resourceRoot).href;
const relativePath=decodeURIComponent(path).slice(decodeURIComponent(resourceRoot.pathname).length);
const isShapes=relativePath.startsWith('shapes/');
const isAnatomy=relativePath.startsWith('anatomy');
const isAlien=relativePath.startsWith('alien/');
const isArena=relativePath.startsWith('arena-lab/');
const ACCESS_HASH='37ba3881108bf3e48180350246c5959b9481633d0cb1d8694fb141dc74e5fe79';
const ACCESS_KEY='resourceBetaAccess';
const isGranted=()=>sessionStorage.getItem(ACCESS_KEY)==='granted'||sessionStorage.getItem('anatomyAccess')==='granted';

const dialog=document.createElement('dialog');dialog.className='access-dialog';dialog.setAttribute('aria-labelledby','resource-access-title');
dialog.innerHTML='<form method="dialog" class="access-dialog-card" id="resourceAccessForm"><button class="access-dialog-close" type="button" aria-label="Close access-code prompt">×</button><p class="access-dialog-kicker">Restricted resource</p><h2 id="resource-access-title">Enter access code</h2><p>Enter the classroom code to open Beta and the version history.</p><label for="resourceAccessCode">Access code</label><div class="access-dialog-row"><input id="resourceAccessCode" type="password" inputmode="numeric" autocomplete="off" required aria-describedby="resourceAccessStatus"><button type="submit" value="default">Continue</button></div><p id="resourceAccessStatus" class="access-dialog-status" role="status"></p></form>';
const accessForm=dialog.querySelector('#resourceAccessForm');
const accessInput=dialog.querySelector('#resourceAccessCode');
const accessStatus=dialog.querySelector('#resourceAccessStatus');
dialog.querySelector('.access-dialog-close').addEventListener('click',()=>dialog.close());
let pendingGrant=null;
async function digest(value){const bytes=new TextEncoder().encode(value),hash=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('')}
function requestAccess(onGrant){
  if(isGranted()){onGrant?.();return}
  pendingGrant=onGrant||null;accessStatus.textContent='';accessInput.value='';
  if(!dialog.open)dialog.showModal();
  requestAnimationFrame(()=>accessInput.focus());
}
function grantAccess(){sessionStorage.setItem(ACCESS_KEY,'granted');sessionStorage.setItem('anatomyAccess','granted');dialog.close();const next=pendingGrant;pendingGrant=null;next?.()}
function lockAccess(){sessionStorage.removeItem(ACCESS_KEY);sessionStorage.removeItem('anatomyAccess')}
accessForm.addEventListener('submit',async event=>{event.preventDefault();if(await digest(accessInput.value.trim())===ACCESS_HASH){grantAccess()}else{accessStatus.textContent='That code is not correct.';accessInput.select()}});
dialog.addEventListener('close',()=>{accessStatus.textContent='';accessInput.value='';pendingGrant=null});
window.resourceAccess={isGranted,requestAccess,lock:lockAccess};

const wrapper=document.createElement('header');wrapper.className='resource-bar';
const brand=document.createElement('a');brand.className='resource-brand';brand.href=resourceUrl('./');brand.textContent='Digital Media Resources';
const nav=document.createElement('nav');nav.className='resource-tabs';nav.setAttribute('aria-label','Resource tabs');
for(const [relative,text,active] of [['./','Viseme Lab',!isShapes&&!isAnatomy&&!isAlien&&!isArena],['alien/','Alien Talker',isAlien],['shapes/','3D Shapes',isShapes],['arena-lab/','Arena Lab',isArena],['anatomy.html','Beta 🔒',isAnatomy]]){
  const href=resourceUrl(relative),link=document.createElement('a');link.href=href;link.textContent=text;if(active)link.setAttribute('aria-current','page');
  if(relative==='anatomy.html')link.addEventListener('click',event=>{if(!isGranted()){event.preventDefault();requestAccess(()=>{location.href=href})}});
  nav.append(link);
}
wrapper.append(brand,nav);
if(!isShapes&&!isAnatomy&&!isAlien&&!isArena){
  const versions=document.createElement('div');versions.className='version-picker';wrapper.append(versions);
  function showVersionSelect(){
    versions.replaceChildren();
    const label=document.createElement('label');label.htmlFor='version-select';label.textContent='Version';
    const select=document.createElement('select');select.id='version-select';
    for(const [value,text] of [['v16','Version 16 — improved jaw & lip movement'],['v15','Version 15 — previous face model'],['v14','Version 14 — Luzia pronunciation'],['v13','Version 13 — dark inner mouth'],['v12','Version 12 — lower-lip skin control'],['v11','Version 11 — shared saved visemes'],['v10','Version 10 — independent lip thickness'],['v9','Version 9 — direct tongue controls'],['v8','Version 8 — scrolling controls & lip Z'],['v7','Version 7 — picture guides & saved poses'],['v6','Version 6 — mirrored tongue profiles'],['v5','Version 5 — advanced tongue controls'],['v4','Version 4 — mouth-only view'],['v3','Version 3 — sentence writer'],['v2','Version 2 — previous 3D simulator']]){const option=document.createElement('option');option.value=value;option.textContent=text;option.selected=current===value;select.append(option)}
    versions.append(label,select);select.focus();
    select.addEventListener('change',()=>{location.href=select.value==='v16'?resourceUrl('./'):resourceUrl(`versions/${select.value}/`)});
  }
  if(isGranted())showVersionSelect();
  else{const newest=document.createElement('span');newest.className='newest-version';newest.textContent='Newest: Version 16';const unlock=document.createElement('button');unlock.type='button';unlock.className='version-lock-button';unlock.textContent='Versions 🔒';unlock.addEventListener('click',()=>requestAccess(showVersionSelect));versions.append(newest,unlock)}
}
document.body.prepend(wrapper);document.body.append(dialog);
