import Link from 'next/link'
import Image from 'next/image'
import { createAdminClient } from '@/lib/supabase/admin'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = createAdminClient()
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <p className="text-red-600">Помилка завантаження: {error.message}</p>
  }

  return (
    <div>
      {/* Navigation links */}
      <div className="flex gap-4 mb-8">
        <Link href="/admin" className="px-4 py-2 bg-[#2D5016] text-white text-sm font-medium rounded-lg">
          Книги
        </Link>
        <Link href="/admin/articles" className="px-4 py-2 border border-[#2D5016] text-[#2D5016] text-sm font-medium rounded-lg hover:bg-[#2D5016]/5 transition-colors">
          Статті
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Книги</h1>
          <p className="text-sm text-gray-500 mt-1">{books?.length ?? 0} книг у базі</p>
        </div>
        <Link
          href="/admin/books/new"
          className="px-4 py-2 bg-[#2D5016] text-white text-sm font-medium rounded-lg hover:bg-[#3a6a1d] transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Додати книгу
        </Link>
      </div>

      {/* Empty state */}
      {!books || books.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-gray-500 text-lg mb-4">Книг ще немає. Додайте першу!</p>
          <Link
            href="/admin/books/new"
            className="px-5 py-2.5 bg-[#2D5016] text-white text-sm font-medium rounded-lg hover:bg-[#3a6a1d] transition-colors"
          >
            Додати книгу
          </Link>
        </div>
      ) : (
        /* Table */
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-16">Обкл.</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Назва UA / EN</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Автор</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Категорія</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Статус</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Час</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Дії</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                    {/* Cover */}
                    <td className="px-4 py-3">
                      <div className="w-10 h-14 rounded overflow-hidden bg-gray-100 shrink-0">
                        {book.cover_url ? (
                          <Image
                            src={book.cover_url}
                            alt={book.title_ua}
                            width={40}
                            height={56}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    {/* Title */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 line-clamp-1 max-w-xs">{book.title_ua}</div>
                      <div className="text-gray-400 text-xs mt-0.5 line-clamp-1">{book.title_en}</div>
                      <div className="text-gray-300 text-xs mt-0.5 font-mono">{book.slug}</div>
                    </td>
                    {/* Author */}
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{book.author}</td>
                    {/* Category */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{book.category}</span>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      {book.published ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Опубл.
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Чернетка
                        </span>
                      )}
                    </td>
                    {/* Read time */}
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{book.read_time_min} хв</td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/books/${book.id}/edit`}
                          className="text-sm px-3 py-1.5 rounded-lg text-[#2D5016] hover:bg-[#2D5016]/10 border border-[#2D5016]/30 transition-colors"
                        >
                          Редагувати
                        </Link>
                        <DeleteButton id={book.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
