'use client'

import { useState, useRef } from 'react'
import { Book } from '@/lib/types'
import RichTextEditor from './RichTextEditor'

const CATEGORIES = [
  { value: 'psychology', label: 'Психологія' },
  { value: 'business', label: 'Бізнес' },
  { value: 'science', label: 'Наука' },
  { value: 'philosophy', label: 'Філософія' },
  { value: 'health', label: "Здоров'я" },
  { value: 'finance', label: 'Фінанси' },
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

interface BookFormProps {
  book?: Partial<Book>
  action: (formData: FormData) => Promise<void>
}

const inputCls =
  'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2D5016]/40 focus:border-[#2D5016] transition-colors placeholder:text-gray-400 bg-white'
const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5'
const sectionCls = 'bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5'
const sectionTitleCls = 'text-base font-semibold text-gray-900 pb-1 border-b border-gray-100'

export default function BookForm({ book, action }: BookFormProps) {
  const initUa = book?.key_insights_ua?.length ? book.key_insights_ua : ['', '', '']
  const initEn = book?.key_insights_en?.length ? book.key_insights_en : ['', '', '']

  // Keep UA and EN insights in sync (same row count)
  const maxLen = Math.max(initUa.length, initEn.length)
  const [insightsUa, setInsightsUa] = useState<string[]>([
    ...initUa,
    ...Array(maxLen - initUa.length).fill(''),
  ])
  const [insightsEn, setInsightsEn] = useState<string[]>([
    ...initEn,
    ...Array(maxLen - initEn.length).fill(''),
  ])

  const initPracticalUa = book?.practical_ua?.length ? book.practical_ua : ['', '', '']
  const initPracticalEn = book?.practical_en?.length ? book.practical_en : ['', '', '']
  const maxPractical = Math.max(initPracticalUa.length, initPracticalEn.length)
  const [practicalUa, setPracticalUa] = useState<string[]>([
    ...initPracticalUa,
    ...Array(maxPractical - initPracticalUa.length).fill(''),
  ])
  const [practicalEn, setPracticalEn] = useState<string[]>([
    ...initPracticalEn,
    ...Array(maxPractical - initPracticalEn.length).fill(''),
  ])

  const [summaryUa, setSummaryUa] = useState(book?.summary_ua ?? '')
  const [summaryEn, setSummaryEn] = useState(book?.summary_en ?? '')
  const [category, setCategory] = useState(book?.category ?? '')

  const [published, setPublished] = useState(book?.published ?? false)
  const [slugValue, setSlugValue] = useState(book?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!book?.slug)
  const [isPending, setIsPending] = useState(false)
  const [pendingType, setPendingType] = useState<'draft' | 'publish' | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function handleTitleEnChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!slugTouched) setSlugValue(slugify(e.target.value))
  }

  function addInsight() {
    setInsightsUa([...insightsUa, ''])
    setInsightsEn([...insightsEn, ''])
  }

  function removeInsight(idx: number) {
    setInsightsUa(insightsUa.filter((_, i) => i !== idx))
    setInsightsEn(insightsEn.filter((_, i) => i !== idx))
  }

  async function handleSubmit(pub: boolean) {
    if (!formRef.current) return
    setIsPending(true)
    setPendingType(pub ? 'publish' : 'draft')
    const fd = new FormData(formRef.current)
    fd.set('published', pub ? 'true' : 'false')
    try {
      await action(fd)
    } catch (e) {
      console.error(e)
      setIsPending(false)
      setPendingType(null)
    }
  }

  return (
    <form ref={formRef} className="space-y-6" onSubmit={(e) => e.preventDefault()}>

      {/* ── Section 1: Basic info ── */}
      <div className={sectionCls}>
        <h2 className={sectionTitleCls}>Основна інформація</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Назва (UA) *</label>
            <input name="title_ua" type="text" required defaultValue={book?.title_ua}
              className={inputCls} placeholder="Назва книги українською" />
          </div>
          <div>
            <label className={labelCls}>Title (EN) *</label>
            <input name="title_en" type="text" required defaultValue={book?.title_en}
              className={inputCls} placeholder="Book title in English"
              onChange={handleTitleEnChange} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Автор *</label>
            <input name="author" type="text" required defaultValue={book?.author}
              className={inputCls} placeholder="Ім'я автора" />
          </div>
          <div>
            <label className={labelCls}>Категорія *</label>
            <input type="hidden" name="category" value={category} />
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputCls}
            >
              <option value="" disabled>Оберіть категорію</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className={labelCls}>URL обкладинки</label>
            <input name="cover_url" type="url" defaultValue={book?.cover_url ?? ''}
              className={inputCls} placeholder="https://..." />
          </div>
          <div>
            <label className={labelCls}>Час читання (хв)</label>
            <input name="read_time_min" type="number" min={1} max={120}
              defaultValue={book?.read_time_min ?? 10} className={inputCls} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Slug *</label>
          <input
            name="slug" type="text" required
            value={slugValue}
            onChange={(e) => { setSlugTouched(true); setSlugValue(e.target.value) }}
            className={`${inputCls} font-mono text-xs`}
            placeholder="auto-generated-from-title"
          />
          <p className="mt-1 text-xs text-gray-400">
            URL: /uk/books/<span className="text-gray-600">{slugValue || '...'}</span>
          </p>
        </div>
      </div>

      {/* ── Section 2: Summaries ── */}
      <div className={sectionCls}>
        <h2 className={sectionTitleCls}>Самарі</h2>
        <input type="hidden" name="summary_ua" value={summaryUa} />
        <input type="hidden" name="summary_en" value={summaryEn} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Самарі (UA) *</label>
            <RichTextEditor
              value={summaryUa}
              onChange={setSummaryUa}
              placeholder="Опис книги українською..."
            />
          </div>
          <div>
            <label className={labelCls}>Summary (EN) *</label>
            <RichTextEditor
              value={summaryEn}
              onChange={setSummaryEn}
              placeholder="Book summary in English..."
            />
          </div>
        </div>
      </div>

      {/* ── Section 3: Key insights ── */}
      <div className={sectionCls}>
        <h2 className={sectionTitleCls}>Ключові інсайти</h2>
        {insightsUa.map((_, idx) => (
          <input key={`hiu-${idx}`} type="hidden" name="key_insights_ua" value={insightsUa[idx]} />
        ))}
        {insightsEn.map((_, idx) => (
          <input key={`hie-${idx}`} type="hidden" name="key_insights_en" value={insightsEn[idx]} />
        ))}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* UA column */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-3">Українська</p>
            <div className="space-y-3">
              {insightsUa.map((val, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="text-xs text-gray-400 w-5 text-right shrink-0 mt-2">{idx + 1}.</span>
                  <div className="flex-1">
                    <RichTextEditor
                      compact
                      value={val}
                      onChange={(html) => {
                        const next = [...insightsUa]; next[idx] = html; setInsightsUa(next)
                      }}
                      placeholder={`Інсайт ${idx + 1}`}
                    />
                  </div>
                  <button type="button" onClick={() => removeInsight(idx)}
                    className="text-gray-300 hover:text-red-400 transition-colors text-xl leading-none px-1 shrink-0 mt-2">
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* EN column */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-3">English</p>
            <div className="space-y-3">
              {insightsEn.map((val, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="text-xs text-gray-400 w-5 text-right shrink-0 mt-2">{idx + 1}.</span>
                  <div className="flex-1">
                    <RichTextEditor
                      compact
                      value={val}
                      onChange={(html) => {
                        const next = [...insightsEn]; next[idx] = html; setInsightsEn(next)
                      }}
                      placeholder={`Insight ${idx + 1}`}
                    />
                  </div>
                  <span className="w-6 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button type="button" onClick={addInsight}
          className="mt-3 text-sm text-[#2D5016] hover:underline flex items-center gap-1">
          <span className="text-lg leading-none">＋</span> Додати інсайт
        </button>
      </div>

      {/* ── Section 4: Practical application ── */}
      <div className={sectionCls}>
        <h2 className={sectionTitleCls}>Практичне застосування</h2>
        {practicalUa.map((_, idx) => (
          <input key={`hpu-${idx}`} type="hidden" name="practical_ua" value={practicalUa[idx]} />
        ))}
        {practicalEn.map((_, idx) => (
          <input key={`hpe-${idx}`} type="hidden" name="practical_en" value={practicalEn[idx]} />
        ))}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* UA column */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-3">Що застосувати в житті (UA)</p>
            <div className="space-y-3">
              {practicalUa.map((val, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="text-xs text-gray-400 w-5 text-right shrink-0 mt-2">{idx + 1}.</span>
                  <div className="flex-1">
                    <RichTextEditor
                      compact
                      value={val}
                      onChange={(html) => {
                        const next = [...practicalUa]; next[idx] = html; setPracticalUa(next)
                      }}
                      placeholder={`Пункт ${idx + 1}`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPracticalUa(practicalUa.filter((_, i) => i !== idx))
                      setPracticalEn(practicalEn.filter((_, i) => i !== idx))
                    }}
                    className="text-gray-300 hover:text-red-400 transition-colors text-xl leading-none px-1 shrink-0 mt-2">
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* EN column */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-3">What to Apply in Life (EN)</p>
            <div className="space-y-3">
              {practicalEn.map((val, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="text-xs text-gray-400 w-5 text-right shrink-0 mt-2">{idx + 1}.</span>
                  <div className="flex-1">
                    <RichTextEditor
                      compact
                      value={val}
                      onChange={(html) => {
                        const next = [...practicalEn]; next[idx] = html; setPracticalEn(next)
                      }}
                      placeholder={`Point ${idx + 1}`}
                    />
                  </div>
                  <span className="w-6 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => { setPracticalUa([...practicalUa, '']); setPracticalEn([...practicalEn, '']) }}
          className="mt-3 text-sm text-[#2D5016] hover:underline flex items-center gap-1">
          <span className="text-lg leading-none">＋</span> Додати пункт
        </button>
      </div>

      {/* ── Section 5: Publish ── */}
      <div className={sectionCls}>
        <h2 className={sectionTitleCls}>Публікація</h2>

        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={published}
            onClick={() => setPublished(!published)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2D5016]/40 ${published ? 'bg-[#2D5016]' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${published ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <input type="hidden" name="published" value={published ? 'true' : 'false'} />
          <span className="text-sm font-medium text-gray-700">
            {published ? '✓ Опубліковано' : 'Чернетка'}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="button" onClick={() => handleSubmit(false)} disabled={isPending}
            className="px-5 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
            {isPending && pendingType === 'draft' ? 'Збереження...' : 'Зберегти як чернетку'}
          </button>
          <button type="button" onClick={() => handleSubmit(true)} disabled={isPending}
            className="px-5 py-2.5 text-sm font-medium bg-[#2D5016] text-white rounded-lg hover:bg-[#3a6a1d] transition-colors disabled:opacity-50">
            {isPending && pendingType === 'publish' ? 'Публікація...' : 'Опублікувати'}
          </button>
        </div>
      </div>

    </form>
  )
}
