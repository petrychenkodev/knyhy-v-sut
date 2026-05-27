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

export async function createBook(formData: FormData) {
  const supabase = createAdminClient()

  const titleUa = (formData.get('title_ua') as string)?.trim()
  const titleEn = (formData.get('title_en') as string)?.trim()
  const author   = (formData.get('author')   as string)?.trim()
  const category = (formData.get('category') as string)?.trim()
  const slugInput = (formData.get('slug')    as string)?.trim()

  if (!titleUa) throw new Error('title_ua is required')
  if (!titleEn) throw new Error('title_en is required')
  if (!author)  throw new Error('author is required')
  if (!category) throw new Error('Category is required — please select one')

  const insightsUa = (formData.getAll('key_insights_ua') as string[]).filter((s) => s.trim())
  const insightsEn = (formData.getAll('key_insights_en') as string[]).filter((s) => s.trim())
  const practicalUa = (formData.getAll('practical_ua') as string[]).filter((s) => s.trim())
  const practicalEn = (formData.getAll('practical_en') as string[]).filter((s) => s.trim())
  const published = formData.get('published') === 'true'

  const { error } = await supabase.from('books').insert({
    title_ua: titleUa,
    title_en: titleEn,
    author,
    category,
    cover_url: (formData.get('cover_url') as string) || null,
    slug: slugInput || slugify(titleEn),
    read_time_min: parseInt(formData.get('read_time_min') as string) || 10,
    summary_ua: formData.get('summary_ua') as string,
    summary_en: formData.get('summary_en') as string,
    key_insights_ua: insightsUa,
    key_insights_en: insightsEn,
    practical_ua: practicalUa,
    practical_en: practicalEn,
    published,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function updateBook(id: string, formData: FormData) {
  const supabase = createAdminClient()

  const titleUa = (formData.get('title_ua') as string)?.trim()
  const titleEn = (formData.get('title_en') as string)?.trim()
  const author   = (formData.get('author')   as string)?.trim()
  const category = (formData.get('category') as string)?.trim()
  const slugInput = (formData.get('slug')    as string)?.trim()

  if (!titleUa) throw new Error('title_ua is required')
  if (!titleEn) throw new Error('title_en is required')
  if (!author)  throw new Error('author is required')
  if (!category) throw new Error('Category is required — please select one')

  const insightsUa = (formData.getAll('key_insights_ua') as string[]).filter((s) => s.trim())
  const insightsEn = (formData.getAll('key_insights_en') as string[]).filter((s) => s.trim())
  const practicalUa = (formData.getAll('practical_ua') as string[]).filter((s) => s.trim())
  const practicalEn = (formData.getAll('practical_en') as string[]).filter((s) => s.trim())
  const published = formData.get('published') === 'true'

  const { error } = await supabase
    .from('books')
    .update({
      title_ua: titleUa,
      title_en: titleEn,
      author,
      category,
      cover_url: (formData.get('cover_url') as string) || null,
      slug: slugInput || slugify(titleEn),
      read_time_min: parseInt(formData.get('read_time_min') as string) || 10,
      summary_ua: formData.get('summary_ua') as string,
      summary_en: formData.get('summary_en') as string,
      key_insights_ua: insightsUa,
      key_insights_en: insightsEn,
      practical_ua: practicalUa,
      practical_en: practicalEn,
      published,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function deleteBook(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('books').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/', 'layout')
  redirect('/admin')
}
