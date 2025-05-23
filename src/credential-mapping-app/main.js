const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const express = require('express');
let expressServer = null;
let expressApp = null;
const SERVER_PORT = 32192;

// File paths
function getMapFilePath() {
  const isPackaged = app.isPackaged;
  const baseDir = isPackaged ? path.dirname(process.execPath) : process.cwd();
  return path.resolve(baseDir, 'credentials-map.json');
}
function getTypesFilePath() {
  const isPackaged = app.isPackaged;
  const baseDir = isPackaged ? path.dirname(process.execPath) : process.cwd();
  return path.resolve(baseDir, 'credential-types.json');
}
let MAP_FILE = getMapFilePath();
let TYPES_FILE = getTypesFilePath();

let mainWindow;

function ensureMappingFiles() {
  MAP_FILE = getMapFilePath();
  TYPES_FILE = getTypesFilePath();
  if (!fs.existsSync(MAP_FILE)) {
    fs.writeFileSync(MAP_FILE, '{}');
  }
  if (!fs.existsSync(TYPES_FILE)) {
    fs.writeFileSync(TYPES_FILE, JSON.stringify({ types: [], typeStates: {} }, null, 2));
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    title: 'Credential Mapping Manager',
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', function () {
    mainWindow = null;
    stopExpressServer();
  });
}

app.on('ready', () => {
  ensureMappingFiles();
  createWindow();
});

app.on('window-all-closed', (e) => {
  e.preventDefault();
  stopExpressServer(() => {
    if (process.platform !== 'darwin') app.exit(0);
  });
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

app.on('before-quit', (e) => {
  e.preventDefault();
  stopExpressServer(() => {
    app.exit(0);
  });
});

// --- Express Server Integration ---
function startExpressServer() {
  if (expressServer) return { error: 'Server already running.' };
  expressApp = express();
  expressApp.use(express.json());
  expressApp.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  });
  // New /map endpoint for bookmarklet: only id and name
  expressApp.post('/map', (req, res) => {
    const { id, name } = req.body;
    if (!id || !name) {
      return res.status(400).json({ success: false, message: 'Missing id or name' });
    }
    // Send to renderer for type selection
    if (mainWindow) {
      mainWindow.webContents.send('incoming-mapping', { id, name });
    }
    res.json({ success: true, message: 'Mapping received, select type in app.' });
  });
  expressServer = expressApp.listen(SERVER_PORT, () => {
    console.log(`Credential mapping server running on http://localhost:${SERVER_PORT}`);
    if (mainWindow) {
      mainWindow.webContents.send('server-status', { running: true });
    }
  });
  return { success: true };
}

function stopExpressServer(callback) {
  if (expressServer) {
    expressServer.close(() => {
      expressServer = null;
      if (mainWindow) {
        mainWindow.webContents.send('server-status', { running: false });
      }
      if (callback) callback();
    });
    return { success: true };
  }
  if (callback) callback();
  return { error: 'Server not running.' };
}

// --- IPC Handlers ---

ipcMain.handle('get-mappings', async () => {
  try {
    ensureMappingFiles();
    const data = fs.readFileSync(MAP_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return { error: 'Failed to read mapping file.' };
  }
});

ipcMain.handle('get-types', async () => {
  try {
    ensureMappingFiles();
    const data = fs.readFileSync(TYPES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return { error: 'Failed to read types file.' };
  }
});

ipcMain.handle('save-mapping', async (event, { type, id, name }) => {
  try {
    ensureMappingFiles();
    let mappings = {};
    if (fs.existsSync(MAP_FILE)) {
      mappings = JSON.parse(fs.readFileSync(MAP_FILE, 'utf-8'));
    }
    mappings[type] = { id, name };
    fs.writeFileSync(MAP_FILE, JSON.stringify(mappings, null, 2));
    return { success: true };
  } catch (e) {
    return { error: 'Failed to save mapping.' };
  }
});

ipcMain.handle('delete-mapping', async (event, type) => {
  try {
    ensureMappingFiles();
    const mappings = JSON.parse(fs.readFileSync(MAP_FILE, 'utf-8'));
    delete mappings[type];
    fs.writeFileSync(MAP_FILE, JSON.stringify(mappings, null, 2));
    return { success: true };
  } catch (e) {
    return { error: 'Failed to delete mapping.' };
  }
});

ipcMain.handle('save-types', async (event, { types, typeStates }) => {
  try {
    ensureMappingFiles();
    const data = { types, typeStates };
    fs.writeFileSync(TYPES_FILE, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (e) {
    return { error: 'Failed to save types.' };
  }
});

ipcMain.handle('reload-map-file', () => {
  MAP_FILE = getMapFilePath();
  TYPES_FILE = getTypesFilePath();
  return { success: true };
});

ipcMain.handle('start-server', () => startExpressServer());
ipcMain.handle('stop-server', () => stopExpressServer());
ipcMain.handle('get-server-status', () => ({ running: !!expressServer })); 