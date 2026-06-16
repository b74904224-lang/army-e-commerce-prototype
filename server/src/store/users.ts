// User store backed by an append-only JSONL file (data/users.jsonl).
//
// Users are loaded into memory on boot for fast lookups and the file is the
// durable source of truth. Passwords are NEVER stored in plain text — only the
// bcrypt hash produced by lib/auth.ts is persisted here. For higher scale,
// swap these function bodies for a real database; the signatures are stable.

import { promises as fs } from "node:fs"
import fsSync from "node:fs"
import path from "node:path"
import { randomUUID } from "node:crypto"

export interface UserRecord {
  id: string
  name: string
  email: string
  phone?: string
  passwordHash: string
  createdAt: string
  updatedAt?: string
}

const DATA_DIR = path.resolve(process.cwd(), "data")
const USERS_FILE = path.join(DATA_DIR, "users.jsonl")

const usersById = new Map<string, UserRecord>()
const usersByEmail = new Map<string, UserRecord>()

function index(user: UserRecord) {
  usersById.set(user.id, user)
  usersByEmail.set(user.email.toLowerCase(), user)
}

// Load existing users synchronously at module init so routes are ready.
function loadFromDisk() {
  try {
    if (!fsSync.existsSync(USERS_FILE)) return
    const raw = fsSync.readFileSync(USERS_FILE, "utf8")
    for (const line of raw.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed) continue
      try {
        const record = JSON.parse(trimmed) as UserRecord
        // Later lines override earlier ones (supports profile updates).
        index(record)
      } catch {
        // skip corrupted line
      }
    }
    console.log(`[users] Loaded ${usersById.size} user(s) from ${USERS_FILE}`)
  } catch (err) {
    console.error("[users] Failed to load users from disk:", err)
  }
}

loadFromDisk()

async function appendToDisk(user: UserRecord): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.appendFile(USERS_FILE, JSON.stringify(user) + "\n", "utf8")
}

export function findUserByEmail(email: string): UserRecord | undefined {
  return usersByEmail.get(email.toLowerCase())
}

export function findUserById(id: string): UserRecord | undefined {
  return usersById.get(id)
}

export async function createUser(input: {
  name: string
  email: string
  passwordHash: string
  phone?: string
}): Promise<UserRecord> {
  const user: UserRecord = {
    id: randomUUID(),
    name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone,
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  }
  index(user)
  await appendToDisk(user)
  return user
}

/** Updates mutable profile fields (name/phone) and re-persists the record. */
export async function updateUser(
  id: string,
  patch: { name?: string; phone?: string },
): Promise<UserRecord | undefined> {
  const existing = usersById.get(id)
  if (!existing) return undefined

  const updated: UserRecord = {
    ...existing,
    ...(patch.name !== undefined ? { name: patch.name } : {}),
    ...(patch.phone !== undefined ? { phone: patch.phone } : {}),
    updatedAt: new Date().toISOString(),
  }
  index(updated)
  // Append-only: the newest line for an id wins on next load.
  await appendToDisk(updated)
  return updated
}
