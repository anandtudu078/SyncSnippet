'use client'

import { useEffect, useState } from 'react'

export default function TimeAgo({ date }: { date: string | null }) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (!date) {
      setText('Never')
      return
    }
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (seconds < 60) setText('just now')
    else if (seconds < 3600) setText(`${Math.floor(seconds / 60)}m ago`)
    else if (seconds < 86400) setText(`${Math.floor(seconds / 3600)}h ago`)
    else setText(`${Math.floor(seconds / 86400)}d ago`)
  }, [date])

  return <span>{text}</span>
}