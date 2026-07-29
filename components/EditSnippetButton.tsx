'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { FiEdit2 } from 'react-icons/fi'
import NewSnippetModal from './NewSnippetModal'

interface SnippetEditData {
  id: string
  repository_full_name: string
  file_path: string
  start_line: number
  end_line: number
  branch: string
}

export default function EditSnippetButton({ snippet }: { snippet: SnippetEditData }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-gray-400 hover:text-indigo-500 transition-colors"
        title="Edit snippet"
      >
        <FiEdit2 className="h-4 w-4" />
      </button>
      {open &&
        createPortal(
          <NewSnippetModal onClose={() => setOpen(false)} editSnippet={snippet} />,
          document.body
        )}
    </>
  )
}