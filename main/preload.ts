import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron";

const handler = {
    send(channel: string, value: unknown) {
        ipcRenderer.send(channel, value);
    },
    async on(channel: string, callback: (...args: unknown[]) => void) {
        const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => callback(...args);
        ipcRenderer.on(channel, subscription);
    },
    async removeAllListeners(channel: string) {
        ipcRenderer.removeAllListeners(channel);
    },
};

contextBridge.exposeInMainWorld("ipc", handler);

export type IpcHandler = typeof handler;
