import { readFileSync } from "node:fs";
import { run_claude, type RunClaudeResult } from "./run_claude.ts";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

/**
 * Orchestrates coders against the active tasks.md.
 *
 * Reads the first unchecked task, spawns a single coder of the matching model
 * (which works through all consecutive tasks for its tag), then repeats until
 * every task is checked off. Coders themselves never wait or poll; all
 * sequencing lives here.
 */

export const run_coders = async (cwd: string): Promise<CodersResult> => {
  const tasks_path = find_tasks_file(cwd);
  const results: RunClaudeResult[] = [];
  while (true) {
    const toc = parse_toc(readFileSync(tasks_path, "utf-8"));
    const frontier = toc.findIndex((entry) => !entry.checked);

    if (frontier === -1) {
      return { status: "success", message: "All tasks complete.", results };
    }

    const tag = toc[frontier].tag;
    if (tag === "other") {
      return {
        status: "needs_other",
        message:
          "Next task is tagged [other] (needs more than sonnet). Stopping for human handling.",
        results,
      };
    }

    const result = await run_coder(tag, cwd);
    console.log(result);
    results.push(result);
    const status = parse_coder_status(result.stdout, tag);

    if (status === "error" || status === "need") {
      return {
        status: status === "error" ? "coder_error" : "coder_need",
        message: `${tag} coder ended with <${tag} ${status}>; stopping.`,
        results,
      };
    }

    const after = parse_toc(readFileSync(tasks_path, "utf-8"));
    const new_frontier = after.findIndex((entry) => !entry.checked);
    if (new_frontier !== -1 && new_frontier <= frontier) {
      return {
        status: "error",
        message: `Coder made no progress on tasks.md (stuck at task ${frontier + 1}).`,
        results,
      };
    }
  }
};

export const run_coder = async (model: CoderModel, cwd: string) => {
  const title = `${model[0].toUpperCase()}${model.slice(1)} Medium Coder`;
  return await run_claude({
    title,
    prompt: coder_prompt(model),
    cwd,
    model,
    effort: "medium",
    allowed_tools: [
      "Write(**/*)",
      "Edit(**/*)",
      "Read(**/*)",
      "Bash(npm run lint-fix)",
    ],
  });
};

type Tag = "haiku" | "sonnet" | "other";
export type CoderModel = "haiku" | "sonnet";

type TocEntry = { checked: boolean; tag: Tag };

export type CodersResult = {
  /** how the orchestration ended */
  status: "success" | "needs_other" | "coder_error" | "coder_need" | "error";
  /** a human-readable explanation of the outcome */
  message: string;
  /** A list of all single coder run results */
  results: RunClaudeResult[];
};

/** Locates the active tasks.md as the newly-added/modified plan/*\/tasks.md in git. */
export const find_tasks_file = (cwd: string): string => {
  const output = execFileSync("git", ["status", "--porcelain"], {
    cwd,
    encoding: "utf-8",
  });

  const matches = output.split("\n").filter((path) => /tasks\.md$/.test(path));
  if (matches.length === 0) {
    throw new Error("No git-dirty tasks.md found");
  }
  if (matches.length !== 1) {
    throw new Error("Confused! More than 1 possible tasks.md");
  }
  return join(cwd, matches[0].substring(3));
};

/** Parses TOC checkbox lines like `- [ ] 4. ... [sonnet]` into entries. */
export const parse_toc = (tasks_md: string): TocEntry[] => {
  const entries: TocEntry[] = [];
  for (const line of tasks_md.split("\n")) {
    const match = line.match(/^- \[( |x)\].*\[(haiku|sonnet|other)\]\s*$/);
    if (match) {
      entries.push({ checked: match[1] === "x", tag: match[2] as Tag });
    }
  }
  return entries;
};

/** Reads the coder's trailing `<$TAG status>` line from its stdout. */
export const parse_coder_status = (stdout: string, tag: Tag) => {
  const match = stdout.match(
    new RegExp(`<${tag} (all_done|more_later|error|need)>`, "g"),
  );
  if (!match || match.length === 0) {
    return "error" as const;
  }
  const last = match[match.length - 1];
  return last.slice(tag.length + 2, -1) as
    | "all_done"
    | "more_later"
    | "error"
    | "need";
};

export const coder_prompt = (tag: string) => {
  return readFileSync("./prompts/Coder.md", "utf-8").replaceAll("$TAG", tag);
};
