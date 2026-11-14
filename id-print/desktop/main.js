// ID Print – Electron shell: gives the web app full access to the computer's files (Desktop, Documents, drives…).
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const FILE_RE = /\.(jpe?g|png|webp|bmp|gif|pdf)$/i;

function createWindow() {
  const win = new BrowserWindow({
    width: 1500, height: 920, minWidth: 1000, minHeight: 640,
    title: 'ID Print', autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  win.loadFile(path.join(__dirname, 'app', 'index.html'));
}

ipcMain.handle('places', () => {
  const out = [];
  for (const key of ['desktop', 'documents', 'downloads', 'pictures', 'home']) {
    try { out.push({ key, path: app.getPath(key) }); } catch (e) {}
  }
  if (process.platform === 'win32') {
    for (let c = 67; c <= 90; c++) { // C: … Z:
      const d = String.fromCharCode(c) + ':\\';
      try { if (fs.existsSync(d)) out.push({ name: d, path: d, drive: true }); } catch (e) {}
    }
  }
  return out;
});

ipcMain.handle('chain', (_e, p) => {
  const parts = [];
  let cur = path.resolve(p);
  for (let i = 0; i < 64; i++) {
    parts.unshift({ name: path.basename(cur) || cur, path: cur });
    const up = path.dirname(cur);
    if (up === cur) break;
    cur = up;
  }
  return parts;
});

ipcMain.handle('list', async (_e, p) => {
  const dirs = [], files = [];
  for (const d of await fs.promises.readdir(p, { withFileTypes: true })) {
    if (d.name.startsWith('.')) continue;
    const full = path.join(p, d.name);
    if (d.isDirectory()) dirs.push({ name: d.name, path: full });
    else if (d.isFile() && FILE_RE.test(d.name)) files.push({ name: d.name, path: full });
    else if (d.isSymbolicLink()) {
      try { const st = await fs.promises.stat(full); if (st.isDirectory()) dirs.push({ name: d.name, path: full }); else if (FILE_RE.test(d.name)) files.push({ name: d.name, path: full }); } catch (e) {}
    }
  }
  return { dirs, files };
});

ipcMain.handle('read', async (_e, p) => {
  if (!FILE_RE.test(p)) throw new Error('unsupported file type');
  return await fs.promises.readFile(p); // Buffer -> Uint8Array in the renderer
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
