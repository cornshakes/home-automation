import { run_reviewer } from "../src/run_reviewer.ts";
import { project_cwd } from "./lib/read_cwd.ts";

try {
  const result = await run_reviewer(project_cwd());
  console.log(result);
} catch (e) {
  console.error("Error while trying to run reviewer");
  console.error(e);
}
