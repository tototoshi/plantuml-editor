import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [state, setState] = useState<AppState>({
    content: "",
    svg: "",
  });

  useEffect(() => {
    window.electronAPI.init();

    const unsubscribeInit = window.electronAPI.onInit((newState) => {
      setState(newState);
      setTextareaValue(newState.content);
    });

    const unsubscribeNewFile = window.electronAPI.onNewFile((newState) => {
      setState(newState);
      setTextareaValue(newState.content);
    });

    const unsubscribeFileOpened = window.electronAPI.onFileOpened((newState) => {
      setState(newState);
      setTextareaValue(newState.content);
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

  const setTextareaValue = (content: string): void => {
    if (textareaRef.current) {
      textareaRef.current.value = content;
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = 0;
    }
  };

  const showFlash = (message: string) => {
    setState((prevState) => ({ ...prevState, flash: message }));
    setTimeout(() => {
      setState((prevState) => ({ ...prevState, flash: undefined }));
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    window.electronAPI.sendInput(e.target.value);
  };

  const svgDataUrl = state.svg
    ? `data:image/svg+xml;base64,${btoa(new TextEncoder().encode(state.svg).reduce((data, byte) => data + String.fromCharCode(byte), ""))}`
    : null;

  return (
    <div>
      <div className="status-line">
        <span className="file-path">{state.filePath}</span>
        <span>{state.flash ? `(${state.flash})` : ""}</span>
      </div>
      <div className="row">
        <div className="left">
          <textarea
            ref={textareaRef}
            defaultValue={state.content}
            onChange={handleChange}
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
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
