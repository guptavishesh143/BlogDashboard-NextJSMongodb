'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="border rounded px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-700"
    >
      Logout
    </button>
  )
}