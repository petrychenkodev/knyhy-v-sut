'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function createArticle(formData: FormData) {
  const supabase = createAdminClient()

  const titleUa = (formData.get('title_ua') as string)?.trim()
  const titleEn = (formData.get('title_en') as string)?.trim()
  const slugInput = (formData.get('slug') as string)?.trim()

  if (!titleUa) throw new Error('title_ua is required')
  if (!titleEn) throw new Error('title_en is required')

  const article = {
    title_ua: titleUa,
    title_en: titleEn,
    slug: slugInput || slugify(titleEn),
    excerpt_ua: (formData.get('excerpt_ua') as string) || '',
    excerpt_en: (formData.get('excerpt_en') as string) || '',
    content_ua: (formData.get('content_ua') as string) || '',
    content_en: (formData.get('content_en') as string) || '',
    cover_url: (formData.get('cover_url') as string) || null,
    read_time_min: parseInt(formData.get('read_time_min') as string) || 5,
    published: formData.get('published') === 'true',
  }

  console.log('[createArticle] Inserting:', {
    ...article,
    content_ua: article.content_ua.slice(0, 60),
    content_en: article.content_en.slice(0, 60),
  })

  const { data, error } = await supabase
    .from('articles')
    .insert([article])
    .select()
    .single()

  if (error) {
    console.error('[createArticle] Supabase error:', error)
    throw new Error(`DB Error: ${error.message} (code: ${error.code})`)
  }

  console.log('[createArticle] Created:', data.id)

  revalidatePath('/', 'layout')
  redirect('/admin/articles')
}

export async function updateArticle(id: string, formData: FormData) {
  const supabase = createAdminClient()

  const titleUa = (formData.get('title_ua') as string)?.trim()
  const titleEn = (formData.get('title_en') as string)?.trim()
  const slugInput = (formData.get('slug') as string)?.trim()

  if (!titleUa) throw new Error('title_ua is required')
  if (!titleEn) throw new Error('title_en is required')

  const update = {
    title_ua: titleUa,
    title_en: titleEn,
    slug: slugInput || slugify(titleEn),
    excerpt_ua: (formData.get('excerpt_ua') as string) || '',
    excerpt_en: (formData.get('excerpt_en') as string) || '',
    content_ua: (formData.get('content_ua') as string) || '',
    content_en: (formData.get('content_en') as string) || '',
    cover_url: (formData.get('cover_url') as string) || null,
    read_time_min: parseInt(formData.get('read_time_min') as string) || 5,
    published: formData.get('published') === 'true',
  }

  console.log('[updateArticle] Updating:', id)

  const { error } = await supabase
    .from('articles')
    .update(update)
    .eq('id', id)

  if (error) {
    console.error('[updateArticle] Supabase error:', error)
    throw new Error(`DB Error: ${error.message} (code: ${error.code})`)
  }

  revalidatePath('/', 'layout')
  redirect('/admin/articles')
}

export async function deleteArticle(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) {
    console.error('[deleteArticle] Supabase error:', error)
    throw new Error(error.message)
  }
  revalidatePath('/', 'layout')
  redirect('/admin/articles')
}
