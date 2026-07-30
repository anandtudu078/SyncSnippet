'use client'

import { motion } from 'framer-motion'

const FREE_LIMIT = 5

export default function FreeTierBar({ used }: { used: number }) {
  const percentage = Math.min((used / FREE_LIMIT) * 100, 100)
  const isFull = used >= FREE_LIMIT

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>{used} / {FREE_LIMIT} snippets used</span>
        {isFull && (
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">
            Upgrade for more
          </span>
        )}
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            isFull
              ? 'bg-gradient-to-r from-amber-400 to-red-500'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {isFull && (
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Free tier limit reached. <a href="#" className="underline text-indigo-600 dark:text-indigo-400">Upgrade to Pro</a> for unlimited snippets.
        </p>
      )}
    </div>
  )
}