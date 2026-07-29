'use client'

import { useState, useEffect } from 'react'
import { FiFile, FiFolder, FiCopy, FiCheck } from 'react-icons/fi'
import { AnimatePresence, motion } from 'framer-motion'

interface Repo {
  full_name: string
  private: boolean
}

interface FileItem {
  name: string
  path: string
  type: 'file' | 'dir'
  download_url?: string
  content?: string
}

interface SnippetEditData {
  id: string
  repository_full_name: string
  file_path: string
  start_line: number
  end_line: number
  branch: string
}

const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.2 },
  }),
}

export default function NewSnippetModal({
  onClose,
  editSnippet,
}: {
  onClose: () => void
  editSnippet?: SnippetEditData | null
}) {
  const [repos, setRepos] = useState<Repo[]>([])
  const [selectedRepo, setSelectedRepo] = useState(editSnippet?.repository_full_name || '')
  const [files, setFiles] = useState<FileItem[]>([])
  const [currentPath, setCurrentPath] = useState('')
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [fileContent, setFileContent] = useState('')
  const [startLine, setStartLine] = useState(editSnippet?.start_line || 1)
  const [endLine, setEndLine] = useState(editSnippet?.end_line || 10)
  const [savedSnippetId, setSavedSnippetId] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const isEditing = !!editSnippet

  useEffect(() => {
    fetch('/api/repos')
      .then(res => res.json())
      .then(data => setRepos(data))
      .catch(() => setError('Failed to load repos'))
  }, [])

  // Fetch files when repo is selected
  const fetchFiles = async (path = '') => {
    if (!selectedRepo) return
    const [owner, repo] = selectedRepo.split('/')
    setCurrentPath(path)
    try {
      const res = await fetch(`/api/repos/${owner}/${repo}/contents?path=${path}`)
      const data = await res.json()
      setFiles(Array.isArray(data) ? data : [])
    } catch {
      setError('Failed to load files')
    }
  }

  useEffect(() => {
    if (selectedRepo) fetchFiles()
  }, [selectedRepo])

  // If editing, load file content automatically after repo is selected
  useEffect(() => {
    if (isEditing && selectedRepo && editSnippet?.file_path) {
      const loadEditFile = async () => {
        const [owner, repo] = selectedRepo.split('/')
        try {
          const res = await fetch(`/api/repos/${owner}/${repo}/contents?path=${editSnippet.file_path}`)
          const data = await res.json()
          if (data.content) {
            const decoded = atob(data.content.replace(/\n/g, ''))
            setFileContent(decoded)
            setSelectedFile({ name: editSnippet.file_path.split('/').pop()!, path: editSnippet.file_path, type: 'file' })
          } else if (data.html_url) {
            const rawRes = await fetch(data.html_url.replace('/blob/', '/raw/'))
            const text = await rawRes.text()
            setFileContent(text)
            setSelectedFile({ name: editSnippet.file_path.split('/').pop()!, path: editSnippet.file_path, type: 'file' })
          }
        } catch {
          setError('Failed to load file for editing')
        }
      }
      loadEditFile()
    }
  }, [isEditing, selectedRepo, editSnippet])

  const handleFileClick = async (file: FileItem) => {
    if (file.type === 'dir') {
      fetchFiles(file.path)
    } else {
      setSelectedFile(file)
      setLoading(true)
      try {
        const [owner, repo] = selectedRepo.split('/')
        const res = await fetch(`/api/repos/${owner}/${repo}/contents?path=${file.path}`)
        const data = await res.json()
        if (data.content) {
          const decoded = atob(data.content.replace(/\n/g, ''))
          setFileContent(decoded)
        } else if (data.html_url) {
          const rawRes = await fetch(data.html_url.replace('/blob/', '/raw/'))
          const text = await rawRes.text()
          setFileContent(text)
        }
      } catch {
        setError('Failed to fetch file content')
      }
      setLoading(false)
    }
  }

  const goUp = () => {
    const parts = currentPath.split('/')
    parts.pop()
    const parentPath = parts.join('/')
    fetchFiles(parentPath)
  }

  const saveSnippet = async () => {
    if (!selectedFile) return
    setLoading(true)
    const url = isEditing ? `/api/snippets/${editSnippet!.id}` : '/api/snippets'
    const method = isEditing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        repository_full_name: selectedRepo,
        file_path: selectedFile.path,
        start_line: startLine,
        end_line: endLine,
        branch: 'main',
      }),
    })
    const data = await res.json()

    if (data.id || data.success) {
      if (data.id) setSavedSnippetId(data.id)
      setSaveSuccess(true)
      setTimeout(() => {
        onClose()
      }, 1000)
    } else {
      setError(data.error || 'Failed to save snippet')
    }
    setLoading(false)
  }

  const embedCode = savedSnippetId && !isEditing ? `[syncsnippet:${savedSnippetId}]` : ''

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <motion.div
          className="relative w-full max-w-5xl mx-4 rounded-xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Snippet' : 'New Snippet'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Repository</label>
              <select
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                disabled={isEditing}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm"
              >
                <option value="">Select a repository</option>
                {repos.map(repo => (
                  <option key={repo.full_name} value={repo.full_name}>{repo.full_name}</option>
                ))}
              </select>
            </div>

            {selectedRepo && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="border rounded-lg p-2 max-h-80 overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {currentPath ? `/${currentPath}` : 'Root'}
                    </span>
                    {currentPath && (
                      <button onClick={goUp} className="text-xs text-indigo-600 hover:underline">
                        ← Up
                      </button>
                    )}
                  </div>
                  {files.map((file, i) => (
                    <motion.div
                      key={file.path}
                      custom={i}
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      onClick={() => handleFileClick(file)}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedFile?.path === file.path ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''
                      }`}
                    >
                      {file.type === 'dir' ? <FiFolder className="text-yellow-500 flex-shrink-0" /> : <FiFile className="text-blue-500 flex-shrink-0" />}
                      <span className="text-sm truncate">{file.name}</span>
                    </motion.div>
                  ))}
                </div>

                {fileContent && (
                  <div className="border rounded-lg p-2 max-h-80 overflow-y-auto">
                    <pre className="text-xs font-mono whitespace-pre-wrap">{fileContent}</pre>
                  </div>
                )}
              </div>
            )}

            {savedSnippetId && !isEditing && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Embed code:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded bg-gray-200 dark:bg-gray-700 p-2 text-sm break-all">{embedCode}</code>
                  <button
                    onClick={() => { navigator.clipboard.writeText(embedCode); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                    className="rounded bg-indigo-600 p-2 text-white hover:bg-indigo-500 transition-colors"
                  >
                    {copied ? <FiCheck /> : <FiCopy />}
                  </button>
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          {selectedFile && fileContent && (
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-white dark:bg-gray-800 sticky bottom-0 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 dark:text-gray-400">Lines:</label>
                <input type="number" value={startLine} onChange={(e) => setStartLine(Number(e.target.value))} className="w-20 border rounded p-1 text-sm dark:bg-gray-700 dark:border-gray-600" min={1} />
                <span className="text-xs text-gray-400">–</span>
                <input type="number" value={endLine} onChange={(e) => setEndLine(Number(e.target.value))} className="w-20 border rounded p-1 text-sm dark:bg-gray-700 dark:border-gray-600" min={1} />
              </div>
              <button
                onClick={saveSnippet}
                disabled={loading || saveSuccess}
                className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-all flex items-center gap-2 ${
                  saveSuccess ? 'bg-green-500' : 'bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50'
                }`}
              >
                {loading ? 'Saving…' : saveSuccess ? <><FiCheck className="h-4 w-4" /> {isEditing ? 'Updated!' : 'Saved!'}</> : isEditing ? 'Update Snippet' : 'Save Snippet'}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}