'use client'

import { useState, useRef, useEffect } from 'react'
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi'
import { signOut } from '@/app/auth/actions'

interface UserMenuProps {
  email?: string
  userName?: string
}

export default function UserMenu({ email, userName }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initial = email ? email.charAt(0).toUpperCase() : 'U'

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold">
          {initial}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg p-2 z-50">
          <div className="px-3 py-2 mb-2 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {email || 'Signed in'}
            </p>
            {userName && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                @{userName}
              </p>
            )}
          </div>

          <ul>
            <li>
              <button
                onClick={() => {
                  setOpen(false)
                  // Placeholder: navigate to settings (future)
                  console.log('Settings')
                }}
                className="flex w-full items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <FiSettings className="h-4 w-4" />
                Settings
              </button>
            </li>
            <li>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <FiLogOut className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}