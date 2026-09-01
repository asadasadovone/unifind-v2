import { supabase } from './supabase'

// Keys used in the user_data table AND as localStorage cache keys.
export const K = {
  SAVED_PROGRAMS: 'saved_programs',
  SAVED_CHATS: 'saved_chats',
  PROFILE: 'profile',
}

const LEGACY_KEYS = {
  saved_programs: 'unifind_saved_programs',
  saved_chats: 'unifind_saved_chats',
  profile: 'unifind_profile',
}

function cacheKey(userId, key) {
  return `unifind:${userId}:${key}`
}

function readLocalRaw(k) {
  try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null }
}
function writeLocalRaw(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)) } catch {}
}

// Read from server first (source of truth), then update local cache.
// If server is unreachable or user is signed out, fall back to whatever the
// cache holds (per-user cache when signed in, legacy anonymous cache otherwise).
export async function loadUserData(userId, key, fallback) {
  if (!userId) {
    const legacy = readLocalRaw(LEGACY_KEYS[key])
    return legacy ?? fallback
  }
  const { data, error } = await supabase
    .from('user_data')
    .select('value')
    .eq('user_id', userId)
    .eq('key', key)
    .maybeSingle()

  if (!error && data && data.value !== null && data.value !== undefined) {
    writeLocalRaw(cacheKey(userId, key), data.value)
    return data.value
  }
  // No row on server — check for a per-user cache, or promote legacy anon data.
  const perUser = readLocalRaw(cacheKey(userId, key))
  if (perUser !== null) return perUser

  const legacy = readLocalRaw(LEGACY_KEYS[key])
  if (legacy !== null) {
    // Migrate anonymous data into this user's account.
    await saveUserData(userId, key, legacy)
    return legacy
  }
  return fallback
}

// Callers can pass { onError } to surface sync failures in the UI.
export async function saveUserData(userId, key, value, opts = {}) {
  if (!userId) {
    writeLocalRaw(LEGACY_KEYS[key], value)
    return { ok: true, offline: true }
  }
  writeLocalRaw(cacheKey(userId, key), value)
  const { error } = await supabase
    .from('user_data')
    .upsert(
      { user_id: userId, key, value, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,key' }
    )
  if (error) {
    console.warn('user_data upsert failed', error)
    opts.onError?.(error)
    return { ok: false, error }
  }
  return { ok: true }
}
