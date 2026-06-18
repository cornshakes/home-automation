import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Reads the cwd from the first command line argument.
 * It can be given as an absolute or relative path.
 *
 * @returns the absolute path for the cwd
 */
export const project_cwd = () => {
  const cwd_arg = process.argv[2];
  if (!cwd_arg) {
    throw new Error(
      "a project cwd for claude to run in must be provided as an argument (absolute or relative path)",
    );
  }
  const path = resolve(process.cwd(), cwd_arg);

  if (!existsSync(path)) {
    throw "Directory doesnt exist: " + path;
  }

  if (!statSync(path).isDirectory()) {
    throw "Not a directory: " + path;
  }

  return path;
};
