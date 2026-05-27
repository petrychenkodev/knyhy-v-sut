import { Locale } from './types'

export const catalogSubtitle: Record<Locale, (n: number) => string> = {
  uk: (n: number) => `${n} книг · поповнюється щодня`,
  en: (n: number) => `${n} books · updated daily`,
}

export const foundBooks: Record<Locale, (n: number) => string> = {
  uk: (n: number) => `Знайдено ${n} книг`,
  en: (n: number) => `${n} books found`,
}

export const categoryLabels: Record<string, Record<Locale, string>> = {
  psychology: { uk: 'Психологія', en: 'Psychology' },
  business:   { uk: 'Бізнес',     en: 'Business' },
  science:    { uk: 'Наука',       en: 'Science' },
  philosophy: { uk: 'Філософія',  en: 'Philosophy' },
  health:     { uk: "Здоров'я",   en: 'Health' },
  finance:    { uk: 'Фінанси',    en: 'Finance' },
}

export const t = {
  uk: {
    heroTitle:      'Книги в суть',
    heroSubtitle:   'Головні ідеї кращих книг — за 15 хвилин',
    heroEn:         'Books to the Core',
    readFree:       'Читати безкоштовно',
    recentlyAdded:  'Останні додані',
    signIn:         'Увійти',
    minutesRead:    'хв читання',
    minutesShort:   'хв',
    categories: {
      psychology: 'Психологія',
      business:   'Бізнес',
      science:    'Наука',
      philosophy: 'Філософія',
      health:     "Здоров'я",
      finance:    'Фінанси',
    },
    navCategories: [
      { label: 'Психологія', slug: 'psychology' },
      { label: 'Бізнес',     slug: 'business' },
      { label: 'Наука',      slug: 'science' },
      { label: 'Філософія',  slug: 'philosophy' },
    ],
    // Catalog page
    catalogTitle:       'Каталог',
    searchPlaceholder:  'Пошук книги або автора...',
    allCategory:        'Всі',
    noResults:          'Книг не знайдено. Спробуйте інший запит.',
    resetFilters:       'Скинути фільтри',
    catalogMeta:        'Каталог книг — Книги в суть',
    catalogDesc:        'Всі самарі книг з психології, бізнесу, філософії та науки. Читайте безкоштовно за 15 хвилин.',
    // Book detail page
    keyInsights:      'Ключові інсайти',
    practicalTitle:   'Що застосувати в житті',
    allBooks:         'Всі книги',
    nextBook:         'Наступна книга',
  },
  en: {
    heroTitle:      'Books to the Core',
    heroSubtitle:   'Key ideas from the best books — in 15 minutes',
    heroEn:         'Книги в суть',
    readFree:       'Start Reading Free',
    recentlyAdded:  'Recently Added',
    signIn:         'Sign In',
    minutesRead:    'min read',
    minutesShort:   'min',
    categories: {
      psychology: 'Psychology',
      business:   'Business',
      science:    'Science',
      philosophy: 'Philosophy',
      health:     'Health',
      finance:    'Finance',
    },
    navCategories: [
      { label: 'Psychology', slug: 'psychology' },
      { label: 'Business',   slug: 'business' },
      { label: 'Science',    slug: 'science' },
      { label: 'Philosophy', slug: 'philosophy' },
    ],
    // Catalog page
    catalogTitle:       'Catalog',
    searchPlaceholder:  'Search by title or author...',
    allCategory:        'All',
    noResults:          'No books found. Try a different search.',
    resetFilters:       'Reset filters',
    catalogMeta:        'Book Catalog — Books to the Core',
    catalogDesc:        'Summaries from psychology, business, philosophy and science. Read free in 15 minutes.',
    // Book detail page
    keyInsights:      'Key Insights',
    practicalTitle:   'What to Apply in Life',
    allBooks:         'All Books',
    nextBook:         'Next Book',
  },
} as const

export type Translations = typeof t['uk']
