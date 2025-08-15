import { mkdirSync, renameSync, rmSync, existsSync } from "node:fs";
import { dirname } from "node:path";

const from = "dist/not_found/index.html";
const to = "dist/not_found.html";

if (existsSync(from)) {
  mkdirSync(dirname(to), { recursive: true });
  renameSync(from, to);
  rmSync("dist/not_found", { recursive: true, force: true });
}
