import osUtils from "os-utils";
import fs from "fs";
import os from "os";
import { BrowserWindow } from "electron";

const POLL_INTERVAL = 500;

export function pollResource(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpu_usage = await getCpuUsage();
    const ram_usage = getRamUsage();
    const storage_usage = getStorageData();

    mainWindow.webContents.send("statistics", {
      cpu_usage,
      ram_usage,
      storage_usage: storage_usage.used,
    });
  }, POLL_INTERVAL);
}

export function getStaticData() {
  const total_storage = getStorageData().total;
  const total_memory = Math.floor(osUtils.totalmem() / 1024);
  const cpu_model = os.cpus()[0].model;

  return {
    total_storage: total_storage,
    total_memory: total_memory,
    cpu_model: cpu_model,
  };
}

function getCpuUsage() {
  return new Promise((resolve) => {
    osUtils.cpuUsage(resolve);
  });
}

function getRamUsage() {
  return 1 - osUtils.freememPercentage();
}

function getStorageData() {
  const path = process.platform === "win32" ? "C://" : "/";
  const stats = fs.statfsSync(path);
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;

  return {
    total: Math.floor(total / 1_000_000_000),
    used: Math.floor(((total - free) / total) * 100) / 100,
  };
}
