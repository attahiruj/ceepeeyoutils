import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { isDev, getPreloadPath } from "./util.js";
import { getStaticData, pollResource } from "./resourceManager.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:1738");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "dist/ui/index.html"));
  }

  pollResource(mainWindow);

  ipcMain.handle("getStaticData", () => {
    return getStaticData();
  });
});
