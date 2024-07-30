import { VFC, useRef, useState, useEffect } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "./App.css";
// import styles from './Editor.module.css';

export const App = () => {
  const [editor, setEditor] = useState();
  const monacoEl = useRef(null);

  useEffect(() => {
    if (monacoEl) {
      return monaco.editor
        .createDiffEditor(monacoEl.current, {
          theme: "vs",
          mouseWheelZoom: true,
          smoothScrolling: true,
          originalEditable: true,
          scrollbar: {
            horizontalScrollbarSize: 4,
            verticalScrollbarSize: 4,
          },
        })
        .setModel({
          original: monaco.editor.createModel("originalTxt"),
          modified: monaco.editor.createModel("modifiedTxt"),
        });
    }

    return () => editor?.dispose();
  }, [monacoEl.current]);

  return (
    <div className="monaco-container-root">
      <div className="monaco-container" ref={monacoEl}></div>
    </div>
  );
};
