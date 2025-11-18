'use client'

import { useSession, signOut } from 'next-auth/react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">📰 Blog Dashboard</h1>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {session && (
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="border rounded px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  )
}