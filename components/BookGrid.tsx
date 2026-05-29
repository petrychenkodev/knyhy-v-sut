import { Book } from '@/lib/types'
import BookCard from './BookCard'
import BookCardSkeleton from './BookCardSkeleton'

interface BookGridProps {
  books: Book[]
  loading?: boolean
}

export default function BookGrid({ books, loading }: BookGridProps) {
  if (loading || books.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}
