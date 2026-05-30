'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import MigrationModal from '@/components/MigrationModal'
import type { User } from '@supabase/supabase-js'

export default function ProfileAuthSection() {
  const [user, setUser] = useState<User | null>(null)
  const [showMigration, setShowMigration] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u && !localStorage.getItem('migration_done') && !localStorage.getItem('migration_skipped')) {
        setShowMigration(true)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u && !localStorage.getItem('migration_done') && !localStorage.getItem('migration_skipped')) {
        setShowMigration(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!mounted) return null

  return (
    <>
      {user && showMigration && (
        <MigrationModal userId={user.id} onClose={() => setShowMigration(false)} />
      )}
      {user && (
        <div className="flex flex-col items-center text-center mb-2">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              className="w-20 h-20 rounded-full object-cover mb-4 shadow-md"
            />
          ) : null}
          {(user.user_metadata?.full_name || user.email) && (
            <p className="text-sm text-gray-500 mt-1">
              {user.user_metadata?.full_name || user.email}
            </p>
          )}
        </div>
      )}
    </>
  )
}
