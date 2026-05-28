import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminArticlesPage() {
  const supabase = createAdminClient()
  let articles: { id: string; title_ua: string; title_en: string; slug: string; published: boolean; read_time_min: number; created_at: string }[] = []
  let fetchError: string | null = null

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title_ua, title_en, slug, published, read_time_min, created_at')
      .order('created_at', { ascending: false })
    if (error) throw error
    articles = data || []
  } catch (e) {
    console.error('Articles fetch error:', e)
    fetchError = e instanceof Error ? e.message : 'Unknown error'
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Статті</h1>
          <p className="text-sm text-gray-500 mt-1">{articles?.length ?? 0} статей</p>
        </div>
        <Link href="/admin/articles/new"
          className="px-4 py-2 bg-[#2D5016] text-white text-sm font-medium rounded-lg hover:bg-[#3a6a1d] transition-colors">
          + Додати статтю
        </Link>
      </div>

      {fetchError ? (
        <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-200">
          <p className="text-red-600 font-medium">Помилка завантаження статей</p>
          <p className="text-red-400 text-sm mt-2 font-mono">{fetchError}</p>
          <p className="text-gray-500 text-sm mt-4">
            Переконайтеся що таблиця <code className="bg-gray-100 px-1 rounded">articles</code> створена в Supabase
          </p>
        </div>
      ) : !articles || articles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-400">Статей ще немає</p>
          <Link href="/admin/articles/new" className="mt-4 inline-block text-sm text-[#2D5016] hover:underline">
            Створити першу статтю →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Назва</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Slug</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Статус</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Дата</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 line-clamp-1">{article.title_ua}</div>
                    <div className="text-gray-400 text-xs line-clamp-1">{article.title_en}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs hidden md:table-cell">{article.slug}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${article.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {article.published ? 'Опубліковано' : 'Чернетка'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                    {new Date(article.created_at).toLocaleDateString('uk-UA')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/articles/${article.id}/edit`}
                      className="text-xs text-[#2D5016] hover:underline font-medium">
                      Редагувати
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600">← Назад до адміну</Link>
      </div>
    </div>
  )
}
