import { createConnection } from "node:net";

function isPortOpen(port: number) {
  return new Promise<boolean>((resolve) => {
    const socket = createConnection({ host: "127.0.0.1", port });
    const finish = (open: boolean) => {
      socket.destroy();
      resolve(open);
    };

    socket.setTimeout(1_500);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}

async function main() {
  const port = Number(process.env.PORT ?? "3000");
  const url = `http://127.0.0.1:${port}`;

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  if (await isPortOpen(port)) {
    console.error(`Stillway is already using port ${port}.`);
    console.error(`Open ${url}, or stop the existing server with Ctrl+C before rebuilding.`);
    console.error("This safety check prevents a live Next.js server from serving mismatched build chunks.");
    process.exitCode = 1;
    return;
  }

  console.log(`Port ${port} is clear. Preparing a fresh Stillway production build.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
