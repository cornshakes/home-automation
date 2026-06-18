import { run_coders } from "../src/run_coders.ts";
import { project_cwd } from "./lib/read_cwd.ts";

try {
  const result = await run_coders(project_cwd());
  console.log(result);
} catch (e) {
  console.error("Error while trying to run coders");
  console.error(e);
}
