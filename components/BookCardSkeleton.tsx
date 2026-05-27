export default function BookCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 animate-pulse">
      <div className="aspect-[2/3] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-20 bg-gray-200 rounded-full" />
          <div className="h-5 w-12 bg-gray-200 rounded-full" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  )
}
