"use strict";

module.exports = class Notifier {
  constructor(win, appState, service) {
    appState.on("init", (data) => {
      win.webContents.send("init", data);
    });

    appState.on("file-opened", (data) => {
      win.webContents.send("file-opened", data);
    });

    appState.on("file-saved", (data) => {
      win.webContents.send("file-saved", data);
    });

    appState.on("content-changed", (data) => {
      win.webContents.send("content-changed", data);
    });

    service.on("svg-rendered", (svg) => {
      win.webContents.send("svg-updated", { svg: svg });
    });
  }
};
