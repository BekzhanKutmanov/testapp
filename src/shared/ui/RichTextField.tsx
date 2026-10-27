'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'

interface Props {
  value: string
  onChange: (html: string) => void
}

export default function RichTextField({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false, // важно для Next.js (SSR), иначе будет hydration-ошибка
    onUpdate: ({ editor }) => onChange(editor.getHTML())
  })

  // синхронизация, если значение изменилось снаружи
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false)
    }
  }, [value, editor])

  if (!editor) return null

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '10px', overflowY: 'auto', width: '100%' }} className='h-[70px] sm:h-[80px]'>
      <ToggleButtonGroup size='small' className='max-h-[30px]' sx={{ p: 0.5 }}>
        <ToggleButton
          value='bold'
          className='p-1 '
          selected={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          size='small'
        >
          <FormatBoldIcon fontSize='small'/>
        </ToggleButton>
        <ToggleButton
          value='italic'
          className='p-1' 
          selected={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FormatItalicIcon fontSize='small'/>
        </ToggleButton>
        <ToggleButton
          value='underline'
          className='p-1'
          selected={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <FormatUnderlinedIcon fontSize='small'/>
        </ToggleButton>
        <ToggleButton
          value='bullet'
          selected={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FormatListBulletedIcon fontSize='small' />
        </ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ px: 1.5, py: 1, minHeight: 80, '& .ProseMirror': { outline: 'none' } }}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  )
}
