'use client'

import { useState } from 'react'
import NewSnippetModal from './NewSnippetModal'

export default function NewSnippetButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
      >
        + New Snippet
      </button>
      {open && <NewSnippetModal onClose={() => setOpen(false)} />}
    </>
  )
}