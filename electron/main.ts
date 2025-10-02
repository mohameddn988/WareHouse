import type { BrowserWindow } from 'electron';

const { app, BrowserWindow: BW, ipcMain } = require('electron');
const path = require('path');

let mainWindow: BrowserWindow | null;

function createWindow(): void {
  mainWindow = new BW({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
    },
  });

  if (!mainWindow) return;

  const isDev: boolean = process.env.NODE_ENV === 'development';

  if (isDev) {
    // In dev: load the Next.js dev server
    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.webContents.openDevTools(); // Commented out to prevent auto-opening dev tools
  } else {
    // In prod: load the built Next.js static files
    const indexPath: string = path.join(__dirname, '..', 'next', 'out', 'index.html');
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

// IPC handlers
ipcMain.handle('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.handle('open-dev-tools', () => {
  if (mainWindow) {
    mainWindow.webContents.openDevTools();
  }
});
