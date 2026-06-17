import { exec } from "node:child_process";

export type RunClaudeSettings = {
  /** The title of this command for printing */
  title: string;
  /** The prompt to send to the agent */
  prompt: string;
  /** The model to use */
  model: "haiku" | "sonnet" | "opus";
  /** The effort setting to use */
  effort: "low" | "medium" | "high" | "xhigh" | "max";
  /** The cwd can be given as an absolute or relative (to this project) path */
  cwd: string;
  /** A list of tool names to allow e.g. "Bash(git *)", "Edit". All other tools are disallowed. */
  allowed_tools: string[];
};

export type RunClaudeResult = {
  /** the exit code of the claude process. undefined means: not set. null/number means exit code was set by exec. */
  exit_code?: number | null | undefined;
  /** the error received from exec on error. */
  error?: Error;
  /** the stdout output of the claude process. */
  stdout: string;
  /** the stderr output of the claude process. */
  stderr: string;
};

export const run_claude = async (settings: RunClaudeSettings) => {
  console.log("running claude instance:", settings.title);
  return await new Promise<RunClaudeResult>((resolve) => {
    const child = exec(stringify(settings), {
      cwd: settings.cwd,
      maxBuffer: 50 * 1024 * 1024,
    });

    const response = {
      stdout: "",
      stderr: "",
    };

    child.stdin?.end(); // Close stdin so claude doesn't wait for input
    child.stdout?.on("data", (chunk: string) => (response.stdout += chunk));
    child.stderr?.on("data", (chunk: string) => (response.stderr += chunk));
    child.on("error", (error) => resolve({ ...response, error }));
    child.on("close", (exit_code) => resolve({ ...response, exit_code }));
  });
};

const stringify = ({
  prompt,
  model,
  effort,
  allowed_tools,
}: RunClaudeSettings) => {
  if (prompt.includes('"')) {
    throw new Error("Prompt can not include double quotes");
  }
  return [
    "claude",
    // Print response and exit / non-interactive
    "-p",
    // Sessions will not be saved to disk and cannot be resumed
    "--no-session-persistence",
    // Disable Claude in Chrome integration
    "--no-chrome",
    // all permissions not explicitly granted in --allowed-tools are denied.
    "--permission-mode dontAsk",
    `--allowed-tools "${allowed_tools.join(",")}"`,
    `--model ${model}`,
    `--effort ${effort}`,
    `"${prompt.replace("\n", "\\\n")}"`,
  ].join(" ");
};
