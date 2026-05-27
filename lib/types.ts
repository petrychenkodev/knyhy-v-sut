export type Book = {
  id: string
  title_ua: string
  title_en: string
  author: string
  category: string
  cover_url: string | null
  summary_ua: string
  summary_en: string
  key_insights_ua: string[]
  key_insights_en: string[]
  practical_ua: string[]
  practical_en: string[]
  read_time_min: number
  slug: string
  published: boolean
  created_at: string
}

export type Locale = 'uk' | 'en'
