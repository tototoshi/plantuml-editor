import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { plantuml } from "./plantuml-lang";

interface AppState {
  filePath?: string;
  content: string;
  svg: string;
  flash?: string;
}

// Extend Window interface to include our API
declare global {
  interface Window {
    electronAPI: {
      init: () => Promise<void>;
      onInit: (callback: (state: AppState) => void) => () => void;
      onNewFile: (callback: (state: AppState) => void) => () => void;
      onFileOpened: (callback: (state: AppState) => void) => () => void;
      onSvgUpdated: (callback: (svg: string) => void) => () => void;
      onFileSaved: (callback: (state: AppState) => void) => () => void;
      sendInput: (content: string) => Promise<void>;
    };
  }
}

function App() {
  const [state, setState] = useState<AppState>({
    content: "",
    svg: "",
  });

  useEffect(() => {
    window.electronAPI.init();

    const unsubscribeInit = window.electronAPI.onInit((newState) => {
      setState(newState);
    });

    const unsubscribeNewFile = window.electronAPI.onNewFile((newState) => {
      setState(newState);
    });

    const unsubscribeFileOpened = window.electronAPI.onFileOpened((newState) => {
      setState(newState);
      showFlash("opened");
    });

    const unsubscribeSvgUpdated = window.electronAPI.onSvgUpdated((svg) => {
      setState((prevState) => ({ ...prevState, svg }));
    });

    const unsubscribeFileSaved = window.electronAPI.onFileSaved((newState) => {
      setState(newState);
      showFlash("saved");
    });

    return () => {
      unsubscribeInit();
      unsubscribeNewFile();
      unsubscribeFileOpened();
      unsubscribeSvgUpdated();
      unsubscribeFileSaved();
    };
  }, []);

  const showFlash = (message: string) => {
    setState((prevState) => ({ ...prevState, flash: message }));
    setTimeout(() => {
      setState((prevState) => ({ ...prevState, flash: undefined }));
    }, 1000);
  };

  const handleChange = (value: string) => {
    window.electronAPI.sendInput(value);
  };

  const svgDataUrl = state.svg
    ? `data:image/svg+xml;base64,${btoa(new TextEncoder().encode(state.svg).reduce((data, byte) => data + String.fromCharCode(byte), ""))}`
    : null;

  return (
    <>
      <div className="status-line">
        <span className="file-path">{state.filePath}</span>
        <span>{state.flash ? `(${state.flash})` : ""}</span>
      </div>
      <div className="row">
        <div className="left">
          <CodeMirror
            value={state.content}
            height="100%"
            theme={oneDark}
            extensions={[plantuml()]}
            onChange={handleChange}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightActiveLine: true,
              foldGutter: true,
              drawSelection: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: true,
              crosshairCursor: true,
              highlightSelectionMatches: true,
              closeBracketsKeymap: true,
              searchKeymap: true,
              foldKeymap: true,
              completionKeymap: true,
              lintKeymap: true,
            }}
          />
        </div>
        <div className="right">
          {svgDataUrl ? (
            <img
              src={svgDataUrl}
              alt="PlantUML diagram"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          ) : (
            <span>now loading...</span>
          )}
        </div>
      </div>
    </>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
