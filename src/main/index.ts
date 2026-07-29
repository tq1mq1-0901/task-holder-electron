import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    // 初期値は800x600(width x height)、下記はひな形の標準
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    // コードの中身の権限、制限
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'), // 「ビルド後」の指定
      sandbox: false, // preload内でNode.jsを制限するか
      nodeIntegration: false, // renderer内でNode.jsを使用を許可するか
      contextIsolation: true // preloadとrendererを隔離するか。(preloadがNode環境の場合隔離していない場合攻撃される。今回まさにそう。)
    }
  })

  mainWindow.maximize()

  // onメソッドの第一引数にはいろいろイベントが入る。
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  // 起動時に更新をチェックし、あればダウンロードして通知する(開発時は実行しない)
  if (!is.dev) {
    autoUpdater.checkForUpdatesAndNotify()
  }

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
