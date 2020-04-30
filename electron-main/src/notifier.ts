import { BrowserWindow } from "electron";
import AppState from './app_state';
import Service from './service';

export default class Notifier {
  constructor(win: BrowserWindow, appState: AppState, service: Service) {
    appState.on("init", (data) => {
      win.webContents.send("init", data);
    });

    appState.on("new-file", (data) => {
      win.webContents.send("new-file", data);
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
}
