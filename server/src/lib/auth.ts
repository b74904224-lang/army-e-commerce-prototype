// Password hashing (bcrypt) and JWT issuing/verification helpers.

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import type { SignOptions } from "jsonwebtoken"
import { env } from "../config/env.js"

const SALT_ROUNDS = 12

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

export interface JwtPayload {
  sub: string // user id
  email: string
  name: string
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as SignOptions)
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, env.jwtSecret) as JwtPayload
  } catch {
    return null
  }
}
