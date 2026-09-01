import { supabase } from './supabase'

// Keys used in the user_data table AND as localStorage cache keys.
export const K = {
  SAVED_PROGRAMS: 'saved_programs',
  SAVED_CHATS: 'saved_chats',
  PROFILE: 'profile',
}

// Pre-cloud releases wrote to these anonymous keys. They are read once per
// device so nothing a user saved before signing in is lost, then marked as
// consumed so stale local data can never mask the account's cloud state.
const LEGACY_KEYS = {
  saved_programs: 'unifind_saved_programs',
  saved_chats: 'unifind_saved_chats',
  profile: 'unifind_profile',
}

const cacheKey = (userId, key) => `unifind:${userId}:${key}`
const legacyDoneKey = (userId, key) => `unifind:${userId}:${key}:legacy-consumed`

function readLocal(k) {
  try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null }
}
function writeLocal(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)) } catch {}
}

// ── Merge strategies ────────────────────────────────────────────────────────
// Sync must never drop a save made on another device, so loads merge every
// source rather than picking a winner. Merges are idempotent, so repeated
// syncs settle instead of ping-ponging between devices.

function mergeByName(...lists) {
  const out = []
  const seen = new Set()
  for (const list of lists) {
    if (!Array.isArray(list)) continue
    for (const item of list) {
      const id = item?.name
      if (!id || seen.has(id)) continue
      seen.add(id)
      out.push(item)
    }
  }
  return out
}

function mergeChats(...lists) {
  const out = []
  const seen = new Map()
  for (const list of lists) {
    if (!Array.isArray(list)) continue
    for (const chat of list) {
      const id = chat?.uni?.name
      if (!id) continue
      const prev = seen.get(id)
      // Keep whichever copy has more of the conversation in it.
      if (!prev) {
        seen.set(id, chat)
        out.push(chat)
      } else if ((chat.messages?.length || 0) > (prev.messages?.length || 0)) {
        out[out.indexOf(prev)] = chat
        seen.set(id, chat)
      }
    }
  }
  return out
}

// Profile is a flat object: a non-empty field always beats an empty one, and
// earlier sources (cloud) win ties.
function mergeProfile(...objs) {
  const out = {}
  for (const obj of objs) {
    if (!obj || typeof obj !== 'object') continue
    for (const [k, v] of Object.entries(obj)) {
      const empty = v === '' || v === null || v === undefined
      const haveValue = out[k] !== '' && out[k] !== null && out[k] !== undefined
      if (empty || haveValue) continue
      out[k] = v
    }
  }
  return out
}

function mergeFor(key, ...sources) {
  if (key === K.SAVED_CHATS) return mergeChats(...sources)
  if (key === K.PROFILE) return mergeProfile(...sources)
  return mergeByName(...sources)
}

// ── Public API ──────────────────────────────────────────────────────────────

// The signed-in user id straight from the auth session. React state can lag
// behind the session (or be null during a token refresh), and writing with a
// stale/absent id is exactly how saves end up stranded on one device.
export async function currentUserId() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user?.id ?? null
  } catch {
    return null
  }
}

async function writeCloud(userId, key, value) {
  const { error } = await supabase
    .from('user_data')
    .upsert(
      { user_id: userId, key, value, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,key' }
    )
  return error ?? null
}

async function readCloud(userId, key) {
  const { data, error } = await supabase
    .from('user_data')
    .select('value')
    .eq('user_id', userId)
    .eq('key', key)
    .maybeSingle()
  if (error) return { value: undefined, error }
  return { value: data?.value, error: null }
}

/**
 * Load a key for the signed-in user, merging cloud state with anything this
 * device holds locally, then writing the merged result back so every device
 * converges on the same data. Returns the merged value.
 */
export async function syncUserData(key, opts = {}) {
  const empty = key === K.PROFILE ? {} : []
  const userId = opts.userId || await currentUserId()

  if (!userId) {
    return readLocal(LEGACY_KEYS[key]) ?? empty
  }

  const localCache = readLocal(cacheKey(userId, key))

  // Anonymous data is folded in once per device, then never again — otherwise
  // a program removed on another device would keep reappearing here.
  let legacy = null
  if (!readLocal(legacyDoneKey(userId, key))) {
    legacy = readLocal(LEGACY_KEYS[key])
  }

  const { value: cloud, error } = await readCloud(userId, key)

  if (error) {
    opts.onError?.(error)
    return mergeFor(key, localCache, legacy) ?? empty
  }

  const merged = mergeFor(key, cloud, localCache, legacy)

  writeLocal(cacheKey(userId, key), merged)
  writeLocal(legacyDoneKey(userId, key), true)

  // Only write when the cloud copy is actually behind, to avoid pointless
  // round-trips on every navigation.
  if (JSON.stringify(cloud ?? null) !== JSON.stringify(merged)) {
    const writeErr = await writeCloud(userId, key, merged)
    if (writeErr) opts.onError?.(writeErr)
  }

  return merged
}

/** Persist a value for the signed-in user to both cloud and local cache. */
export async function saveUserData(key, value, opts = {}) {
  const userId = opts.userId || await currentUserId()

  if (!userId) {
    writeLocal(LEGACY_KEYS[key], value)
    return { ok: true, offline: true }
  }

  writeLocal(cacheKey(userId, key), value)
  // A save is an explicit user action, so it also settles the legacy import:
  // whatever is on screen now is the truth for this device.
  writeLocal(legacyDoneKey(userId, key), true)

  const error = await writeCloud(userId, key, value)
  if (error) {
    console.warn('user_data upsert failed', error)
    opts.onError?.(error)
    return { ok: false, error }
  }
  return { ok: true }
}
