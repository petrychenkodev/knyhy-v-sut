import Link from 'next/link'
import { cookies } from 'next/headers'
import { createHash } from 'crypto'
import AdminLoginForm from '@/components/admin/AdminLoginForm'
import AdminLogoutButton from '@/components/admin/AdminLogoutButton'

export const metadata = {
  title: 'Admin — Книги в суть',
}

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

function isAuthenticated(): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return false
  const cookieStore = cookies()
  const token = cookieStore.get('admin_auth')?.value
  return token === hashPassword(adminPassword)
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <AdminLoginForm />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/uk"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#2D5016] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              На сайт
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-sm font-semibold text-gray-800">Адмін панель</span>
          </div>
          <AdminLogoutButton />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
