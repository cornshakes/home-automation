import { readFileSync } from "fs";
import { run_claude } from "./run_claude.ts";

export const run_reviewer = async (cwd: string) => {
  return await run_claude({
    title: "Reviewer",
    prompt: readFileSync("./prompts/Reviewer.md", "utf-8"),
    cwd,
    model: "sonnet",
    effort: "high",
    allowed_tools: [
      "Write(**/*)",
      "Edit(**/*)",
      "Read(**/*)",
      "Bash(npm run check)",
      "Bash(npm test)",
      "Bash(npm run test:e2e)",
    ],
  });
};
