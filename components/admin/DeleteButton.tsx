'use client'

import { useTransition } from 'react'
import { deleteBook } from '@/app/admin/actions'

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('Видалити цю книгу? Цю дію не можна скасувати.')) return
    startTransition(() => deleteBook(id))
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-colors disabled:opacity-50"
    >
      {isPending ? 'Видалення...' : 'Видалити'}
    </button>
  )
}
