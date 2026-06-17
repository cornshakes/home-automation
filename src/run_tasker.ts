import { readFileSync } from "fs";
import { run_claude } from "./run_claude.ts";
import { find_tasks_file } from "./run_coders.ts";

export const run_tasker = async (cwd: string) => {
  try {
    // if there is already a tasks file, this must be a review tasker
    find_tasks_file(cwd);
    return await run_review_tasker(cwd);
  } catch (e) {
    // if there isn't, this is for the first / plan tasker
    if ((e as Error).message === "No git-dirty tasks.md found") {
      return await run_plan_tasker(cwd);
    }
    throw e;
  }
};

export const run_plan_tasker = async (cwd: string) => {
  return await run_claude({
    title: "Tasker",
    prompt: readFileSync("./prompts/Tasker.md", "utf-8"),
    cwd,
    model: "sonnet",
    effort: "high",
    allowed_tools: ["Write(**/*)", "Edit(**/*)", "Read(**/*)"],
  });
};

export const run_review_tasker = async (cwd: string) => {
  return await run_claude({
    title: "Review Tasker",
    prompt: readFileSync("./prompts/Review-Tasker.md", "utf-8"),
    cwd,
    model: "sonnet",
    effort: "medium",
    allowed_tools: ["Write(**/*)", "Edit(**/*)", "Read(**/*)"],
  });
};
