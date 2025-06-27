"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Editor as TiptapEditor } from "@tiptap/react";
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
  LuImage,
  LuExpand,
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
} from "react-icons/lu";
import ColorPicker from "./ColorPicker";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const FONTS = [
  { label: "Sans", value: "sans-serif" },
  { label: "Serif", value: "serif" },
  { label: "Mono", value: "monospace" },
  { label: "Poppins", value: "Poppins" },
];

const HIGHLIGHT_COLORS = [
  "#fef08a",
  "#facc15",
  "#fdba74",
  "#a5f3fc",
  "#fca5a5",
];

interface Props {
  editor: TiptapEditor | null;
  currentColor: string;
  setCurrentColor: (color: string) => void;
}

export default function EditorToolbar({
  editor,
  currentColor,
  setCurrentColor,
}: Props) {
  const [, setRefresh] = useState(0);

  const handleSave = () => {
    const html = editor?.getHTML();
    if (html) {
      localStorage.setItem("editor-content", html);
      alert("Content saved!");
    }
  };

  useEffect(() => {
    if (!editor) return;
    const update = () => setRefresh((r) => r + 1);
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  const handleHeadingChange = (value: string) => {
    if (!editor) return;
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().setColor(currentColor).run();
    } else {
      const level = parseInt(value.replace("h", ""), 10) as 1 | 2 | 3;
      editor
        .chain()
        .focus()
        .toggleHeading({ level })
        .setColor(currentColor)
        .run();
    }
  };

  const handleAlign = (align: "left" | "center" | "right") => {
    if (!editor) return;

    const { state } = editor;
    const { from, to } = state.selection;
    let isImageSelected = false;

    state.doc.nodesBetween(from, to, (node) => {
      if (node.type.name === "image") {
        isImageSelected = true;
      }
    });

    if (isImageSelected) {
      const style =
        align === "center"
          ? "display: block; margin: 0 auto;"
          : `float: ${align};`;

      editor
        .chain()
        .focus()
        .updateAttributes("image", {
          style,
        })
        .run();
    } else {
      editor.chain().focus().setTextAlign(align).run();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    // For now, create a temporary URL
    const tempUrl = URL.createObjectURL(file);

    // Insert image in editor
    // editor.chain().focus().setImage({ src: tempUrl }).run();
    editor
      .chain()
      .focus()
      .setImage({
        src: tempUrl,
        width: "100%",
        height: "auto",
      })
      .run();

    // Optional: Call actual upload function (commented out for now)
    // uploadImageToBackend(file);

    // Reset input
    e.target.value = "";
  };

  // const uploadImageToBackend = async (file: File) => {
  //   // You can later replace this with a real fetch/axios call
  //   console.log("Ready to upload:", file);

  //   // Example:
  //   // const formData = new FormData();
  //   // formData.append('image', file);
  //   // const res = await fetch('/your-api/upload', {
  //   //   method: 'POST',
  //   //   body: formData,
  //   // });
  //   // const data = await res.json();
  //   // return data.url;
  // };

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

        <Select
          onValueChange={(font) => {
            if (editor) {
              editor.chain().focus().setFontFamily(font).run();
            }
          }}
        >
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

        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className="p-2 rounded border hover:bg-gray-100"
        >
          <LuList className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className="p-2 rounded border hover:bg-gray-100"
        >
          <LuListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className="p-2 rounded border hover:bg-gray-100"
        >
          <LuBold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className="p-2 rounded border hover:bg-gray-100"
        >
          <LuItalic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className="p-2 rounded border hover:bg-gray-100"
        >
          <LuQuote className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className="p-2 rounded border hover:bg-gray-100"
        >
          <LuCode className="w-4 h-4" />
        </button>
        

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="p-2 rounded border"
              title="Align"
            >
              <LuAlignCenter className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-1" align="start">
            <DropdownMenuItem onSelect={() => handleAlign("left")}>
              <LuAlignLeft className="w-4 h-4 mr-2" /> Left
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleAlign("center")}>
              <LuAlignCenter className="w-4 h-4 mr-2" /> Center
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleAlign("right")}>
              <LuAlignRight className="w-4 h-4 mr-2" /> Right
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload(e)}
        />

        <button
          onClick={() => document.getElementById("imageUpload")?.click()}
          className="p-2 rounded border hover:bg-gray-100"
        >
          <LuImage className="w-4 h-4" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="p-2 rounded border">
              <LuExpand className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-1" align="start">
            <DropdownMenuItem
              onSelect={() => {
                const node = editor?.getAttributes("image");
                if (node?.src) {
                  editor
                    ?.chain()
                    .focus()
                    .updateAttributes("image", {
                      width: "200px",
                      height: "auto",
                    })
                    .run();
                }
              }}
            >
              Small (200px)
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                const node = editor?.getAttributes("image");
                if (node?.src) {
                  editor
                    ?.chain()
                    .focus()
                    .updateAttributes("image", {
                      width: "400px",
                      height: "auto",
                    })
                    .run();
                }
              }}
            >
              Medium (400px)
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                const node = editor?.getAttributes("image");
                if (node?.src) {
                  editor
                    ?.chain()
                    .focus()
                    .updateAttributes("image", {
                      width: "100%",
                      height: "auto",
                    })
                    .run();
                }
              }}
            >
              Full Width
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ColorPicker
          editor={editor}
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="p-2 rounded border">
              <LuHighlighter className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex gap-2 p-2" align="start">
            {HIGHLIGHT_COLORS.map((color) => (
              <DropdownMenuItem
                key={color}
                onSelect={() => {
                  if (editor) {
                    editor.chain().focus().setHighlight({ color }).run();
                  }
                }}
                className="p-0 cursor-pointer"
              >
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: color }}
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
