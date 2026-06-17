import { run_reviewer } from "../src/run_reviewer.ts";
import { project_cwd } from "./lib/read_cwd.ts";

const cwd = project_cwd();

try {
  const result = await run_reviewer(cwd);
  console.log(result);
} catch (e) {
  console.error("Error while trying to run reviewer");
  console.error(e);
}
