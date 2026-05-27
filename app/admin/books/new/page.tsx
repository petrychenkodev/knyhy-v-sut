import Link from 'next/link'
import BookForm from '@/components/admin/BookForm'
import { createBook } from '@/app/admin/actions'

export default function NewBookPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin"
          className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Нова книга</h1>
      </div>
      <BookForm action={createBook} />
    </div>
  )
}
