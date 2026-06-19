import { readFileSync } from "node:fs";
import {
  run_claude,
  type RunClaudeResult,
  type RunClaudeSettings,
} from "./run_claude.ts";
import { find_uncommitted, parse_tasks } from "./uncommited_files.ts";
import { project_cwd } from "../scripts/lib/read_cwd.ts";

export type CodersResult = {
  /** how the run ended */
  status: /** all tasks completed */
    | "success"
    /** a task is tagged [other], there's no coder for that */
    | "needs_other"
    /** a coder needs something to be able to complete its task */
    | "coder_need"
    /** there was an unexpected error */
    | "error";
  /** a more descriptive message */
  message: string;
  /** A list of all single coder run results */
  results: RunClaudeResult[];
};

export const run_coders = async (): Promise<CodersResult> => {
  const results: RunClaudeResult[] = [];
  while (true) {
    const tasks = parse_tasks();
    const task = tasks.find((t) => !t.done);
    if (!task) {
      return { status: "success", message: "All tasks done", results };
    }
    if (task.tag === "other") {
      return {
        status: "needs_other",
        message: "The next task is tasked 'other'. What should be done?",
        results,
      };
    }

    const result = await run_coder(coder_settings[task.tag]);
    results.push(result);

    if (result.stdout.trimEnd().endsWith("error>")) {
      return {
        status: "error",
        message: "An unexpected error happened while running a coder",
        results,
      };
    }
    if (result.stdout.trimEnd().endsWith("need>")) {
      return {
        status: "coder_need",
        message: "A coder can't complete its task",
        results,
      };
    }

    const after = parse_tasks();
    const next_task = after.find((t) => !t.done);
    if (task.index === next_task?.index) {
      return {
        status: "error",
        message: "The Coder made no progress on its tasks",
        results,
      };
    }
  }
};

export type RunCoderSettings = Pick<
  RunClaudeSettings,
  "title" | "model" | "effort"
>;

const coder_settings: { [key: string]: RunCoderSettings } = {
  haiku: {
    title: "Haiku Coder",
    model: "haiku",
    effort: "medium",
  },
  sonnet: {
    title: "Sonnet Coder",
    model: "sonnet",
    effort: "high",
  },
};

export const run_coder = async ({ title, model, effort }: RunCoderSettings) => {
  return await run_claude({
    title,
    prompt: coder_prompt(model),
    cwd: project_cwd(),
    model,
    effort,
    allowed_tools: [
      "Write(**/*)",
      "Edit(**/*)",
      "Read(**/*)",
      "Bash(npm run check-fix)",
      "Bash(npm test)",
      "Bash(npm run test)",
      "Bash(npm run test:e2e)",
      "Bash(npm run test:e2e:update)",
    ],
  });
};

const coder_prompt = (tag: string) => {
  return readFileSync("./prompts/Coder.md", "utf-8").replaceAll("$TAG", tag);
};
