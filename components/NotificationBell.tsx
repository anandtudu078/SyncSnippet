'use client'

import { useState, useEffect } from 'react'
import { FiBell, FiCheck } from 'react-icons/fi'
import TimeAgo from './TimeAgo'

interface Notification {
  id: string
  file: string
  commit: string
  time: string
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  const fetchNotifications = async () => {
    setLoading(true)
    const res = await fetch('/api/notifications')
    const data = await res.json()
    if (Array.isArray(data)) setNotifications(data)
    setLoading(false)
  }

  const toggle = () => {
    setOpen(!open)
    if (!open) fetchNotifications()
  }

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        <FiBell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-gray-800" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50 p-2">
          <div className="text-sm font-medium px-3 py-2 border-b border-gray-100 dark:border-gray-700">
            Recent Syncs
          </div>
          {loading ? (
            <div className="p-3 text-sm text-gray-400">Loading…</div>
          ) : notifications.length === 0 ? (
            <div className="p-3 text-sm text-gray-400">No syncs yet.</div>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li key={n.id} className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                  <div className="flex items-center gap-2 text-sm">
                    <FiCheck className="text-green-500 h-4 w-4" />
                    <span className="text-gray-700 dark:text-gray-300">{n.file}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    <TimeAgo date={n.time} /> · {n.commit}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}