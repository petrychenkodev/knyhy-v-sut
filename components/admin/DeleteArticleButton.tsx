'use client'

import { deleteArticle } from '@/app/admin/articles/actions'

export default function DeleteArticleButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm('Видалити цю статтю?')) return
    await deleteArticle(id)
  }

  return (
    <button onClick={handleDelete}
      className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
      Видалити
    </button>
  )
}
