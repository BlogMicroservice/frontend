'use client'

import dynamic from 'next/dynamic'

// Dynamically import Editor to avoid SSR issues
const Editor = dynamic(() => import('./components/Editor'), { ssr: false })

export default function EditorClientWrapper() {
  return <Editor />
}
