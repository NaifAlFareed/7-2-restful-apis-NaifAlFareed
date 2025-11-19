function normalize(s) {
  return { 
    id: s._id ?? s.id, 
    title: s.title, 
    artist: s.artist, 
    year: s.year 
  };
}
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5174";


export async function apiGetSongs() {
  const res = await fetch(`${BASE}/api/songs`);
  if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
  const data = await res.json();
  return data.map(normalize);
}



export async function apiGetSong(id) {
  const res = await fetch(`${BASE}/api/songs/${id}`);
  if (!res.ok) throw new Error(`Failed to load song: ${res.status}`);
  const data = await res.json();
  return normalize(data);
}


export async function apiCreateSong(payload) {
  const res = await fetch(`${BASE}/api/songs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.status === 201) {
    const data = await res.json();
    return normalize(data);   // 👈 make sure new song has `id`
  }

  const err = await res.json().catch(() => ({}));
  throw new Error(err.message || `Create failed: ${res.status}`);
}

export async function apiUpdateSong(id, payload) {
  const res = await fetch(`${BASE}/api/songs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Update failed: ${res.status}`);
  }

  const data = await res.json();
  return normalize(data);     // 👈 updated song also has `id`
}


export async function apiDeleteSong(id) {
  const res = await fetch(`${BASE}/api/songs/${id}`, { method: "DELETE" });
  if (!(res.ok || res.status === 204)) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Delete failed: ${res.status}`);
  }
}

