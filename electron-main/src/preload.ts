import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

// Define typed IPC channels
export interface AppState {
  filePath?: string;
  content: string;
  svg: string;
  flash?: string;
}

export interface ElectronAPI {
  init: () => Promise<void>;
  onInit: (callback: (state: AppState) => void) => () => void;
  onNewFile: (callback: (state: AppState) => void) => () => void;
  onFileOpened: (callback: (state: AppState) => void) => () => void;
  onSvgUpdated: (callback: (svg: string) => void) => () => void;
  onFileSaved: (callback: (state: AppState) => void) => () => void;
  sendInput: (content: string) => Promise<void>;
}

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  init: () => ipcRenderer.invoke("ipc-init"),
  
  onInit: (callback: (state: AppState) => void) => {
    const subscription = (_event: IpcRendererEvent, state: AppState) => callback(state);
    ipcRenderer.on("init", subscription);
    return () => ipcRenderer.removeListener("init", subscription);
  },
  
  onNewFile: (callback: (state: AppState) => void) => {
    const subscription = (_event: IpcRendererEvent, state: AppState) => callback(state);
    ipcRenderer.on("new-file", subscription);
    return () => ipcRenderer.removeListener("new-file", subscription);
  },
  
  onFileOpened: (callback: (state: AppState) => void) => {
    const subscription = (_event: IpcRendererEvent, state: AppState) => callback(state);
    ipcRenderer.on("file-opened", subscription);
    return () => ipcRenderer.removeListener("file-opened", subscription);
  },
  
  onSvgUpdated: (callback: (svg: string) => void) => {
    const subscription = (_event: IpcRendererEvent, data: { svg: string }) => callback(data.svg);
    ipcRenderer.on("svg-updated", subscription);
    return () => ipcRenderer.removeListener("svg-updated", subscription);
  },
  
  onFileSaved: (callback: (state: AppState) => void) => {
    const subscription = (_event: IpcRendererEvent, state: AppState) => callback(state);
    ipcRenderer.on("file-saved", subscription);
    return () => ipcRenderer.removeListener("file-saved", subscription);
  },
  
  sendInput: (content: string) => ipcRenderer.invoke("ipc-input", { content }),
} as ElectronAPI);
