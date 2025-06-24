'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Editor as TiptapEditor } from '@tiptap/react';
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuText,
  LuList,
  LuListOrdered,
  LuBold,
  LuItalic,
  LuCode,
  LuQuote,
  LuHighlighter,
} from 'react-icons/lu';
import ColorPicker from './ColorPicker';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const FONTS = [
  { label: 'Sans', value: 'sans-serif' },
  { label: 'Serif', value: 'serif' },
  { label: 'Mono', value: 'monospace' },
  { label: 'Poppins', value: 'Poppins' },
];

const HIGHLIGHT_COLORS = ['#fef08a', '#facc15', '#fdba74', '#a5f3fc', '#fca5a5'];

interface Props {
  editor: TiptapEditor | null;
  currentColor: string;
  setCurrentColor: (color: string) => void;
}

export default function EditorToolbar({ editor, currentColor, setCurrentColor }: Props) {
  const [, setRefresh] = useState(0);

  useEffect(() => {
    if (!editor) return;
    const update = () => setRefresh(r => r + 1);
    editor.on('selectionUpdate', update);
    editor.on('transaction', update);
    return () => {
      editor.off('selectionUpdate', update);
      editor.off('transaction', update);
    };
  }, [editor]);

  const handleHeadingChange = (value: string) => {
    if (!editor) return;
    if (value === 'paragraph') {
      editor.chain().focus().setParagraph().setColor(currentColor).run();
    } else {
      const level = parseInt(value.replace('h', ''), 10) as 1 | 2 | 3;
      editor.chain().focus().toggleHeading({ level }).setColor(currentColor).run();
    }
  };

  return (
    <div className="w-full flex justify-center sticky top-0 z-10 bg-white mt-10">
      <div className="w-[calc(100vw-200px)] border border-b-0 border-gray-300 rounded-t-2xl flex items-center px-4 gap-4 py-2 flex-wrap">
        <Select onValueChange={handleHeadingChange}>
          <SelectTrigger className="h-[32px] border rounded shadow-none">
            <SelectValue placeholder="Heading" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph" className="flex items-center gap-2">
              <LuText className="w-4 h-4" /> Paragraph
            </SelectItem>
            <SelectItem value="h1" className="flex items-center gap-2">
              <LuHeading1 className="w-4 h-4" /> Heading 1
            </SelectItem>
            <SelectItem value="h2" className="flex items-center gap-2">
              <LuHeading2 className="w-4 h-4" /> Heading 2
            </SelectItem>
            <SelectItem value="h3" className="flex items-center gap-2">
              <LuHeading3 className="w-4 h-4" /> Heading 3
            </SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={font => {
          if (editor) {
            editor.chain().focus().setFontFamily(font).run();
          }
        }}>
          <SelectTrigger className="h-[32px] border rounded shadow-none">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            {FONTS.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                <span style={{ fontFamily: value }}>{label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className="p-2 rounded border hover:bg-gray-100">
          <LuList className="w-4 h-4" />
        </button>
        <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className="p-2 rounded border hover:bg-gray-100">
          <LuListOrdered className="w-4 h-4" />
        </button>
        <button onClick={() => editor?.chain().focus().toggleBold().run()} className="p-2 rounded border hover:bg-gray-100">
          <LuBold className="w-4 h-4" />
        </button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()} className="p-2 rounded border hover:bg-gray-100">
          <LuItalic className="w-4 h-4" />
        </button>
        <button onClick={() => editor?.chain().focus().toggleBlockquote().run()} className="p-2 rounded border hover:bg-gray-100">
          <LuQuote className="w-4 h-4" />
        </button>
        <button onClick={() => editor?.chain().focus().toggleCodeBlock().run()} className="p-2 rounded border hover:bg-gray-100">
          <LuCode className="w-4 h-4" />
        </button>

        <ColorPicker editor={editor} currentColor={currentColor} setCurrentColor={setCurrentColor} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="p-2 rounded border">
              <LuHighlighter className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex gap-2 p-2" align="start">
            {HIGHLIGHT_COLORS.map(color => (
              <DropdownMenuItem
                key={color}
                onSelect={() => {
                  if (editor) {
                    editor.chain().focus().setHighlight({ color }).run();
                  }
                }}
                className="p-0 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: color }} />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
