const { app, BrowserWindow: BW, ipcMain, Menu } = require('electron');
const path = require('path');
require('dotenv').config();

let mainWindow = null;

function createWindow() {
  mainWindow = new BW({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (!mainWindow) return;

  // Remove the default application menu so the menu bar (File/Edit/View/Window/Help)
  // does not appear. Keep a hidden menu bar in case Alt is pressed (autoHideMenuBar).
  try {
    Menu.setApplicationMenu(null);
    // Ensure the menu bar is not visible by default
    if (typeof mainWindow.setMenuBarVisibility === 'function') {
      mainWindow.setMenuBarVisibility(false);
    }
  } catch (e) {
    // If Menu isn't available or an error occurs, continue without throwing
    // This keeps behavior safe for environments where Menu operations differ.
  }

  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    // In dev: load the Next.js dev server
    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.webContents.openDevTools(); // Commented out to prevent auto-opening dev tools
  } else {
    // In prod: load the built Next.js static files
    const indexPath = path.join(__dirname, '..', 'next', 'out', 'index.html');
    mainWindow.loadFile(indexPath);
  }

  mainWindow.maximize();
  mainWindow.show();

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