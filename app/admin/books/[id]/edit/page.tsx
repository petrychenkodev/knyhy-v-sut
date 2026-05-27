import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import BookForm from '@/components/admin/BookForm'
import DeleteButton from '@/components/admin/DeleteButton'
import { updateBook } from '@/app/admin/actions'
import { Book } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function EditBookPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient()
  const { data: book, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !book) notFound()

  const updateWithId = updateBook.bind(null, params.id)

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin"
          className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Редагування</h1>
          <p className="text-sm text-gray-500 mt-0.5">{book.title_ua}</p>
        </div>
      </div>

      <BookForm book={book as Book} action={updateWithId} />

      {/* Delete — separate section below form */}
      <div className="mt-6 bg-white rounded-2xl border border-red-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-red-700 mb-1">Небезпечна зона</h3>
        <p className="text-sm text-gray-500 mb-4">
          Видалення книги є незворотнім. Усі дані буде втрачено.
        </p>
        <DeleteButton id={book.id} />
      </div>
    </div>
  )
}
