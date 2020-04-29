import React from "react";
import ReactDOM from "react-dom";
import { ipcRenderer } from "electron";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: null,
      content: "",
      svg: "",
      flash: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    ipcRenderer.invoke("ipc-init");
    ipcRenderer.on("ipc-app-state-updated", (e, state) => {
      const newState = {};
      if (typeof state.filePath !== "undefined")
        newState.filePath = state.filePath;
      if (typeof state.content !== "undefined")
        newState.content = state.content;
      if (typeof state.svg !== "undefined") newState.svg = state.svg;
      if (typeof state.flash !== "undefined") newState.flash = state.flash;
      this.setState(newState);
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners("ipc-app-state-updated");
  }

  handleChange(e) {
    ipcRenderer.invoke("ipc-update-app-state", { content: e.target.value });
  }

  utf8ToB64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }

  render() {
    const data = this.utf8ToB64(this.state.svg);

    const style = { maxWidth: "780px", maxHeight: "600px" };

    return (
      <div>
        <div className="status-line">
          <span className="file-path">{this.state.filePath}</span>
          <span>{(() => {
            if (this.state.flash) {
              return "(" + this.state.flash + ")"
            } else {
              return ""
            }
          })()}</span>
        </div>
        <div className="row">
          <div className="left">
            <textarea
              defaultValue={this.state.content}
              onChange={this.handleChange}
            ></textarea>
          </div>
          <div className="right">
            {(() => {
              if (this.state.svg) {
                return (
                  <img
                    src={`data:image/svg+xml;base64,${data}`}
                    style={style}
                  />
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
}

ReactDOM.render(<App />, document.getElementById("root"));
