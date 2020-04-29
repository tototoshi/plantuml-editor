"use strict";

const { dialog } = require('electron');
const { EventEmitter } = require("events");
const fs = require('fs').promises;
const path = require('path');

module.exports = class extends EventEmitter {
  constructor(win) {
    super();
    this.win = win;
    this.filePath = null;
    this.content = null;
  }

  get() {
    return {
      filePath: this.filePath,
      content: this.content,
    };
  }

  async onInit() {
    let filePath;
    let content = "@startuml\n\n\n@enduml\n";

    if (process.argv[2]) {
      filePath = path.resolve(process.argv[2]);
    }

    if (filePath) {
      try {
        content = await fs.readFile(filePath, { encoding: "utf-8" });
      } catch (e) {
        // file does not exist
        filePath = null;
      }
    }

    this.filePath = filePath;
    this.content = content;
    this.win.webContents.send('init', {
      filePath: filePath,
      content: content
    })
    this.emit('request-svg', content);
  }

  async onFileOpened() {
    const result = await dialog.showOpenDialog(this.win, {
      properties: ["openFile"],
    });
    if (result.canceled) {
      return;
    }
    this.filePath = result.filePaths[0];
    this.content = await fs.readFile(this.filePath, { encoding: "utf-8" });
    this.win.webContents.send('file-opened', {
      filePath: this.filePath,
      content: this.content
    })
    this.emit('request-svg', this.content);
  }

  async onFileSaved(force) {
    if (force || !this.filePath) {
      const result = await dialog.showSaveDialog(this.win);
      if (result.canceled) {
        return;
      }
      this.filePath = result.filePath;
    }
    await fs.writeFile(this.filePath, this.content);
    this.win.webContents.send('file-saved', {
      filePath: this.filePath,
    })
  }

  onUserInput(content) {
    this.content = content;
    this.win.webContents.send('content-changed', {
      content: content
    })
    this.emit('request-svg', content);
  }

};
