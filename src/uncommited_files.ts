import { execSync } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Finds uncommitted files and filters them by name.includes(include_filter)
 */

export const find_uncommited_files = (include_filter: string, cwd: string) => {
  return execSync("git status --porcelain", {
    cwd,
    encoding: "utf-8",
  })
    .split("\n")
    .filter((line) => line.includes(include_filter))
    .map((line) => line.substring(3));
};

export const find_review_verdicts = (cwd: string) => {
  return find_uncommited_files("review-", cwd)
    .map((path) => readFileSync(path, "utf-8").split("\n")[0])
    .sort()
    .map((line) => line.match(/^# Review (\d): (Approve|Disapprove)\s*$/))
    .map((match, index) => {
      if (match === null) {
        throw new Error("Found review with invalid header line!");
      }
      const r_index = parseInt(match[0]);
      if (r_index !== index + 1) {
        throw new Error(
          `Review Number (${r_index}) does not match position (${index + 1}) in review files!`,
        );
      }
      return match[1];
    });
};

/**
 * Finds uncommitted plan.md / tasks.md file. Throws if there is more than 1.
 */
export const find_uncommitted = (
  file: "plan.md" | "tasks.md",
  cwd: string,
): string | null => {
  const files = find_uncommited_files(file, cwd);
  if (files.length === 0) {
    return null;
  }
  if (files.length !== 1) {
    throw new Error(`Confused! More than 1 possible ${file}`);
  }
  return join(cwd, files[0]);
};

/**
 * Returns the number of review sections in the toc of a tasks.md
 */
export const count_review_sections = (cwd: string) => {
  const tasks_md_path = find_uncommitted("tasks.md", cwd)!;
  return readFileSync(tasks_md_path, "utf-8")
    .split("\n")
    .map((line) => line.match(/^Review (\d)\s*$/))
    .filter((match) => !!match).length;
};

/**
 * Returns the tasks in the toc of a tasks.md
 */
export const parse_tasks = (cwd: string) => {
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
