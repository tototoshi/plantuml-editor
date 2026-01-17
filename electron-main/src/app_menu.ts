import electron, { Menu, MenuItemConstructorOptions } from "electron";
import { EventEmitter } from "events";

export default class AppMenu extends EventEmitter {
  constructor(private appName: string) {
    super();
  }

  setUp() {
    const template = this.menuTemplate();
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  menuTemplate(): MenuItemConstructorOptions[] {
    const isMac = process.platform === "darwin";

    return [
      // { role: 'appMenu' }
      ...(isMac
        ? [
            {
              label: this.appName,
              submenu: [
                { role: "about" as const },
                { type: "separator" as const },
                { role: "services" as const },
                { type: "separator" as const },
                { role: "hide" as const },
                { role: "hideOthers" as const },
                { role: "unhide" as const },
                { type: "separator" as const },
                { role: "quit" as const },
              ],
            },
          ]
        : []),
      // { role: 'fileMenu' }
      {
        label: "File",
        submenu: [
          {
            label: "New File",
            accelerator: "CmdOrCtrl+N",
            click: () => {
              this.emit("new");
            },
          },
          {
            label: "Open",
            accelerator: "CmdOrCtrl+O",
            click: () => {
              this.emit("open");
            },
          },
          {
            label: "Save",
            accelerator: "CmdOrCtrl+S",
            click: () => {
              this.emit("save");
            },
          },
          {
            label: "Save As",
            accelerator: "Shift+CmdOrCtrl+S",
            click: () => {
              const force = true;
              this.emit("save", force);
            },
          },
          {
            label: "Export",
            accelerator: "CmdOrCtrl+E",
            click: () => {
              this.emit("export");
            },
          },
          isMac ? { role: "close" as const } : { role: "quit" as const },
        ],
      },
      // { role: 'editMenu' }
      {
        label: "Edit",
        submenu: [
          { role: "undo" as const },
          { role: "redo" as const },
          { type: "separator" as const },
          { role: "cut" as const },
          { role: "copy" as const },
          { role: "paste" as const },
          ...(isMac
            ? [
                { role: "pasteAndMatchStyle" as const },
                { role: "delete" as const },
                { role: "selectAll" as const },
                { type: "separator" as const },
                {
                  label: "Speech",
                  submenu: [
                    { role: "startSpeaking" as const },
                    { role: "stopSpeaking" as const },
                  ],
                },
              ]
            : [
                { role: "delete" as const },
                { type: "separator" as const },
                { role: "selectAll" as const },
              ]),
        ],
      },
      {
        label: "View",
        submenu: [
          {
            label: "Reload",
            accelerator: "CmdOrCtrl+R",
            click: (item, focusedWindow) => {
              if (focusedWindow) focusedWindow.reload();
            },
          },
          {
            label: "Toggle Developer Tools",
            accelerator: isMac ? "Alt+Command+I" : "Ctrl+Shift+I",
            click: (item, focusedWindow) => {
              if (focusedWindow) focusedWindow.webContents.toggleDevTools();
            },
          },
        ],
      },
      {
        label: "Window",
        role: "window" as const,
        submenu: [
          {
            label: "Minimize",
            accelerator: "CmdOrCtrl+M",
            role: "minimize" as const,
          },
          {
            label: "Close",
            accelerator: "CmdOrCtrl+W",
            role: "close" as const,
          },
        ],
      },
      {
        label: "Help",
        role: "help" as const,
        submenu: [
          {
            label: "Learn More",
            click: () => {
              electron.shell.openExternal(
                "https://www.electronjs.org"
              );
            },
          },
        ],
      },
    ];
  }
}
