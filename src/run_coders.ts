import { readFileSync } from "node:fs";
import { run_claude, type RunClaudeResult } from "./run_claude.ts";
import { find_uncommitted } from "./uncommited_files.ts";

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

export const run_coders = async (cwd: string): Promise<CodersResult> => {
  const results: RunClaudeResult[] = [];
  while (true) {
    const tasks = parse_tasks(cwd);
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

    const result = await run_coder(task.tag, cwd);
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

    const after = parse_tasks(cwd);
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

export const run_coder = async (model: "haiku" | "sonnet", cwd: string) => {
  const title = `${model[0].toUpperCase()}${model.slice(1)} Medium Coder`;
  return await run_claude({
    title,
    prompt: coder_prompt(model),
    cwd,
    model,
    effort: "medium",
    allowed_tools: [
      "Write(**/*)",
      "Edit(**/*)",
      "Read(**/*)",
      "Bash(npm run check-fix)",
      "Bash(npm run test:*)",
    ],
  });
};

const parse_tasks = (cwd: string) => {
  const tasks_md_path = find_uncommitted("tasks.md", cwd);
  if (!tasks_md_path) {
    throw new Error("No uncommited tasks.md file found!");
  }

  const tasks = readFileSync(tasks_md_path, "utf-8")
    .split("\n")
    .map((line) => line.match(/^- \[( |x)\].*\[(haiku|sonnet|other)\]\s*$/))
    .filter((match) => !!match)
    .map((match, index) => ({
      index,
      done: match[1] === "x",
      tag: match[2] as "haiku" | "sonnet" | "other",
    }));

  if (tasks.length === 0) {
    throw new Error("No tasks could be parsed from tasks.md!");
  }
  return tasks;
};

const coder_prompt = (tag: string) => {
  return readFileSync("./prompts/Coder.md", "utf-8").replaceAll("$TAG", tag);
};
