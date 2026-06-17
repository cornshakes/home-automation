import { run_coders } from "../src/run_coders.ts";
import { run_reviewer } from "../src/run_reviewer.ts";
import { run_tasker } from "../src/run_tasker.ts";
import { project_cwd } from "./lib/read_cwd.ts";

const cwd = project_cwd();

while (true) {
  const tasker_result = await run_tasker(cwd);
  console.log(tasker_result);
  if (!tasker_result.stdout.trimEnd().endsWith("<Tasker success>")) {
    throw new Error("tasker success expected");
  }

  const coders_result = await run_coders(cwd);
  console.log(coders_result);
  if (coders_result.status !== "success") {
    throw new Error("coders success expected");
  }

  const reviewer_result = await run_reviewer(cwd);
  console.log(reviewer_result);
  if (reviewer_result.stdout.trimEnd().endsWith("<Review disapprove>")) {
    continue;
  }
  if (!reviewer_result.stdout.trimEnd().endsWith("<Review approve>")) {
    throw new Error("review disapprove/approve expected");
  }
}
