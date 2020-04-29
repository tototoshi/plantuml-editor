"use strict";

const { BrowserWindow, app, ipcMain, Menu } = require("electron");
const fs = require("fs").promises;
const path = require("path");
const { EventEmitter } = require("events");

const Service = require("./service");
const AppState = require("./app_state");
const menuTemplate = require("./menu_template");
const FileMenuOps = require("./file_menu_ops");

let service;

const createWindow = async () => {
  service = new Service();
  await service.start();

  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const menuEventEmitter = new EventEmitter();

  const template = menuTemplate(app, menuEventEmitter);
  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  win.loadFile("index.html");

  const appState = new AppState();

  appState.on("flash-set", (flash) => {
    win.webContents.send("ipc-app-state-updated", { flash: flash });
  });

  appState.on("file-path-updated", (filePath) => {
    win.webContents.send("ipc-app-state-updated", { filePath: filePath });
  });

  appState.on("content-updated", (content) => {
    (async () => {
      win.webContents.send("ipc-app-state-updated", { content: content });
      const data = await service.renderPlantUML(content);
      const svg = new TextDecoder("utf-8").decode(data);
      win.webContents.send("ipc-app-state-updated", { svg: svg });
    })().catch((e) => console.log(e));
  });

  ipcMain.handle("ipc-init", async () => {
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

    await appState.update({ filePath: filePath, content: content });
  });

  ipcMain.handle("ipc-update-app-state", async (e, state) => {
    await appState.update(state);
  });

  const fileMenuOps = new FileMenuOps(win, appState);

  menuEventEmitter.on("save", (force) => {
    fileMenuOps.save(force).catch((e) => console.error(e));
  });

  menuEventEmitter.on("open", () => {
    fileMenuOps.open().catch((e) => console.error(e));
  });
};

app.on("ready", async () => {
  try {
    await createWindow();
  } catch (e) {
    console.log(e);
    app.quit();
  }
});

app.on("before-quit", () => {
  if (service) {
    service.stop();
    service = null;
  }
});
