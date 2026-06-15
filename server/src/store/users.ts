// In-memory user store.
//
// NOTE: This is a reference implementation that keeps users in memory so the
// API runs out of the box. For production, swap these functions for a real
// database (PostgreSQL on OVHcloud, etc.) — the public function signatures are
// designed so you only need to change the bodies, not the routes.

import { randomUUID } from "node:crypto"

export interface UserRecord {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: string
}

const usersByEmail = new Map<string, UserRecord>()

export function findUserByEmail(email: string): UserRecord | undefined {
  return usersByEmail.get(email.toLowerCase())
}

export function createUser(input: { name: string; email: string; passwordHash: string }): UserRecord {
  const user: UserRecord = {
    id: randomUUID(),
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  }
  usersByEmail.set(user.email, user)
  return user
}
