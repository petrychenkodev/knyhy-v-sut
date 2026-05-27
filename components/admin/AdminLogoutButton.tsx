'use client'

import { useRouter } from 'next/navigation'

export default function AdminLogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin-auth', { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-500 hover:text-red-600 transition-colors"
    >
      Вийти
    </button>
  )
}
