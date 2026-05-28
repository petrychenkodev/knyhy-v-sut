'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  /** compact=true shows only B/I/U, smaller min-height for inline use */
  compact?: boolean
}

type ToolbarButtonProps = {
  onClick: () => void
  isActive?: boolean
  title: string
  children: React.ReactNode
  compact?: boolean
}

function ToolbarButton({ onClick, isActive, title, children, compact }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      title={title}
      className={`px-1.5 rounded transition-colors font-medium flex items-center justify-center
        ${compact ? 'text-xs h-6 min-w-[22px]' : 'text-sm h-7 min-w-[28px]'}
        ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="w-px h-4 bg-gray-200 mx-0.5 self-center" />
}

export default function RichTextEditor({ value, onChange, placeholder, compact = false }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: compact ? false : { levels: [2, 3] },
        blockquote: compact ? false : {},
        bulletList: compact ? false : {},
        orderedList: compact ? false : {},
        // Exclude underline from StarterKit — we register it explicitly below
        underline: false,
      }),
      Underline,
      Placeholder.configure({
        placeholder: placeholder ?? 'Введіть текст...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: compact
          ? 'prose prose-sm max-w-none p-2.5 focus:outline-none text-gray-900 min-h-[60px] [&_p]:my-0.5'
          : 'prose prose-sm max-w-none min-h-[300px] p-4 focus:outline-none text-gray-900 ' +
            '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 ' +
            '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 ' +
            '[&_p]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 ' +
            '[&_li]:my-0.5 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 ' +
            '[&_blockquote]:pl-4 [&_blockquote]:text-gray-600 [&_blockquote]:italic [&_blockquote]:my-2',
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  if (!editor) return null

  return (
    <div className="rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-[#2D5016]/40 focus-within:border-[#2D5016] transition-colors overflow-hidden">
      {/* Toolbar */}
      <div className={`flex flex-wrap items-center gap-0.5 bg-white border-b border-gray-200 ${compact ? 'p-1' : 'p-2'}`}>
        <ToolbarButton compact={compact} onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton compact={compact} onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton compact={compact} onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
          <span className="underline">U</span>
        </ToolbarButton>

        {/* Full toolbar extras — hidden in compact mode */}
        {!compact && (
          <>
            <Divider />
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">H2</ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3">H3</ToolbarButton>
            <Divider />
            <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet list">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered list">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 6h13M7 12h13M7 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            </ToolbarButton>
            <Divider />
            <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </ToolbarButton>
          </>
        )}
      </div>

      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  )
}
