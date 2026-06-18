import { run_tasker } from "../src/run_tasker.ts";
import { project_cwd } from "./lib/read_cwd.ts";

try {
  const result = await run_tasker(project_cwd());
  console.log(result);
} catch (e) {
  console.error("Error while trying to run tasker");
  console.error(e);
}
