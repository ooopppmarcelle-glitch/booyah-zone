import { loadPlayers, savePlayers, upsertPlayer, calculatePulse, getSortedPlayers } from "./core/store.js";
import { getProfileSourceStatus } from "./modules/api-adapter.js";

const $ = (id) => document.getElementById(id);
let players = loadPlayers();
let screenshotUrl = "";

function escapeHTML(value="") {
  return String(value).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function formatNumber(value) { return Number(value || 0).toLocaleString("fr-FR"); }
function getInitials(name="BZ") { return name.trim().slice(0,2).toUpperCase(); }
function maskUid(uid="") { const value=String(uid); return value.length>5 ? value.slice(0,3)+"•••"+value.slice(-2) : value; }
function playerPulse(p) { return calculatePulse(p); }
function updateMetrics() {
  $("metricPlayers").textContent = players.length;
  $("metricComplete").textContent = players.filter(p => p.level && p.matches !== undefined).length;
  const best = players.length ? Math.max(...players.map(playerPulse)) : null;
  $("metricPulse").textContent = best === null ? "—" : best;
  $("pulseValue").textContent = players.length ? best : "—";
}
function renderFeatured() {
  const own = players[0];
  const host = $("featuredPlayer");
  if (!own) {
    host.className = "featured-empty";
    host.innerHTML = '<div class="empty-emblem">BZ</div><div><b>Ta fiche n’attend que toi.</b><p>Enregistre ton UID et tes statistiques pour créer ton passeport joueur.</p><button class="button button-primary" data-go="passport">Créer mon passeport <span>↗</span></button></div>';
    return;
  }
  host.className = "featured-empty featured-player";
  host.innerHTML = '<div class="empty-emblem">'+escapeHTML(getInitials(own.name))+'</div><div class="featured-data"><b>'+escapeHTML(own.name)+'</b><p>UID '+escapeHTML(own.uid)+' · Niveau '+own.level+' · Région '+escapeHTML(own.region)+'</p><div class="featured-stats"><span><b>'+formatNumber(own.br)+'</b><small>BR PTS</small></span><span><b>'+formatNumber(own.cs)+'</b><small>CS PTS</small></span><span><b>'+playerPulse(own)+'</b><small>PULSE</small></span></div><span class="unverified-note">Données déclarées par le joueur · non vérifiées</span></div>';
}
function renderMiniLadder() {
  const host = $("miniLadder");
  const sorted = getSortedPlayers(players, "total").slice(0,4);
  host.innerHTML = sorted.length ? sorted.map((p,i) => '<div class="mini-row"><span class="rank-number">0'+(i+1)+'</span><span class="player-avatar">'+escapeHTML(getInitials(p.name))+'</span><span><b class="player-name">'+escapeHTML(p.name)+'</b><small class="player-sub">Niv. '+p.level+' · '+escapeHTML(p.region)+'</small></span><strong class="player-points">'+formatNumber(p.br+p.cs)+'</strong></div>').join("") : '<p class="empty-note">Le classement apparaîtra dès que des joueurs seront ajoutés.</p>';
}
function renderLadder() {
  const mode = $("sortMode").value;
  const sorted = getSortedPlayers(players, mode);
  $("fullLadder").innerHTML = sorted.length ? sorted.map((p,i) => '<div class="ladder-row"><span class="rank-number">#'+(i+1)+'</span><span class="player-avatar">'+escapeHTML(getInitials(p.name))+'</span><span><b class="player-name">'+escapeHTML(p.name)+'</b><small class="player-sub">UID '+escapeHTML(maskUid(p.uid))+' · Niv. '+p.level+'</small></span><span class="ladder-stat"><b>'+formatNumber(p.br+p.cs)+'</b><small>BR + CS PTS</small></span><span class="ladder-stat"><b>'+playerPulse(p)+'</b><small>PULSE</small></span></div>').join("") : '<p class="empty-note">Pas encore de joueurs. Ajoute des profils pour démarrer.</p>';
}
function fillCompareOptions() {
  const options = '<option value="">Choisir un joueur</option>'+players.map(p => '<option value="'+escapeHTML(p.uid)+'">'+escapeHTML(p.name)+'</option>').join("");
  $("compareA").innerHTML = options;
  $("compareB").innerHTML = options;
  if (players.length > 1) $("compareB").value = players[1].uid;
  if (players.length) $("compareA").value = players[0].uid;
  renderCompare();
}
function renderCompare() {
  const a = players.find(p => p.uid === $("compareA").value);
  const b = players.find(p => p.uid === $("compareB").value);
  if (!a || !b || a.uid === b.uid) {
    $("compareResult").innerHTML = '<p class="empty-note">Choisis deux joueurs différents pour afficher leur comparaison.</p>';
    return;
  }
  const rows = [["Niveau","level"],["Points BR","br"],["Points CS","cs"],["Parties","matches"],["Victoires","wins"]];
  const card = (p) => '<article class="compare-card"><h3>'+escapeHTML(p.name)+'</h3>'+rows.map(([label,key]) => '<div class="compare-line"><span>'+label+'</span><b>'+formatNumber(p[key])+'</b></div>').join("")+'<div class="compare-line"><span>BOOYAH Pulse</span><b>'+playerPulse(p)+'/100</b></div></article>';
  $("compareResult").innerHTML = '<div class="compare-cards">'+card(a)+card(b)+'</div>';
}
function renderAll() { updateMetrics(); renderFeatured(); renderMiniLadder(); renderLadder(); fillCompareOptions(); }

$("playerForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const read = (id) => $(id).value.trim();
  const player = {
    name: read("playerName"), uid: read("playerUid"), region: read("playerRegion"),
    level: Number(read("playerLevel")), br: Number(read("playerBr")), cs: Number(read("playerCs")),
    matches: Number(read("playerMatches")), wins: Number(read("playerWins")),
    updatedAt: new Date().toISOString(), source: "manual", verified: false
  };
  if (!/^[0-9]{5,15}$/.test(player.uid)) { $("playerStatus").textContent = "UID invalide : entre 5 et 15 chiffres."; return; }
  if (player.wins > player.matches) { $("playerStatus").textContent = "Les victoires ne peuvent pas dépasser les parties jouées."; return; }
  players = upsertPlayer(players, player);
  if (!savePlayers(players)) { $("playerStatus").textContent = "Stockage indisponible. Libère de l’espace puis réessaie."; return; }
  $("playerForm").reset();
  $("shotPreview").hidden = true;
  $("shotPreview").innerHTML = "";
  if (screenshotUrl) URL.revokeObjectURL(screenshotUrl);
  screenshotUrl = "";
  $("playerStatus").textContent = "Passeport enregistré sur cet appareil. Statistiques déclarées, non vérifiées.";
  renderAll();
});
$("playerShot").addEventListener("change", () => {
  const file = $("playerShot").files?.[0];
  const host = $("shotPreview");
  if (screenshotUrl) URL.revokeObjectURL(screenshotUrl);
  if (!file) { host.hidden = true; host.innerHTML = ""; return; }
  if (!file.type.startsWith("image/")) { $("playerStatus").textContent = "Choisis un fichier image."; return; }
  screenshotUrl = URL.createObjectURL(file);
  host.innerHTML = '<img alt="Aperçu local de la capture"><span>Capture sélectionnée : '+escapeHTML(file.name)+'. Les chiffres restent à confirmer manuellement.</span>';
  host.querySelector("img").src = screenshotUrl;
  host.hidden = false;
});
$("sortMode").addEventListener("change", renderLadder);
$("compareA").addEventListener("change", renderCompare);
$("compareB").addEventListener("change", renderCompare);
document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-go]");
  if (target) document.getElementById(target.dataset.go)?.scrollIntoView({behavior:"smooth"});
  const nav = event.target.closest("[data-view]");
  if (nav) {
    document.querySelectorAll("[data-view]").forEach(el => el.classList.toggle("active", el === nav));
  }
});
$("openPassport").addEventListener("click", () => $("passport").scrollIntoView({behavior:"smooth"}));

