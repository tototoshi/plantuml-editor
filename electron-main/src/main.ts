import { BrowserWindow, app } from "electron";
import Service from "./service";
import AppState from "./app_state";
import AppMenu from "./app_menu";
import Notifier from "./notifier";

let service: Service | undefined;

const createWindow = async () => {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
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
    service = undefined;
  }
});
