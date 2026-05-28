'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { ImagePlus, X, RefreshCw, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  value: string | null
  onChange: (url: string | null) => void
  bucket: string
  folder?: string
}

export default function ImageUpload({
  value,
  onChange,
  bucket,
  folder = 'uploads',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(async (file: File) => {
    setError(null)

    if (file.size > 5 * 1024 * 1024) {
      setError('Файл занадто великий. Максимум 5MB')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Підтримуються тільки JPG, PNG, WebP')
      return
    }

    setUploading(true)
    const ext = file.name.split('.').pop()
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const supabase = createClient()
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filename, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      setError('Помилка завантаження. Спробуйте ще раз.')
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename)

    onChange(publicUrl)
    setUploading(false)
  }, [bucket, folder, onChange])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => setDragOver(false)

  const handleRemove = () => {
    onChange(null)
    setError(null)
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {value ? (
        /* Preview */
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={value}
            alt="Cover preview"
            fill
            className="object-cover"
            sizes="600px"
          />

          {/* Uploading overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}

          {/* Action buttons */}
          {!uploading && (
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-lg hover:bg-white shadow-sm transition-colors"
              >
                <RefreshCw size={12} />
                Змінити
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1 px-2 py-1.5 bg-red-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-lg hover:bg-red-600 shadow-sm transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Upload zone */
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            aspect-video rounded-xl border-2 border-dashed flex flex-col items-center
            justify-center gap-3 cursor-pointer transition-all
            ${dragOver
              ? 'border-[#2D5016] bg-[#f0f4ed]'
              : 'border-gray-200 hover:border-[#2D5016] hover:bg-[#f0f4ed]'}
            ${uploading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-[#2D5016] animate-spin" />
          ) : (
            <>
              <ImagePlus size={32} className="text-gray-300" strokeWidth={1.5} />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Завантажити обкладинку</p>
                <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP · Макс. 5MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
          <X size={12} />
          {error}
        </p>
      )}
    </div>
  )
}
