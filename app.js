const menuBtn=document.getElementById('menuBtn'),nav=document.getElementById('nav');menuBtn?.addEventListener('click',()=>nav.classList.toggle('open'));nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const kind=btn.dataset.filter;document.querySelectorAll('.event-card').forEach(card=>card.hidden=kind!=='all'&&card.dataset.kind!==kind)}));
document.getElementById('refreshBtn')?.addEventListener('click',()=>{const s=document.getElementById('refreshStatus');s.textContent='Aucun flux automatique connecté. Consulte les liens officiels Garena pour vérifier les dernières annonces.'});
const form=document.getElementById('postForm'),list=document.getElementById('postList'),status=document.getElementById('postStatus'),KEY='booyah-zone-local-posts-v1';
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function render(){let posts=[];try{posts=JSON.parse(localStorage.getItem(KEY)||'[]')}catch{};list.innerHTML=posts.length?posts.map(p=>'<article class="post"><b>'+escapeHTML(p.type)+' — '+escapeHTML(p.title)+'</b><p>'+escapeHTML(p.body).replace(/\n/g,'<br>')+'</p>'+(p.url?'<a class="text-link" href="'+escapeHTML(p.url)+'" target="_blank" rel="noopener noreferrer">Source ↗</a>':'')+'</article>').join(''):'<p class="small">Aucune publication enregistrée sur cet appareil.</p>'}
form?.addEventListener('submit',e=>{e.preventDefault();const title=document.getElementById('postTitle').value.trim(),type=document.getElementById('postType').value,body=document.getElementById('postBody').value.trim(),url=document.getElementById('postUrl').value.trim();if(!title||!body)return;let posts=[];try{posts=JSON.parse(localStorage.getItem(KEY)||'[]')}catch{};posts.unshift({title,type,body,url,createdAt:new Date().toISOString()});localStorage.setItem(KEY,JSON.stringify(posts.slice(0,30)));form.reset();status.textContent='Publication enregistrée localement sur cet appareil.';render()});render();
/* BOOYAH PLAYER — bêta locale, sans connexion Garena */
const PLAYER_KEY='booyah-zone-players-v1';
const playerForm=document.getElementById('playerForm');
const playerList=document.getElementById('playerList');
const playerStatus=document.getElementById('playerStatus');
const playerShot=document.getElementById('playerShot');
const shotPreview=document.getElementById('shotPreview');
let shotName='';
playerShot?.addEventListener('change',()=>{
  const file=playerShot.files?.[0];
  shotName=file?.name||'';
  if(!file){shotPreview.hidden=true;shotPreview.textContent='';return;}
  if(!file.type.startsWith('image/')){playerStatus.textContent='Choisis un fichier image.';playerShot.value='';return;}
  const url=URL.createObjectURL(file);
  shotPreview.innerHTML='<img alt="Aperçu de la capture sélectionnée"><span></span>';
  shotPreview.querySelector('img').src=url;
  shotPreview.querySelector('span').textContent='Capture sélectionnée : '+escapeHTML(shotName)+' — elle n’est pas envoyée ni conservée après fermeture.';
  shotPreview.hidden=false;
});
function readPlayers(){try{return JSON.parse(localStorage.getItem(PLAYER_KEY)||'[]')}catch{return[]}}
function renderPlayers(){
  if(!playerList)return;
  const players=readPlayers().sort((a,b)=>(b.br+b.cs)-(a.br+a.cs)||b.wins-a.wins);
  playerList.innerHTML=players.length?players.map((p,i)=>'<article class="player-row"><span class="player-rank">#'+(i+1)+'</span><div class="player-avatar">'+escapeHTML(p.name.slice(0,1).toUpperCase())+'</div><div class="player-details"><b>'+escapeHTML(p.name)+'</b><small>UID '+escapeHTML(p.uid)+' • Niv. '+p.level+' • '+escapeHTML(p.region)+'</small><small>BR '+p.br.toLocaleString('fr-FR')+' • CS '+p.cs.toLocaleString('fr-FR')+'</small></div><strong class="player-score">'+(p.br+p.cs).toLocaleString('fr-FR')+'<small>PTS</small></strong></article>').join(''):'<p class="small">Aucun joueur enregistré. Ajoute la première fiche.</p>';
}
playerForm?.addEventListener('submit',e=>{
  e.preventDefault();
  const value=id=>document.getElementById(id).value.trim();
  const player={name:value('playerName'),uid:value('playerUid'),region:value('playerRegion'),level:Number(value('playerLevel')),br:Number(value('playerBr')),cs:Number(value('playerCs')),matches:Number(value('playerMatches')),wins:Number(value('playerWins')),updatedAt:new Date().toISOString()};
  if(!/^[0-9]{5,15}$/.test(player.uid)){playerStatus.textContent='Vérifie l’UID : 5 à 15 chiffres.';return;}
  if(player.wins>player.matches){playerStatus.textContent='Le nombre de victoires ne peut pas dépasser le nombre de parties.';return;}
  const players=readPlayers();
  const existing=players.findIndex(p=>p.uid===player.uid);
  if(existing>=0)players[existing]=player;else players.push(player);
  try{localStorage.setItem(PLAYER_KEY,JSON.stringify(players.slice(0,100)));playerForm.reset();shotPreview.hidden=true;shotPreview.textContent='';shotName='';playerStatus.textContent='Fiche enregistrée sur cet appareil. Elle n’est pas encore synchronisée avec les autres joueurs.';renderPlayers();}
  catch{playerStatus.textContent='Stockage local indisponible ou plein. Réessaie avec moins de données.';}
});
renderPlayers();
