import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { updateArticle } from '../../actions'
import ArticleForm from '@/components/admin/ArticleForm'
import DeleteArticleButton from '@/components/admin/DeleteArticleButton'

interface PageProps {
  params: { id: string }
}

export default async function EditArticlePage({ params }: PageProps) {
  const supabase = createAdminClient()
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!article) notFound()

  const action = updateArticle.bind(null, params.id)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Редагувати статтю</h1>
        <DeleteArticleButton id={article.id} />
      </div>
      <ArticleForm article={article} action={action} />
    </div>
  )
}
