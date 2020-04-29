"use strict";

const { BrowserWindow, app, ipcMain } = require("electron");

const Service = require("./service");
const AppState = require("./app_state");
const AppMenu = require('./app_menu');

let service;

const createWindow = async () => {
  service = new Service();
  await service.start();

  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const appMenu = new AppMenu(app.name);
  appMenu.setUp();

  win.loadFile("index.html");

  const appState = new AppState(win);

  appState.on('request-svg', (content) => {
    (async () => {
      const data = await service.renderPlantUML(content);
      const svg = new TextDecoder("utf-8").decode(data);
      win.webContents.send("svg-updated", { svg: svg });
    })().catch((e) => console.log(e));
  })

  ipcMain.handle("ipc-init", async () => {
    await appState.onInit();
  });

  ipcMain.handle("ipc-input", async (e, state) => {
    appState.onUserInput(state.content);
  });

  appMenu.on("save", (force) => {
    appState.onFileSaved(force).catch((e) => console.error(e));
  });

  appMenu.on("open", () => {
    appState.onFileOpened().catch((e) => console.error(e));
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
