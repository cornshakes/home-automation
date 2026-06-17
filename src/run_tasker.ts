import { readFileSync } from "fs";
import { run_claude } from "./run_claude.ts";
import { find_tasks_file } from "./run_coders.ts";
import { execSync } from "child_process";

const md_exists = (cwd: string, md: "plan.md" | "tasks.md") => {
  try {
    execSync("git status --porcelain | grep " + md, {
      cwd,
      encoding: "utf-8",
    });
    return true;
  } catch {
    return false;
  }
};

export const run_tasker = async (cwd: string) => {
  // if there is already a tasks file, this must be a review tasker
  if (md_exists(cwd, "tasks.md")) {
    return await run_review_tasker(cwd);
  }
  // no tasks yet, but a plan.md => this is for the first / plan tasker
  else if (md_exists(cwd, "plan.md")) {
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
