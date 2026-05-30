'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUpWithEmail } from '@/lib/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await signUpWithEmail(email, password, name || undefined)

      if (error) {
        console.error('Signup error full:', error)
        console.error('Error message:', error.message)
        console.error('Error status:', error.status)
        setError(`Помилка: ${error.message}`)
        setLoading(false)
        return
      }

      console.log('Signup success:', data)
      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('Caught error:', err)
      setError(`Caught: ${err}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-playfair text-3xl font-bold text-[#1A1A18] mb-8 text-center">
          Створити акаунт
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Ваше ім'я (необов'язково)"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5016]/30 bg-white"
          />
          <input
            type="email"
            placeholder="Ваш email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5016]/30 bg-white"
          />
          <input
            type="password"
            placeholder="Пароль (мінімум 6 символів)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5016]/30 bg-white"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D5016] text-white rounded-xl px-4 py-3 text-sm font-medium hover:bg-[#234010] transition-colors disabled:opacity-50"
          >
            {loading ? 'Реєструємось...' : 'Зареєструватись'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          <Link href="/login" className="text-[#2D5016] hover:underline">
            Вже є акаунт? Увійти →
          </Link>
        </p>
      </div>
    </div>
  )
}
