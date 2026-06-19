import { last } from "es-toolkit";
import { run_coders } from "../src/run_coders.ts";
import { run_reviewer } from "../src/run_reviewer.ts";
import { run_plan_tasker, run_review_tasker } from "../src/run_tasker.ts";
import {
  count_review_sections,
  find_review_verdicts,
  find_uncommitted,
  parse_tasks,
  xcexc,
} from "../src/uncommited_files.ts";
import { project_cwd } from "./lib/read_cwd.ts";

const has_todo_tasks = () => {
  return !!parse_tasks().find((t) => !t.done);
};

const create_commit = () => {
  const branch_name = xcexc("git branch --show-current");
  const review_count = find_review_verdicts().length;
  xcexc(`git add .`);
  xcexc(`git commit -m "${branch_name}-review-${review_count}"`);
};

const maybe_run_coders = async () => {
  if (has_todo_tasks()) {
    const coders_result = await run_coders();
    console.log(coders_result);
    if (coders_result.status !== "success") {
      throw new Error("coders success expected");
    }
  }
};

const maybe_run_review_tasker = async () => {
  const verdicts = find_review_verdicts();
  if (
    last(verdicts) === "Disapprove" &&
    count_review_sections() === verdicts.length - 1
  ) {
    // if the last verdict is disapproving but there is no tasks section for it yet, run the tasker
    const tasker_result = await run_review_tasker(project_cwd());
    console.log(tasker_result);
    if (!tasker_result.stdout.trimEnd().endsWith("<Tasker success>")) {
      throw new Error("tasker success expected");
    }
  }
};

const maybe_run_reviewer = async () => {
  const verdicts = find_review_verdicts();
  if (!has_todo_tasks() && count_review_sections() === verdicts.length) {
    // there are sections for every review so far and there are no more todo tasks left, run the reviewer
    const reviewer_result = await run_reviewer(project_cwd());
    console.log(reviewer_result);
    if (
      reviewer_result.stdout.trimEnd().endsWith("<Review disapprove>") ||
      reviewer_result.stdout.trimEnd().endsWith("<Review approve>")
    ) {
      // TODO this breaks all my prev assumptions about newly added plan.md files etc.
      // oops
      // create_commit();
    } else {
      throw new Error("review disapprove/approve expected");
    }
  }
};

const plan_md = find_uncommitted("plan.md");
if (!plan_md) {
  throw new Error("no plan.md file found in " + project_cwd());
}

const tasks_md = find_uncommitted("tasks.md");
if (!tasks_md) {
  const tasker_result = await run_plan_tasker(project_cwd());
  console.log(tasker_result);
}

for (let i = 0; i < 5; i++) {
  await maybe_run_coders();
  await maybe_run_reviewer();
  if (last(find_review_verdicts()) === "Approve") {
    console.log("Apparently it worked for some reason. Congratulations");
    process.exit(0);
  }
  await maybe_run_review_tasker();
  if (i === 4) {
    throw new Error("that's too many rounds. stop.");
  }
}
