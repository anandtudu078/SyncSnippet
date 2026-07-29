'use client'

import { useState, useEffect } from 'react'
import { FiFile, FiFolder, FiCopy, FiCheck } from 'react-icons/fi'

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

export default function NewSnippetModal({ onClose }: { onClose: () => void }) {
  const [repos, setRepos] = useState<Repo[]>([])
  const [selectedRepo, setSelectedRepo] = useState('')
  const [files, setFiles] = useState<FileItem[]>([])
  const [currentPath, setCurrentPath] = useState('')
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [fileContent, setFileContent] = useState('')
  const [startLine, setStartLine] = useState(1)
  const [endLine, setEndLine] = useState(10)
  const [savedSnippetId, setSavedSnippetId] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch repos on mount
  useEffect(() => {
    fetch('/api/repos')
      .then(res => res.json())
      .then(data => setRepos(data))
      .catch(() => setError('Failed to load repos'))
  }, [])

  // Fetch files when a repo is selected
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

  // Handle clicking a file or folder
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

  // Go up one folder
  const goUp = () => {
    const parts = currentPath.split('/')
    parts.pop()
    const parentPath = parts.join('/')
    fetchFiles(parentPath)
  }

  // Save snippet
  const saveSnippet = async () => {
    if (!selectedFile) return
    setLoading(true)
    const res = await fetch('/api/snippets', {
      method: 'POST',
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
    if (data.id) {
      setSavedSnippetId(data.id)
    } else {
      setError('Failed to save snippet')
    }
    setLoading(false)
  }

  const embedCode = savedSnippetId ? `[syncsnippet:${savedSnippetId}]` : ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-5xl mx-4 rounded-xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">New Snippet</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
          </div>

          {/* Repo selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Repository</label>
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm"
            >
              <option value="">Select a repository</option>
              {repos.map(repo => (
                <option key={repo.full_name} value={repo.full_name}>{repo.full_name}</option>
              ))}
            </select>
          </div>

          {/* File browser & content preview */}
          {selectedRepo && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* File list */}
              <div className="border rounded-lg p-2 max-h-80 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {currentPath ? `/${currentPath}` : 'Root'}
                  </span>
                  {currentPath && (
                    <button
                      onClick={goUp}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      ← Up
                    </button>
                  )}
                </div>
                {files.map(file => (
                  <div
                    key={file.path}
                    onClick={() => handleFileClick(file)}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedFile?.path === file.path ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''
                    }`}
                  >
                    {file.type === 'dir' ? (
                      <FiFolder className="text-yellow-500" />
                    ) : (
                      <FiFile className="text-blue-500" />
                    )}
                    <span className="text-sm truncate">{file.name}</span>
                  </div>
                ))}
              </div>

              {/* Content preview & line selection */}
              {fileContent && (
                <div className="border rounded-lg p-2 max-h-80 overflow-y-auto">
                  <pre className="text-xs font-mono whitespace-pre-wrap">{fileContent}</pre>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <label className="text-xs">Lines:</label>
                    <input
                      type="number"
                      value={startLine}
                      onChange={(e) => setStartLine(Number(e.target.value))}
                      className="w-20 border rounded p-1 text-sm"
                      min={1}
                    />
                    <span className="text-xs">–</span>
                    <input
                      type="number"
                      value={endLine}
                      onChange={(e) => setEndLine(Number(e.target.value))}
                      className="w-20 border rounded p-1 text-sm"
                      min={1}
                    />
                    <button
                      onClick={saveSnippet}
                      disabled={loading || !selectedFile}
                      className="ml-auto rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
                    >
                      {loading ? 'Saving…' : 'Save Snippet'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Embed code result */}
          {savedSnippetId && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Embed code:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-gray-200 dark:bg-gray-700 p-2 text-sm break-all">{embedCode}</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(embedCode)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                  className="rounded bg-indigo-600 p-2 text-white hover:bg-indigo-500"
                >
                  {copied ? <FiCheck /> : <FiCopy />}
                </button>
              </div>
            </div>
          )}

          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  )
}