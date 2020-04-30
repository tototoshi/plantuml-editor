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
    this.textarea = React.createRef();
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    ipcRenderer.invoke("ipc-init");

    ipcRenderer.on("init", (e, state) => {
      this.setState(state);
    });

    ipcRenderer.on("new-file", (e, state) => {
      this.setState(state);
      this.setTextarea(state.content);
    });

    ipcRenderer.on("file-opened", (e, state) => {
      this.setState(state);
      this.setTextarea(state.content);
      this.flash("opened");
    });

    ipcRenderer.on("svg-updated", (e, state) => {
      this.setState(state);
    });

    ipcRenderer.on("file-saved", (e, state) => {
      this.setState(state);
      this.flash("saved");
    });
  }

  setTextarea(content) {
    this.textarea.current.value = content;
    this.textarea.current.selectionStart = this.textarea.current.selectionEnd = 0;
  }

  flash(message) {
    this.setState({ flash: message });
    setTimeout(() => this.setState({ flash: null }), 1000);
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners("init");
    ipcRenderer.removeAllListeners("new-file");
    ipcRenderer.removeAllListeners("file-opened");
    ipcRenderer.removeAllListeners("svg-updated");
    ipcRenderer.removeAllListeners("file-saved");
  }

  handleChange(e) {
    ipcRenderer.invoke("ipc-input", { content: e.target.value });
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
          <span>
            {(() => {
              if (this.state.flash) {
                return "(" + this.state.flash + ")";
              } else {
                return "";
              }
            })()}
          </span>
        </div>
        <div className="row">
          <div className="left">
            <textarea
              ref={this.textarea}
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
