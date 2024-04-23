import { app, ipcMain } from "electron";
import serve from "electron-serve";
import path from "node:path";
import { createWindow } from "./helpers";
import initializeIpc from "./initializeIpc";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
    serve({ directory: "app" });
} else {
    app.setPath("userData", `${app.getPath("userData")} (development)`);
}
(async () => {
    await app.whenReady();

    const mainWindow = createWindow("main", {
        width: 1280,
        height: 720,
        minWidth: 1280,
        minHeight: 720,
        movable: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        frame: false,
        icon: path.join(__dirname, "../resources/icon.ico"),
    });

    initializeIpc();

    ipcMain.on("window", async (event, arg: string) => {
        if (arg === "quit") {
            mainWindow.close();
        }
        if (arg === "minimize") {
            mainWindow.minimize();
        }
        if (arg === "maximize") {
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize();
            } else {
                mainWindow.maximize();
            }
        }
    });

    if (isProd) {
        await mainWindow.loadURL("app://./home");
    } else {
        const port = process.argv[2];
        await mainWindow.loadURL(`http://localhost:${port}/home`);
        mainWindow.webContents.openDevTools();
    }
})();

app.on("window-all-closed", () => {
    app.quit();
});
