'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Locale } from '@/lib/types'
import { Book } from '@/lib/types'
import { getFavorites, getHistory, getReadBooks, getFirstVisit } from '@/lib/favorites'
import BookCard from '@/components/BookCard'
import { BookMarked, CheckCircle, Eye, Clock, User } from 'lucide-react'

interface PageProps {
  params: { locale: Locale }
}

function getMotivation(count: number, locale: Locale): string {
  if (locale === 'uk') {
    if (count <= 3) return 'Гарний початок!'
    if (count <= 6) return 'Ти на правильному шляху!'
    if (count <= 10) return 'Майже там!'
    return 'Неймовірно!'
  } else {
    if (count <= 3) return 'Great start!'
    if (count <= 6) return 'You are on the right track!'
    if (count <= 10) return 'Almost there!'
    return 'Incredible!'
  }
}

export default function ProfilePage({ params }: PageProps) {
  const locale = (params.locale === 'en' ? 'en' : 'uk') as Locale

  const [mounted, setMounted] = useState(false)
  const [favorites, setFavorites] = useState<Book[]>([])
  const [history, setHistory] = useState<Book[]>([])
  const [readIds, setReadIds] = useState<string[]>([])
  const [firstVisit, setFirstVisit] = useState<string>('')
  const [goal, setGoal] = useState(12)
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState('12')
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    setMounted(true)
    setFavorites(getFavorites())
    setHistory(getHistory())
    setReadIds(getReadBooks())
    setFirstVisit(getFirstVisit())
    const savedGoal = parseInt(localStorage.getItem('reading_goal') || '12', 10)
    setGoal(savedGoal)
    setGoalInput(String(savedGoal))
  }, [])

  const saveGoal = () => {
    const n = parseInt(goalInput, 10)
    if (!isNaN(n) && n > 0) {
      setGoal(n)
      localStorage.setItem('reading_goal', String(n))
    }
    setEditingGoal(false)
  }

  const clearAllData = () => {
    ;['knyhy_favorites', 'reading_history', 'read_books', 'first_visit', 'reading_goal'].forEach(k =>
      localStorage.removeItem(k)
    )
    setFavorites([])
    setHistory([])
    setReadIds([])
    setGoal(12)
    setShowConfirm(false)
  }

  // Total minutes from read books
  const totalMinutes = history.filter(b => readIds.includes(b.id)).reduce((sum, b) => sum + (b.read_time_min || 0), 0)

  const memberSince = firstVisit
    ? new Date(firstVisit).toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'en-US', { month: 'long', year: 'numeric' })
    : ''

  const progressPercent = Math.min((readIds.length / goal) * 100, 100)

  if (!mounted) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-[#2D5016] flex items-center justify-center mb-4 shadow-md">
          <User size={36} strokeWidth={1.5} className="text-white" />
        </div>
        <h1 className="font-playfair text-3xl font-bold text-[#1A1A18] mb-1">
          {locale === 'uk' ? 'Мій профіль' : 'My Profile'}
        </h1>
        {memberSince && (
          <p className="text-sm text-gray-500">
            {locale === 'uk' ? `З нами з ${memberSince}` : `Member since ${memberSince}`}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { icon: <BookMarked size={22} strokeWidth={1.5} />, value: favorites.length, label: locale === 'uk' ? 'Збережено' : 'Saved' },
          { icon: <CheckCircle size={22} strokeWidth={1.5} />, value: readIds.length, label: locale === 'uk' ? 'Прочитано' : 'Read' },
          { icon: <Eye size={22} strokeWidth={1.5} />, value: history.length, label: locale === 'uk' ? 'Переглянуто' : 'Viewed' },
          { icon: <Clock size={22} strokeWidth={1.5} />, value: totalMinutes, label: locale === 'uk' ? 'Хвилин' : 'Minutes' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col items-center gap-2">
            <span className="text-[#2D5016]">{stat.icon}</span>
            <span className="font-playfair text-2xl font-bold text-[#1A1A18]">{stat.value}</span>
            <span className="text-xs text-gray-500 text-center">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Recently Viewed */}
      <section className="mb-10">
        <h2 className="font-playfair text-xl font-semibold text-[#1A1A18] mb-4">
          {locale === 'uk' ? 'Нещодавно переглянуті' : 'Recently Viewed'}
        </h2>
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm">
            {locale === 'uk' ? 'Ви ще не переглядали жодної книги' : "You haven't viewed any books yet"}
          </p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {history.slice(0, 5).map(book => (
              <div key={book.id} className="shrink-0 w-[160px]">
                <BookCard book={book} locale={locale} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Saved Books */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-playfair text-xl font-semibold text-[#1A1A18]">
            {locale === 'uk' ? 'Збережені книги' : 'Saved Books'}
          </h2>
          {favorites.length > 4 && (
            <Link href={`/${locale}/saved`} className="text-sm text-[#2D5016] hover:underline">
              {locale === 'uk' ? 'Переглянути всі' : 'View all'} &rarr;
            </Link>
          )}
        </div>
        {favorites.length === 0 ? (
          <p className="text-gray-500 text-sm">
            {locale === 'uk' ? 'Збережених книг немає. Натисніть на закладку на будь-якій книзі.' : 'No saved books. Click the bookmark on any book.'}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {favorites.slice(0, 4).map(book => (
              <BookCard key={book.id} book={book} locale={locale} />
            ))}
          </div>
        )}
      </section>

      {/* Reading Goal */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-playfair text-xl font-semibold text-[#1A1A18]">
            {locale === 'uk' ? 'Мета читання' : 'Reading Goal'}
          </h2>
          {!editingGoal ? (
            <button onClick={() => setEditingGoal(true)} className="text-sm text-gray-400 hover:text-[#2D5016] transition-colors">
              {locale === 'uk' ? 'Змінити' : 'Edit'}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={goalInput}
                onChange={e => setGoalInput(e.target.value)}
                className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center"
                min={1}
              />
              <button onClick={saveGoal} className="text-sm text-[#2D5016] font-medium">
                {locale === 'uk' ? 'Зберегти' : 'Save'}
              </button>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-3">
          {locale === 'uk'
            ? `${readIds.length} / ${goal} книг цього року`
            : `${readIds.length} / ${goal} books this year`}
        </p>
        <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
          <div
            className="bg-[#2D5016] h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">{getMotivation(readIds.length, locale)}</p>
      </section>

      {/* Clear data */}
      <div className="text-center">
        {!showConfirm ? (
          <button onClick={() => setShowConfirm(true)} className="text-xs text-gray-400 hover:text-red-400 transition-colors">
            {locale === 'uk' ? 'Очистити всі дані' : 'Clear all data'}
          </button>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs text-gray-500">
              {locale === 'uk' ? 'Ви впевнені?' : 'Are you sure?'}
            </span>
            <button onClick={clearAllData} className="text-xs text-red-500 font-medium hover:underline">
              {locale === 'uk' ? 'Так, очистити' : 'Yes, clear'}
            </button>
            <button onClick={() => setShowConfirm(false)} className="text-xs text-gray-400 hover:underline">
              {locale === 'uk' ? 'Скасувати' : 'Cancel'}
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
