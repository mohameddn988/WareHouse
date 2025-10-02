const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example: minimize window
  minimize: () => ipcRenderer.invoke('minimize-window'),
  // Example: close window
  close: () => ipcRenderer.invoke('close-window'),
  // Open dev tools
  openDevTools: () => ipcRenderer.invoke('open-dev-tools'),
});