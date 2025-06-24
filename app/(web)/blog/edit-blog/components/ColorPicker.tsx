'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { Editor as TiptapEditor } from '@tiptap/react';

const COLORS = ['#000000', '#ef4444', '#22c55e', '#3b82f6', '#f97316', '#a855f7'];

interface Props {
  editor: TiptapEditor | null;
  currentColor: string;
  setCurrentColor: (color: string) => void;
}

export default function ColorPicker({ editor, currentColor, setCurrentColor }: Props) {
  const applyColor = (color: string) => {
    if (!editor) return;
    editor.chain().focus().setColor(color).run();
    setCurrentColor(color);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-8 h-8 p-0 rounded-full">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentColor }} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex gap-2 p-2" align="start">
        {COLORS.map((color) => (
          <DropdownMenuItem
            key={color}
            onSelect={() => applyColor(color)}
            className="p-0 cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: color }} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
