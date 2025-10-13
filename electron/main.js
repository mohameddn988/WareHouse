// electron/main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // In dev mode, load Next.js; in prod, load local files
  const startUrl = process.env.ELECTRON_START_URL || "http://localhost:3000";
  win.loadURL(startUrl);
  win.setMenu(null);
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
