'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) { setError('Пароль мінімум 6 символів'); return }
    setLoading(true)
    setError('')
    const { error } = await signUpWithEmail(email, password, name)
    if (error) {
      setError(error.message === 'User already registered' ? 'Цей email вже зареєстровано' : 'Помилка реєстрації')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-playfair text-3xl font-bold text-[#1A1A18] mb-8 text-center">
          Створити акаунт
        </h1>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors mb-6"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Увійти через Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs text-gray-400 bg-[#FAFAF8] px-2 w-fit mx-auto">
            або
          </div>
        </div>

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
