import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createHash } from 'crypto'

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD not configured' }, { status: 500 })
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Невірний пароль' }, { status: 401 })
  }

  const hash = hashPassword(adminPassword)
  const cookieStore = cookies()
  cookieStore.set('admin_auth', hash, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax',
  })

  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const cookieStore = cookies()
  cookieStore.delete('admin_auth')
  return NextResponse.json({ success: true })
}
