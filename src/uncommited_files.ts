import { execSync } from "child_process";
import { join } from "path";

export const find_uncommitted = (
  file: "plan.md" | "tasks.md",
  cwd: string,
): string | null => {
  const output = execSync("git status --porcelain", {
    cwd,
    encoding: "utf-8",
  });

  const matches = output.split("\n").filter((line) => line.includes(file));
  if (matches.length === 0) {
    return null;
  }
  if (matches.length !== 1) {
    throw new Error(`Confused! More than 1 possible ${file}`);
  }
  return join(cwd, matches[0].substring(3));
};
