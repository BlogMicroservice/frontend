'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';

import EditorToolbar from './EditorToolbar';

import Highlight from '@tiptap/extension-highlight'
// import { mergeAttributes } from '@tiptap/core'

const CustomHighlight = Highlight.extend({
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: element => ({
          color: element.style.backgroundColor,
        }),
        renderHTML: attributes => {
          if (!attributes.color) return {}
          return {
            style: `background-color: ${attributes.color}`,
          }
        },
      },
    }
  },
})
export default function Editor() {
  const [currentColor, setCurrentColor] = useState('#000000');

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily.configure({ types: ['textStyle'] }),
      CustomHighlight,
    ],
    content: '<p>Hello, start typing...</p>',
  });

  return (
    <div className="w-full flex flex-col items-center mt-10">
      <EditorToolbar
        editor={editor}
        currentColor={currentColor}
        setCurrentColor={setCurrentColor}
      />
      <EditorContent
        editor={editor}
        className="w-[calc(100vw-200px)] min-h-[300px] border border-gray-300 rounded-b-2xl p-4 outline-none"
      />
    </div>
  );
} 