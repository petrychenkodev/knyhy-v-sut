export function formatReadTime(minutes: number): string {
  return `${minutes} min read`
}

export function getLocalizedTitle(book: { title_ua: string; title_en: string }, locale: string): string {
  return locale === 'uk' ? book.title_ua : book.title_en
}

export function getLocalizedSummary(book: { summary_ua: string; summary_en: string }, locale: string): string {
  return locale === 'uk' ? book.summary_ua : book.summary_en
}
