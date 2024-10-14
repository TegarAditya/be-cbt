import { spawn } from "bun";
import { AVAILABLE_CPU_COUNT } from "@/constants/cpu";

const MAX_CPU_COUNT = Number(process.env.MAX_CPUS) || navigator.hardwareConcurrency;
const cpus = MAX_CPU_COUNT > AVAILABLE_CPU_COUNT ? AVAILABLE_CPU_COUNT : MAX_CPU_COUNT;
const buns = new Array(cpus);

for (let i = 0; i < cpus; i++) {
  buns[i] = spawn({
    cmd: ["bun", "./src/index.ts"],
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
  });
}

function kill() {
  for (const bun of buns) {
    bun.kill();
  }
}

process.on("SIGINT", kill);
process.on("exit", kill);