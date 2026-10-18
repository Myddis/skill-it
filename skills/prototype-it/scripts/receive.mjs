// Waits for one POST from capture.js running in the browser, writes its body to the output file, then exits.
// Usage: node receive.mjs <output.html> [port]
import { createServer } from "node:http";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const [outFile, port = "4799"] = process.argv.slice(2);
if (!outFile) {
  console.error("usage: node receive.mjs <output.html> [port]");
  process.exit(1);
}
const target = resolve(outFile);

const server = createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Private-Network", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method !== "POST") {
    res.writeHead(204).end();
    return;
  }
  const chunks = [];
  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", () => {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, Buffer.concat(chunks));
    res.writeHead(200).end("saved");
    console.log(`saved ${target}`);
    server.close();
  });
});

server.listen(Number(port), "127.0.0.1", () => {
  console.log(`waiting on http://127.0.0.1:${port}/`);
});
