'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Book } from '@/lib/types'
import { getFavorites, getSavedArticles, getHistory, getReadBooks, getFirstVisit } from '@/lib/favorites'
import BookCard from '@/components/BookCard'
import { BookMarked, CheckCircle, Eye, Clock, User, FileText } from 'lucide-react'
import { getNotes } from '@/lib/notes'
import ProfileAuthSection from '@/components/ProfileAuthSection'

function getMotivation(count: number): string {
  if (count <= 3) return 'Гарний початок!'
  if (count <= 6) return 'Ти на правильному шляху!'
  if (count <= 10) return 'Майже там!'
  return 'Неймовірно!'
}

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)
  const [favorites, setFavorites] = useState<Book[]>([])
  const [savedArticlesCount, setSavedArticlesCount] = useState(0)
  const [history, setHistory] = useState<Book[]>([])
  const [readIds, setReadIds] = useState<string[]>([])
  const [firstVisit, setFirstVisit] = useState<string>('')
  const [goal, setGoal] = useState(12)
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState('12')
  const [showConfirm, setShowConfirm] = useState(false)
  const [notesCount, setNotesCount] = useState(0)

  useEffect(() => {
    setMounted(true)
    getFavorites().then(setFavorites)
    setSavedArticlesCount(getSavedArticles().length)
    setHistory(getHistory())
    setReadIds(getReadBooks())
    setFirstVisit(getFirstVisit())
    const savedGoal = parseInt(localStorage.getItem('reading_goal') || '12', 10)
    setGoal(savedGoal)
    setGoalInput(String(savedGoal))
    getNotes().then(notes => setNotesCount(notes.length))
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

  const totalMinutes = history.filter(b => readIds.includes(b.id)).reduce((sum, b) => sum + (b.read_time_min || 0), 0)

  const memberSince = firstVisit
    ? new Date(firstVisit).toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' })
    : ''

  const progressPercent = Math.min((readIds.length / goal) * 100, 100)

  if (!mounted) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <ProfileAuthSection />
        <div className="w-20 h-20 rounded-full bg-[#2D5016] flex items-center justify-center mb-4 shadow-md">
          <User size={36} strokeWidth={1.5} className="text-white" />
        </div>
        <h1 className="font-playfair text-3xl font-bold text-[#1A1A18] mb-1">Мій профіль</h1>
        {memberSince && (
          <p className="text-sm text-gray-500">З нами з {memberSince}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { icon: <BookMarked size={22} strokeWidth={1.5} />, value: favorites.length + savedArticlesCount, label: 'Збережено', href: undefined },
          { icon: <CheckCircle size={22} strokeWidth={1.5} />, value: readIds.length, label: 'Прочитано', href: undefined },
          { icon: <Eye size={22} strokeWidth={1.5} />, value: history.length, label: 'Переглянуто', href: undefined },
          { icon: <Clock size={22} strokeWidth={1.5} />, value: totalMinutes, label: 'Хвилин', href: undefined },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col items-center gap-2">
            <span className="text-[#2D5016]">{stat.icon}</span>
            <span className="font-playfair text-2xl font-bold text-[#1A1A18]">{stat.value}</span>
            <span className="text-xs text-gray-500 text-center">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Notes stat card */}
      <Link href="/notes" className="block mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:border-[#2D5016]/30 transition-colors">
          <span className="text-[#2D5016]"><FileText size={24} strokeWidth={1.5} /></span>
          <div className="flex-1">
            <span className="font-playfair text-2xl font-bold text-[#1A1A18]">{notesCount}</span>
            <span className="text-xs text-gray-500 ml-2">Нотаток</span>
          </div>
          <span className="text-sm text-[#2D5016] font-medium">Мої нотатки →</span>
        </div>
      </Link>

      {/* Recently Viewed */}
      <section className="mb-10">
        <h2 className="font-playfair text-xl font-semibold text-[#1A1A18] mb-4">Нещодавно переглянуті</h2>
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm">Ви ще не переглядали жодної книги</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {history.slice(0, 5).map(book => (
              <div key={book.id} className="shrink-0 w-[160px]">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Saved Books */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-playfair text-xl font-semibold text-[#1A1A18]">Збережені книги</h2>
          {favorites.length > 4 && (
            <Link href="/saved" className="text-sm text-[#2D5016] hover:underline">
              Переглянути всі &rarr;
            </Link>
          )}
        </div>
        {favorites.length === 0 ? (
          <p className="text-gray-500 text-sm">Збережених книг немає. Натисніть на закладку на будь-якій книзі.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {favorites.slice(0, 4).map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* Reading Goal */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-playfair text-xl font-semibold text-[#1A1A18]">Мета читання</h2>
          {!editingGoal ? (
            <button onClick={() => setEditingGoal(true)} className="text-sm text-gray-400 hover:text-[#2D5016] transition-colors">
              Змінити
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
              <button onClick={saveGoal} className="text-sm text-[#2D5016] font-medium">Зберегти</button>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-3">{readIds.length} / {goal} книг цього року</p>
        <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
          <div
            className="bg-[#2D5016] h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">{getMotivation(readIds.length)}</p>
      </section>

      {/* Clear data */}
      <div className="text-center">
        {!showConfirm ? (
          <button onClick={() => setShowConfirm(true)} className="text-xs text-gray-400 hover:text-red-400 transition-colors">
            Очистити всі дані
          </button>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs text-gray-500">Ви впевнені?</span>
            <button onClick={clearAllData} className="text-xs text-red-500 font-medium hover:underline">Так, очистити</button>
            <button onClick={() => setShowConfirm(false)} className="text-xs text-gray-400 hover:underline">Скасувати</button>
          </div>
        )}
      </div>

    </div>
  )
}
