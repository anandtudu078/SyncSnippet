'use client'

import { useState, useRef, useEffect } from 'react'
import { FiUser, FiSettings, FiCreditCard, FiZap, FiLogOut, FiChevronRight } from 'react-icons/fi'
import { signOut } from '@/app/auth/actions'
import Link from 'next/link'

interface UserMenuProps {
  email?: string
  userName?: string
}

export default function UserMenu({ email, userName }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

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

  const menuItems = [
    { icon: FiUser, label: 'Profile', href: '/dashboard/profile' },
    { icon: FiSettings, label: 'Settings', href: '/dashboard/settings' },
    { icon: FiZap, label: 'Upgrade to Pro', href: '/upgrade', highlight: true },
    { icon: FiCreditCard, label: 'Billing', href: '/dashboard/billing' },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
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

          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition ${
                    item.highlight
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  <FiChevronRight className="h-3 w-3 opacity-50" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <form action={signOut}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <FiLogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}