const COMMUNITY_KEY = "booyah-zone-community-v1";
function loadCommunityPosts() {
  try {
    const data = JSON.parse(localStorage.getItem(COMMUNITY_KEY) || "[]");
    return Array.isArray(data) ? data.filter(p => p && typeof p.text === "string" && typeof p.category === "string").slice(0,30) : [];
  } catch { return []; }
}
let communityPosts = loadCommunityPosts();
function renderCommunity() {
  const host = $("communityFeed");
  if (!communityPosts.length) {
    host.innerHTML = '<div class="community-empty"><span>✦</span><b>La Zone attend ton premier message.</b><p>Publie une astuce ou lance une discussion pour commencer.</p></div>';
    return;
  }
  host.innerHTML = communityPosts.map(post => '<article class="community-post"><div class="post-avatar">BZ</div><div class="post-body"><div class="post-meta"><b>Joueur BOOYAH</b><span>'+escapeHTML(post.category)+'</span><time>'+new Date(post.createdAt).toLocaleString("fr-FR",{dateStyle:"short",timeStyle:"short"})+'</time></div><p>'+escapeHTML(post.text).replace(/\n/g,"<br>")+'</p><small class="post-local-label">ENREGISTRÉ SUR CET APPAREIL</small></div></article>').join("");
}
$("communityText").addEventListener("input", () => {
  $("communityCount").textContent = $("communityText").value.length+" / 300";
});
$("communityForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const text = $("communityText").value.trim();
  if (!text) { $("communityStatus").textContent = "Écris un message avant de l'enregistrer."; return; }
  const post = {category:$("communityCategory").value,text,createdAt:new Date().toISOString()};
  communityPosts.unshift(post);
  communityPosts = communityPosts.slice(0,30);
  try {
    localStorage.setItem(COMMUNITY_KEY,JSON.stringify(communityPosts));
    $("communityStatus").textContent = "Publication enregistrée sur cet appareil. Elle n'est pas encore partagée publiquement.";
    $("communityForm").reset();
    $("communityCount").textContent = "0 / 300";
    renderCommunity();
  } catch {
    communityPosts.shift();
    $("communityStatus").textContent = "Stockage indisponible. Libère de l'espace puis réessaie.";
  }
});

renderCommunity();
const apiStatus = getProfileSourceStatus();
if (!apiStatus.ready) console.info("BOOYAH ZONE: "+apiStatus.message);
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
renderAll();
