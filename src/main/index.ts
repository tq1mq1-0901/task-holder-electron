import { app, shell, BrowserWindow } from 'electron'
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
    // webPreferences -> コードの中身の権限、制限
    // preload -> urlは「ビルド後」のものを指定
    // sandbox -> preload内でNode.jsを制限しない
    // nodeIntegration -> renderer内でNode.jsを使用を許可しない
    // contextIsoration -> preloadとrendererを隔離。(preloadがNode環境の場合推奨)
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  mainWindow.maximize()

  // onメソッドの第一引数にはいろいろイベントが入る。
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // windowの中でページ遷移する時、新規ネイティブwindowを作ってしまう。
  // 挙動を決めるのがsetWindowOpenHandler(detailsはページ遷移時の情報)
  // shell.openExternalでdetails.urlをos標準規定ブラウザで開く
  // 'deny'にすることでネイティブwindowの作成拒否。逆は'allow'
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // is.devはdev環境かどうかを真偽値で持つ
  // process.env[~~~]は開発サーバーが起動しているか
  // loadURL -> ブラウザ検索バーにURL打つのと同じ
  // loadFile -> build後のzipやasarなどのアーカイブファイルはoutのディレクトリ構成で参照できる
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// app -> アプリのライフサイクルを管理するオブジェクト(open, close)
// setAppUserModelId -> windows内一意に特定できる名前setter(他osには無関係)
// app.on('browser-window-created, ~~~) -> window作成時の処理登録
// window -> 作られたwindowに関しての情報(like webContents)
// watchWindowShortcuts(window) -> 下記コメント通りの設定反映
// ipcMain.on('ping') -> rendererとmainをつなぐ特殊なもの。renderer側でwindow.electron.ipcRederer.send('ping')でmain側の中の処理が発火。
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.tq1mq1-0901.taskholder')

  app.on('browser-window-created', (_, window) => {
    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    optimizer.watchWindowShortcuts(window)
  })

  // ipcMain.on('ping', () => console.log('pong')) rendererで呼ぶコードがないのでコメント化

  createWindow()

  // 起動時に更新をチェックし、あればダウンロードして通知する(開発時は実行しない)
  if (!is.dev) {
    autoUpdater.checkForUpdatesAndNotify()
  }

  // activateはmacでのDock押下時発火イベント。windowをすべて閉じてもDockというものにアプリが生き続けてしまうという慣習があるゆえの設定。
  // getAllWindows() -> 開いているwindowの数を参照。BrowserWindowクラスが持つメソッド。
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 文字通りそのアプリのすべてのwindowが閉じられたら発火
// darwin <=> macOS
// app.quit() -> アプリケーション自体を終了
// activeと続く話になるが、windows,linuxではwindowを閉じたらアプリ終了
// macOSに関してはmenuBarやDockにアプリを生かし続けるというのが慣習(appとwindowを別概念として扱う)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
