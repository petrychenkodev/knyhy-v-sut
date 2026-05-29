'use client'

import { useState, useRef } from 'react'
import { Article } from '@/lib/types'
import RichTextEditor from './RichTextEditor'
import ImageUpload from './ImageUpload'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

interface ArticleFormProps {
  article?: Partial<Article>
  action: (formData: FormData) => Promise<void>
}

const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2D5016]/40 focus:border-[#2D5016] transition-colors placeholder:text-gray-400 bg-white'
const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5'
const sectionCls = 'bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5'
const sectionTitleCls = 'text-base font-semibold text-gray-900 pb-1 border-b border-gray-100'

export default function ArticleForm({ article, action }: ArticleFormProps) {
  const [contentUa, setContentUa] = useState(article?.content_ua ?? '')
  const [coverUrl, setCoverUrl] = useState<string | null>(article?.cover_url ?? null)
  const [published, setPublished] = useState(article?.published ?? false)
  const [slugValue, setSlugValue] = useState(article?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!article?.slug)
  const [isPending, setIsPending] = useState(false)
  const [pendingType, setPendingType] = useState<'draft' | 'publish' | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function handleTitleUaChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!slugTouched) setSlugValue(slugify(e.target.value))
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

      {/* Section 1: Basic info */}
      <div className={sectionCls}>
        <h2 className={sectionTitleCls}>Основна інформація</h2>
        <div>
          <label className={labelCls}>Назва *</label>
          <input name="title_ua" type="text" required defaultValue={article?.title_ua}
            className={inputCls} placeholder="Назва статті"
            onChange={handleTitleUaChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className={labelCls}>Обкладинка</label>
            <input type="hidden" name="cover_url" value={coverUrl || ''} />
            <ImageUpload
              value={coverUrl}
              onChange={setCoverUrl}
              bucket="article-covers"
              folder="articles"
            />
          </div>
          <div>
            <label className={labelCls}>Час читання (хв)</label>
            <input name="read_time_min" type="number" min={1} max={60}
              defaultValue={article?.read_time_min ?? 5} className={inputCls} />
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
            URL: /articles/<span className="text-gray-600">{slugValue || '...'}</span>
          </p>
        </div>
      </div>

      {/* Section 2: Excerpt */}
      <div className={sectionCls}>
        <h2 className={sectionTitleCls}>Анонс</h2>
        <div>
          <label className={labelCls}>Анонс *</label>
          <textarea name="excerpt_ua" rows={3} required
            defaultValue={article?.excerpt_ua}
            className={`${inputCls} resize-none`}
            placeholder="Короткий опис статті (2-3 речення)..." />
        </div>
      </div>

      {/* Section 3: Content */}
      <div className={sectionCls}>
        <h2 className={sectionTitleCls}>Контент</h2>
        <input type="hidden" name="content_ua" value={contentUa} />
        <div>
          <label className={labelCls}>Контент *</label>
          <RichTextEditor value={contentUa} onChange={setContentUa} placeholder="Текст статті..." />
        </div>
      </div>

      {/* Section 4: Publish */}
      <div className={sectionCls}>
        <h2 className={sectionTitleCls}>Публікація</h2>
        <div className="flex items-center gap-3">
          <button type="button" role="switch" aria-checked={published}
            onClick={() => setPublished(!published)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2D5016]/40 ${published ? 'bg-[#2D5016]' : 'bg-gray-200'}`}>
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
