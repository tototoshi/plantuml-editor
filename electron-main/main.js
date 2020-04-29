"use strict";

const { BrowserWindow, app } = require("electron");

const Service = require("./service");
const AppState = require("./app_state");
const AppMenu = require("./app_menu");
const Notifier = require("./notifier");

let service;

const createWindow = async () => {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const appMenu = new AppMenu(app.name);
  appMenu.setUp();

  win.loadFile("index.html");

  const appState = new AppState(win, appMenu);

  service = new Service(appState);
  await service.start();

  new Notifier(win, appState, service);
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
