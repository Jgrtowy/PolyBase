// biome-ignore lint/suspicious/noExplicitAny:
export default (channel: string, data: any) => {
    // biome-ignore lint/suspicious/noExplicitAny:
    return new Promise<any>((resolve, reject) => {
        window.ipc.send(channel, data);
        window.ipc.on(channel, (event, arg) => {
            resolve(event);
        });
        return () => {
            window.ipc.removeAllListeners(channel);
        };
    });
};
