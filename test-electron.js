const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.loadFile('index.html');
    
    // 打开开发者工具
    mainWindow.webContents.openDevTools();
    
    // 监听页面加载完成
    mainWindow.webContents.once('dom-ready', () => {
        console.log('页面加载完成，检查元素...');
        
        // 检查激活界面元素
        mainWindow.webContents.executeJavaScript(`
            const activationScreen = document.getElementById('activation-screen');
            const mainApp = document.getElementById('main-app');
            
            console.log('激活界面元素:', !!activationScreen);
            console.log('主应用元素:', !!mainApp);
            
            if (activationScreen) {
                console.log('激活界面显示状态:', activationScreen.style.display);
                console.log('激活界面计算样式:', window.getComputedStyle(activationScreen).display);
            }
            
            if (mainApp) {
                console.log('主应用显示状态:', mainApp.style.display);
                console.log('主应用计算样式:', window.getComputedStyle(mainApp).display);
            }
            
            // 强制显示激活界面
            if (activationScreen && mainApp) {
                activationScreen.style.display = 'flex';
                mainApp.style.display = 'none';
                console.log('强制显示激活界面');
            }
        `);
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
