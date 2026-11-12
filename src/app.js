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
// Navigation d'application : un écran visible à la fois, sans défilement de page.
const screenTitles = {
  home: "ACCUEIL / PLAYER HUB",
  passport: "PROFIL / PASSEPORT JOUEUR",
  ladder: "RANKING / CLASSEMENTS",
  compare: "DUEL / COMPARATEUR",
  pulse: "ANALYSE / BOOYAH PULSE",
  crew: "SQUAD / MA CREW",
  community: "SOCIAL / ZONE",
  news: "DISCOVER / ACTUS & ÉVÉNEMENTS"
};
function setScreen(screen, updateAddress = true) {
  const allowed = Object.hasOwn(screenTitles, screen) ? screen : "home";
  document.body.dataset.appScreen = allowed;
  document.querySelectorAll(".main-content > *").forEach((node) => {
    if (node.classList.contains("topbar")) return;
    const isHomePart = node.matches(".welcome-row,.metric-grid,.content-grid");
    const visible = allowed === "home" ? isHomePart : node.id === (allowed === "pulse" ? "pulse-detail" : allowed);
    node.classList.toggle("screen-visible", visible);
    node.classList.toggle("screen-hidden", !visible);
  });
  document.querySelectorAll("[data-view]").forEach((el) => {
    el.classList.toggle("active", el.dataset.view === allowed);
    if (el.dataset.view === allowed) el.setAttribute("aria-current", "page");
    else el.removeAttribute("aria-current");
  });
  const crumb = document.querySelector(".breadcrumb");
  if (crumb) crumb.innerHTML = "BOOYAH ZONE / <b>" + screenTitles[allowed] + "</b>";
  const title = document.querySelector(".mobile-brand b");
  if (title) title.textContent = "BOOYAH ZONE";
  if (updateAddress) history.replaceState(null, "", allowed === "home" ? location.pathname : "#" + allowed);
  window.scrollTo({top:0,behavior:"instant"});
}
document.addEventListener("click", (event) => {
  const go = event.target.closest("[data-go]");
  if (go) {
    event.preventDefault();
    setScreen(go.dataset.go === "pulse-detail" ? "pulse" : go.dataset.go);
    return;
  }
  const nav = event.target.closest("[data-view]");
  if (nav) {
    event.preventDefault();
    setScreen(nav.dataset.view);
  }
});
$("openPassport").addEventListener("click", () => setScreen("passport"));
window.addEventListener("hashchange", () => {
  const route = location.hash.slice(1) || "home";
  setScreen(route === "pulse-detail" ? "pulse" : route, false);
});
setScreen(location.hash.slice(1) || "home", false);

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


// Crew prototype — données locales à cet appareil, sans invitations réseau.
const CREW_KEY = "booyah-zone-crew-v1";
function loadCrew() {
  try {
    const value = JSON.parse(localStorage.getItem(CREW_KEY) || "null");
    if (!value || typeof value.name !== "string" || !Array.isArray(value.members)) return null;
    return value;
  } catch { return null; }
}
let crew = loadCrew();
function saveCrew() {
  try { localStorage.setItem(CREW_KEY, JSON.stringify(crew)); return true; }
  catch { return false; }
}
function renderCrew() {
  $("crewEmpty").hidden = Boolean(crew);
  $("crewDashboard").hidden = !crew;
  if (!crew) return;
  $("crewBadge").textContent = escapeHTML(crew.tag);
  $("crewTitle").textContent = crew.name;
  $("crewDescriptionView").textContent = crew.description || "Une équipe BOOYAH ZONE.";
  $("crewTagView").textContent = crew.tag;
  $("crewInviteCode").textContent = crew.code;
  $("crewMemberCount").textContent = crew.members.length;
  $("crewRoster").innerHTML = crew.members.map((member,index) => '<div class="crew-roster-row"><span class="crew-roster-avatar">'+escapeHTML(getInitials(member.name))+'</span><span><b>'+escapeHTML(member.name)+'</b><small>'+(index===0?'FONDATEUR':'MEMBRE')+'</small></span><span class="crew-member-index">#'+String(index+1).padStart(2,"0")+'</span></div>').join("");
}
$("crewCreateForm").addEventListener("submit", event => {
  event.preventDefault();
  if (crew) return;
  const name = $("crewName").value.trim();
  const tag = $("crewTag").value.trim().toUpperCase();
  if (tag.length < 2 || tag.length > 5) { $("crewCreateStatus").textContent = "Le tag doit contenir entre 2 et 5 caractères."; return; }
  const founder = players[0]?.name || "Fondateur BOOYAH";
  crew = {name,tag,description:$("crewDescription").value.trim(),code:"BZ-"+Math.random().toString(36).slice(2,7).toUpperCase(),members:[{name:founder,role:"owner"}],createdAt:new Date().toISOString()};
  if (!saveCrew()) { crew = null; $("crewCreateStatus").textContent = "Stockage indisponible. Réessaie."; return; }
  renderCrew();
});
$("crewMemberForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("crewMemberName").value.trim();
  if (!name || !crew) return;
  if (crew.members.some(member => member.name.toLowerCase() === name.toLowerCase())) { $("crewMemberStatus").textContent = "Ce pseudo est déjà dans le roster."; return; }
  if (crew.members.length >= 20) { $("crewMemberStatus").textContent = "La limite de démonstration est de 20 membres."; return; }
  crew.members.push({name,role:"member"});
  if (!saveCrew()) { crew.members.pop(); $("crewMemberStatus").textContent = "Stockage indisponible. Réessaie."; return; }
  $("crewMemberForm").reset();
  $("crewMemberStatus").textContent = "Membre ajouté à la liste locale.";
  renderCrew();
});
$("copyCrewCode").addEventListener("click", async () => {
  if (!crew) return;
  try { await navigator.clipboard.writeText(crew.code); $("copyCrewCode").textContent = "Code copié"; }
  catch { $("crewMemberStatus").textContent = "Copie indisponible sur ce navigateur : sélectionne le code."; }
});
$("deleteCrew").addEventListener("click", () => {
  if (!crew || !confirm("Supprimer cette crew enregistrée sur cet appareil ?")) return;
  localStorage.removeItem(CREW_KEY); crew = null; $("crewCreateForm").reset(); renderCrew();
});
renderCrew();
