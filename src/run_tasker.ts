import { readFileSync } from "fs";
import { run_claude } from "./run_claude.ts";
import { find_uncommitted } from "./uncommited_files.ts";

export const run_tasker = async (cwd: string) => {
  // if there is already a tasks file, this must be a review tasker
  if (find_uncommitted("tasks.md", cwd)) {
    return await run_review_tasker(cwd);
  }
  // no tasks yet, but a plan.md => this is for the first / plan tasker
  else if (find_uncommitted("plan.md", cwd)) {
    return await run_plan_tasker(cwd);
  }
  throw new Error("no plan.md or tasks.md found");
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
