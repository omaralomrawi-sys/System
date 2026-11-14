const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('fsApi', {
  places: () => ipcRenderer.invoke('places'),
  chain: p => ipcRenderer.invoke('chain', p),
  list: p => ipcRenderer.invoke('list', p),
  read: p => ipcRenderer.invoke('read', p)
});
