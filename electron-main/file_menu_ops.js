const { dialog } = require("electron");
const fs = require("fs").promises;

module.exports = class FileMenuOps {
  constructor(win, appState) {
    this.win = win;
    this.appState = appState;
  }

  async open() {
    const result = await dialog.showOpenDialog(this.win, {
      properties: ["openFile"],
    });
    if (result.canceled) {
      return;
    }
    const filePath = result.filePaths[0];
    const content = await fs.readFile(filePath, { encoding: "utf-8" });
    await this.appState.update({
      filePath: filePath,
      content: content,
      flash: "opened",
    });
  }

  async save(force) {
    const state = this.appState.get();
    let filePath = state.filePath;
    const content = state.content;
    if (force || !filePath) {
      const result = await dialog.showSaveDialog(this.win);
      if (result.canceled) {
        return;
      }
      filePath = result.filePath;
    }
    await this.appState.update({ filePath: filePath, flash: "saved" });
    await fs.writeFile(filePath, content);
  }
};
