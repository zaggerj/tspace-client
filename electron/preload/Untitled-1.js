// main.js
// window 1
function createWindow1() {
  window1 = new BrowserWindow({ width: 800, height: 600 })
  window1.loadURL('window1.html')
  window1.on('closed', function () {
    window1 = null
  })
  return window1
}
// window 2
function createWindow2() {
  window2 = new BrowserWindow({ width: 800, height: 600 })
  window2.loadURL('window2.html')
  window2.on('closed', function () {
    window2 = null
  })
  return window2
}
app.on('ready', () => {
  createWindow1()
  createWindow2()
  ipcMain.on('win1-msg', (event, arg) => {
    // 这条消息来自 window 1
    console.log('name inside main process is: ', arg)
    // 发送给 window 2 的消息.
    window2.webContents.send('forWin2', arg)
  })
})

// win2
ipcRenderer.on('forWin2', function (event, arg) {
  console.log(arg)
})

// win1
ipcRenderer.send('win1-msg', 'msg from win1')
