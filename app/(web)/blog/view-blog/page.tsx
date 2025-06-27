"use client";

import { useEffect, useState } from "react";

export default function EditorViewer() {
  const [html, setHtml] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("editor-content");
    if (saved) {
      setHtml(saved);
    }
  }, []);

  return (
    <div className="w-ful flex justify-center">
      <div
        className="ProseMirror w-[calc(100%-200px)] p-4 "
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
