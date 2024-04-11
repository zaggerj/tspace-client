import { BrowserWindow, app, MessageChannelMain } from 'electron'
app.whenReady().then(async () => {
  // 创建窗口
  const mainWindow = new BrowserWindow({
    show: false,
    webPreferences: { contextIsolation: false, preload: 'preloadMain.js' }
  })
  const secondaryWindow = new BrowserWindow({
    show: false,
    webPreferences: { contextIsolation: false, preload: 'preloadSecondary.js' }
  })
  // 建立通道
  const { port1, port2 } = new MessageChannelMain()
  // webContents准备就绪后，使用postMessage向每个webContents发送一个端口。
  mainWindow.once('ready-to-show', () => {
    mainWindow.webContents.postMessage('port', null, [port1])
  })
  secondaryWindow.once('ready-to-show', () => {
    secondaryWindow.webContents.postMessage('port', null, [port2])
  })
})

//
// mainWindow
port1.onmessage = (event) => {
  console.log('received result:', event.data)
}
port1.postMessage('我是渲染进程一发送的消息')
// secondaryWindow
port2.onmessage = (event) => {
  console.log('received result:', event.data)
}
port2.postMessage('我是渲染进程二发送的消息')

// preloadMain.js
// preloadSecondary.js
const { ipcRenderer } = require('electron')
ipcRenderer.on('port', (e) => {
  // 接收到端口，使其全局可用。
  window.electronMessagePort = e.ports[0]
  window.electronMessagePort.onmessage = (messageEvent) => {
    // 处理消息
  }
})

// mainWindow renderer.js
// 在 renderer 的任何地方都可以调用 postMessage 向另一个进程发送消息 w
window.electronMessagePort.postMessage('ping')
