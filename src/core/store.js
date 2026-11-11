const STORAGE_KEY = "booyah-zone-v2-players";
export function loadPlayers() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.filter(p => p && /^\d{5,15}$/.test(String(p.uid))) : [];
  } catch { return []; }
}
export function savePlayers(players) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(players.slice(0,250))); return true; }
  catch { return false; }
}
export function upsertPlayer(players, player) {
  const next = [...players];
  const index = next.findIndex(p => String(p.uid) === String(player.uid));
  if (index >= 0) next[index] = {...next[index], ...player};
  else next.push(player);
  return next;
}
export function calculatePulse(p) {
  const matches = Math.max(0, Number(p.matches) || 0);
  const wins = Math.max(0, Number(p.wins) || 0);
  const winRate = matches ? wins / matches : 0;
  const levelScore = Math.min(25, Math.round((Number(p.level) || 0) / 4));
  const pointsScore = Math.min(35, Math.round(((Number(p.br)||0) + (Number(p.cs)||0)) / 500));
  const activityScore = Math.min(20, Math.round(matches / 25));
  const resultScore = Math.min(20, Math.round(winRate * 100 * 0.5));
  return Math.max(0, Math.min(100, levelScore + pointsScore + activityScore + resultScore));
}
export function getSortedPlayers(players, mode="total") {
  const copy = [...players];
  const sorters = {
    total: (a,b) => (b.br+b.cs)-(a.br+a.cs),
    br: (a,b) => b.br-a.br,
    cs: (a,b) => b.cs-a.cs,
    wins: (a,b) => b.wins-a.wins,
    pulse: (a,b) => calculatePulse(b)-calculatePulse(a)
  };
  return copy.sort(sorters[mode] || sorters.total);
}
