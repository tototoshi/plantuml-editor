import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { ipcRenderer } from "electron";

interface AppState {
  filePath?: string;
  content: string;
  svg: string;
  flash?: string;
}

function App() {
  const textarea = useRef<HTMLTextAreaElement>(null);

  const [state, setState] = useState<AppState>({
    content: "",
    svg: "",
  });

  useEffect(() => {
    ipcRenderer.invoke("ipc-init");

    ipcRenderer.on("init", (e, state) => {
      setState(state);
    });

    ipcRenderer.on("new-file", (e, state) => {
      setState(state);
      setTextarea(state.content);
    });

    ipcRenderer.on("file-opened", (e, state) => {
      setState(state);
      setTextarea(state.content);
      flash("opened");
    });

    ipcRenderer.on("svg-updated", (e, state) => {
      setState(state);
    });

    ipcRenderer.on("file-saved", (e, state) => {
      setState(state);
      flash("saved");
    });

    return () => {
      ipcRenderer.removeAllListeners("init");
      ipcRenderer.removeAllListeners("new-file");
      ipcRenderer.removeAllListeners("file-opened");
      ipcRenderer.removeAllListeners("svg-updated");
      ipcRenderer.removeAllListeners("file-saved");
    };
  }, []);

  const setTextarea = (content: string): void => {
    if (textarea.current != null) {
      textarea.current.value = content;
      textarea.current.selectionStart = textarea.current.selectionEnd = 0;
    }
  };

  const flash = (message: string) => {
    setState((state) => {
      return { ...state, flash: message };
    });
    setTimeout(
      () =>
        setState((state) => {
          return { ...state, flash: undefined };
        }),
      1000
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    ipcRenderer.invoke("ipc-input", { content: e.target.value });
  };

  const utf8ToB64 = (str: string) => {
    return window.btoa(unescape(encodeURIComponent(str)));
  };

  const data = utf8ToB64(state.svg);

  const style = { maxWidth: "100%", maxHeight: "100%" };

  return (
    <div>
      <div className="status-line">
        <span className="file-path">{state.filePath}</span>
        <span>{state.flash === undefined ? "" : "(" + state.flash + ")"}</span>
      </div>
      <div className="row">
        <div className="left">
          <textarea
            ref={textarea}
            defaultValue={state.content}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="right">
          {(() => {
            if (state.svg) {
              return (
                <img src={`data:image/svg+xml;base64,${data}`} style={style} />
              );
            } else {
              return <span>now loading...</span>;
            }
          })()}
        </div>{" "}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
