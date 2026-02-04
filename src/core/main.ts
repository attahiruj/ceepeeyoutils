import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./util.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({});

  if (isDev()) {
    mainWindow.loadURL("http://localhost:1738");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "dist/ui/index.html"));

  }
});
