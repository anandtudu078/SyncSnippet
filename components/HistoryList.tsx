'use client'

import { FiCode } from 'react-icons/fi'
import { motion } from 'framer-motion'
import DeleteSnippetButton from './DeleteSnippetButton'
import TimeAgo from './TimeAgo'

interface Snippet {
  id: string
  file_path: string
  repository_full_name: string
  start_line: number
  end_line: number
  status: string
  created_at: string | null
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
}

export default function HistoryList({ snippets }: { snippets: Snippet[] }) {
  if (!snippets || snippets.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
        No snippets yet. Create one to see it here.
      </div>
    )
  }

  return (
    <motion.ul
      className="divide-y divide-gray-100 dark:divide-gray-700"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {snippets.map((snippet) => (
        <motion.li
          key={snippet.id}
          variants={item}
          className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <FiCode className="h-4 w-4 text-gray-400" />
                <span className="font-mono text-sm text-gray-900 dark:text-white truncate">
                  {snippet.file_path}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span>{snippet.repository_full_name}</span>
                <span>Lines {snippet.start_line}–{snippet.end_line}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <TimeAgo date={snippet.created_at} />
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  snippet.status === 'active'
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {snippet.status === 'active' ? 'Live' : 'Error'}
              </span>
              <DeleteSnippetButton snippetId={snippet.id} />
            </div>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  )
}