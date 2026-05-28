import { createArticle } from '../actions'
import ArticleForm from '@/components/admin/ArticleForm'

export default function NewArticlePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Нова стаття</h1>
      <ArticleForm action={createArticle} />
    </div>
  )
}
