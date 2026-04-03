import { useRef, useEffect } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "./App.css";

export const App = () => {
  const monacoEl = useRef(null);
  const editorRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (!monacoEl.current) return;

    const diffEditor = monaco.editor.createDiffEditor(monacoEl.current, {
      theme: "vs",
      mouseWheelZoom: true,
      smoothScrolling: true,
      originalEditable: true,
      scrollbar: {
        horizontalScrollbarSize: 4,
        verticalScrollbarSize: 4,
      },
    });

    const originalModel = monaco.editor.createModel("");
    const modifiedModel = monaco.editor.createModel("");

    diffEditor.setModel({ original: originalModel, modified: modifiedModel });
    editorRef.current = diffEditor;

    const triggerSave = () => {
      const original = originalModel.getValue();
      const modified = modifiedModel.getValue();

      if (!original.trim() || !modified.trim()) return;

      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        const backend = window._env_?.CODE_SNIPPETS_BACKEND;
        fetch(`${backend}/diff`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ original, modified }),
        }).catch(console.error);
      }, 800);
    };

    const d1 = originalModel.onDidChangeContent(triggerSave);
    const d2 = modifiedModel.onDidChangeContent(triggerSave);

    return () => {
      clearTimeout(saveTimeoutRef.current);
      d1.dispose();
      d2.dispose();
      diffEditor.dispose();
    };
  }, []);

  return (
    <div className="monaco-container-root">
      <div className="monaco-container" ref={monacoEl}></div>
    </div>
  );
};
