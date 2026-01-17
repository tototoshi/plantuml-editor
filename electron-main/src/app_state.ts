import { dialog, ipcMain, BrowserWindow } from "electron";
import { EventEmitter } from "events";
import { promises as fs } from "fs";
import path from "path";
import AppMenu from "./app_menu";

export default class AppState extends EventEmitter {
  private win: BrowserWindow;
  private filePath?: string;
  private content?: string;

  private defaultContent = `@startuml

skinparam monochrome true
skinparam shadowing false

Bob -> Alice: Hello

@enduml 
`

  constructor(win: BrowserWindow, appMenu: AppMenu) {
    super();
    this.win = win;

    appMenu.on("new", () => {
      this.onNewFile();
    });

    appMenu.on("save", (force: boolean) => {
      this.onFileSaved(force).catch((e) => console.error(e));
    });

    appMenu.on("open", () => {
      this.onFileOpened().catch((e) => console.error(e));
    });

    appMenu.on("export", () => {
      this.onFileExport().catch((e) => console.error(e));
    });

    ipcMain.handle("ipc-init", async () => {
      await this.onInit();
    });

    ipcMain.handle("ipc-input", async (e, state) => {
      this.onUserInput(state.content);
    });
  }

  async onInit() {
    let filePath;
    let content = this.defaultContent;

    if (process.argv[2]) {
      filePath = path.resolve(process.argv[2]);
    }

    if (filePath) {
      try {
        content = await fs.readFile(filePath, { encoding: "utf-8" });
      } catch (e) {
        // file does not exist
      }
    }

    this.filePath = filePath;
    this.content = content;
    this.emit("init", { filePath: filePath, content: content });
    this.emit("request-svg", content);
  }

  onNewFile() {
    this.filePath = undefined;
    this.content = this.defaultContent;
    this.emit("new-file", { filePath: this.filePath, content: this.content });
    this.emit("request-svg", this.content);
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
    this.emit("file-opened", {
      filePath: this.filePath,
      content: this.content,
    });
    this.emit("request-svg", this.content);
  }

  async onFileSaved(force: boolean) {
    if (force || this.filePath === undefined) {
      const result = await dialog.showSaveDialog(this.win, {});
      if (result.canceled) {
        return;
      }
      this.filePath = result.filePath;
    }

    if (this.filePath === undefined || this.content === undefined) {
      return;
    }

    await fs.writeFile(this.filePath, this.content);
    this.emit("file-saved", { filePath: this.filePath });
  }

  async onFileExport() {
    const result = await dialog.showSaveDialog(this.win, {});
    if (result.canceled) {
      return;
    }

    const filePath = result.filePath;

    if (filePath === undefined || this.content === undefined) {
      return;
    }

    this.emit("export-svg", {
      filePath: filePath,
      content: this.content,
    });
  }

  onUserInput(content: string) {
    this.content = content;
    this.emit("content-changed", { content: content });
    this.emit("request-svg", content);
  }
}
