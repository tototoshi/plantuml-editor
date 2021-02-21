import electron, { Menu } from "electron";
import { EventEmitter } from "events";

export default class AppMenu extends EventEmitter {
  constructor(private appName: string) {
    super();
    this.appName = appName;
  }

  setUp() {
    const template = this.menuTemplate();
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  menuTemplate(): any {
    const isMac = process.platform === "darwin";

    return [
      // { role: 'appMenu' }
      ...(isMac
        ? [
          {
            label: this.appName,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideothers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
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
          isMac ? { role: "close" } : { role: "quit" },
        ],
      },
      // { role: 'editMenu' }
      {
        label: "Edit",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
          ...(isMac
            ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [
                  { role: "startspeaking" },
                  { role: "stopspeaking" },
                ],
              },
            ]
            : [
              { role: "delete" },
              { type: "separator" },
              { role: "selectAll" },
            ]),
        ],
      },
      {
        label: "View",
        submenu: [
          {
            label: "Reload",
            accelerator: "CmdOrCtrl+R",
            click: (item: any, focusedWindow: any) => {
              if (focusedWindow) focusedWindow.reload();
            },
          },
          {
            label: "Toggle Developer Tools",
            accelerator: (function () {
              if (process.platform == "darwin") return "Alt+Command+I";
              else return "Ctrl+Shift+I";
            })(),
            click: (item: any, focusedWindow: any) => {
              if (focusedWindow) focusedWindow.webContents.toggleDevTools();
            },
          },
        ],
      },
      {
        label: "Window",
        role: "window",
        submenu: [
          {
            label: "Minimize",
            accelerator: "CmdOrCtrl+M",
            role: "minimize",
          },
          {
            label: "Close",
            accelerator: "CmdOrCtrl+W",
            role: "close",
          },
        ],
      },
      {
        label: "Help",
        role: "help",
        submenu: [
          {
            label: "Learn More",
            click: function () {
              electron.shell.openExternal("http://electron.atom.io");
            },
          },
        ],
      },
    ];
  }
}
