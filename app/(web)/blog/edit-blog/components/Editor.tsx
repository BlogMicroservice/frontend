/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import EditorToolbar from "./EditorToolbar";
import Highlight from "@tiptap/extension-highlight";
import { SlashCommand } from "./SlashCommand";
import { SuggestionProps } from "@tiptap/suggestion";
import { Editor as CoreEditor, Range } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
interface SlashItem {
  title: string;
  description: string;
  icon: string;
  command: (props: SuggestionProps) => void;
}

const CustomHighlight = Highlight.extend({
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => ({
          color: element.style.backgroundColor,
        }),
        renderHTML: (attributes) => {
          if (!attributes.color) return {};
          return {
            style: `background-color: ${attributes.color}`,
          };
        },
      },
    };
  },
});

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: "auto" },
      height: { default: "auto" },
      style: {
        default: null,
        parseHTML: (el) => el.getAttribute("style"),
        renderHTML: (attrs) => {
          return attrs.style ? { style: attrs.style } : {};
        },
      },
    };
  },
});
export default function Editor() {
  const [currentColor, setCurrentColor] = useState("#000000");
  const [isLoading, setIsLoading] = useState(false);
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const [currentRange, setCurrentRange] = useState<any>(null);

  const generateDummyContent = (prompt: string) => {
    const responses = [
      `Here's content about "${prompt}": Lorem ipsum dolor sit amet.`,
      `Regarding "${prompt}": Sample generated text.`,
      `About "${prompt}": This is important for modern solutions.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleGenerateClick = (range: any) => {
    setCurrentRange(range);
    setShowPromptInput(true);
  };

  const handlePromptSubmit = () => {
    if (!currentPrompt.trim() || !editor || !currentRange) return;

    setIsLoading(true);
    setShowPromptInput(false);

    editor
      .chain()
      .focus()
      .deleteRange(currentRange)
      .insertContent(`<p>Generating content about "${currentPrompt}"...</p>`)
      .run();

    setTimeout(() => {
      const content = generateDummyContent(currentPrompt);
      editor.chain().focus().insertContent(`<p>${content}</p>`).run();
      setIsLoading(false);
      setCurrentPrompt("");
    }, 1000);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily.configure({ types: ["textStyle"] }),
      CustomHighlight,
      CustomImage,
      TextAlign.configure({
        types: ["heading", "paragraph"], // text blocks that can be aligned
      }),
      SlashCommand.configure({
        suggestion: {
          items: ({ query }) => {
            return [
              {
                title: "Generate Text",
                description: "AI-generated content based on your prompt",
                icon: "✨",
                command: ({ editor, range }) => {
                  handleGenerateClick(range);
                },
              },
              {
                title: "Summarize",
                description: "Summarize selected text",
                icon: "📝",
                command: ({ editor, range }) => {
                  const text = editor.getText();
                  setIsLoading(true);
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .insertContent("Summarizing text...")
                    .run();
                  setTimeout(() => {
                    editor
                      .chain()
                      .focus()
                      .insertContent(`Summary: ${text.slice(0, 50)}...`)
                      .run();
                    setIsLoading(false);
                  }, 800);
                },
              },
            ].filter(
              (item) =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase())
            );
          },
          render: () => {
            let popup: HTMLDivElement | null = null;
            let selectedIndex = 0;

            const updatePopup = (props: any) => {
              if (!popup || !props?.items?.length) return;

              popup.innerHTML = `
              <div class="suggestion-list">
                ${props.items
                  .map(
                    (item: any, index: number) => `
                  <div class="suggestion-item ${
                    index === selectedIndex ? "is-selected" : ""
                  }">
                    <span class="suggestion-icon">${item.icon}</span>
                    <div>
                      <div class="suggestion-title">${item.title}</div>
                      <div class="suggestion-description">${
                        item.description
                      }</div>
                    </div>
                  </div>`
                  )
                  .join("")}
              </div>
            `;

              props.items.forEach((item: any, index: number) => {
                const element = popup?.querySelector(
                  `.suggestion-item:nth-child(${index + 1})`
                );
                if (element && item.command) {
                  element.addEventListener("click", () => {
                    item.command(props);
                  });
                }
              });
            };

            const positionPopup = (props: any) => {
              if (!popup || !props?.clientRect) return;
              try {
                const rect = props.clientRect();
                if (!rect) return;

                popup.style.position = "absolute";
                popup.style.top = `${rect.top + window.scrollY + 24}px`;
                popup.style.left = `${rect.left + window.scrollX}px`;
              } catch (error) {
                console.error("Error positioning popup:", error);
              }
            };

            return {
              onStart: (props: any) => {
                if (!props?.items?.length) return;

                popup = document.createElement("div");
                popup.className = "suggestion-popup";
                document.body.appendChild(popup);
                updatePopup(props);
                positionPopup(props);
              },
              onUpdate: (props: any) => {
                if (!popup || !props?.items?.length) return;
                updatePopup(props);
                positionPopup(props);
              },
              onKeyDown: (props: any) => {
                if (!props?.items?.length) return false;

                if (props.event.key === "ArrowUp") {
                  selectedIndex =
                    (selectedIndex + props.items.length - 1) %
                    props.items.length;
                  updatePopup(props);
                  return true;
                }

                if (props.event.key === "ArrowDown") {
                  selectedIndex = (selectedIndex + 1) % props.items.length;
                  updatePopup(props);
                  return true;
                }

                if (props.event.key === "Enter") {
                  props.event.preventDefault();
                  if (props.items[selectedIndex]?.command) {
                    props.items[selectedIndex].command(props);
                  }
                  return true;
                }

                if (props.event.key === "Escape") {
                  props.event.preventDefault();
                  return true;
                }

                return false;
              },
              onExit: () => {
                popup?.remove();
                popup = null;
              },
            };
          },
        },
      }),
    ],
    content: "<p>Hello, start typing...</p>",
  });

  useEffect(() => {
    if (showPromptInput && promptInputRef.current) {
      promptInputRef.current.focus();
    }
  }, [showPromptInput]);

  if (!editor) return null;

  return (
    <div className="w-full flex flex-col items-center mt-10 relative">
      <EditorToolbar
        editor={editor}
        currentColor={currentColor}
        setCurrentColor={setCurrentColor}
        // isLoading={isLoading}
      />

      <div className="relative w-[calc(100vw-200px)]">
        <EditorContent
          editor={editor}
          className="min-h-[300px] border border-gray-300 rounded-b-2xl p-4 outline-none"
        />

        {showPromptInput && (
          <div className="w-full fixed bottom-0 left-0 px-6 pb-6 z-20 flex justify-center">
            <div className="w-[min(720px,100%)] bg-white text-black rounded-xl shadow-2xl p-4 space-y-3 border border-gray-300">
              <textarea
                ref={promptInputRef}
                rows={2}
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
                placeholder="What would you like to generate?"
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handlePromptSubmit()
                }
                className="w-full bg-white border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder-gray-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowPromptInput(false)}
                  className="text-gray-600 hover:text-black px-4 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePromptSubmit}
                  className="bg-black hover:bg-gray-900 px-4 py-2 rounded-lg text-white font-medium cursor-pointer"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="mt-2 text-sm text-gray-500">Generating content...</div>
      )}
    </div>
  );
}
