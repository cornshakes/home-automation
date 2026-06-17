import { run_tasker } from "../src/run_tasker.ts";
import { project_cwd } from "./lib/read_cwd.ts";

const cwd = project_cwd();

try {
  const result = await run_tasker(cwd);
  console.log(result);
} catch (e) {
  console.error("Error while trying to run tasker");
  console.error(e);
}
