/**
 * Cloud Agent Runner — Copilot SDK
 *
 * Scaffolded by /codelantern:init. Drives a Copilot SDK session to execute
 * a skill for a given GitHub issue.
 *
 * Intended to be run from the codelantern-dispatch workflow.
 *
 * MCP servers are loaded from the plugin's .mcp.json (cloned to .cl-plugin/).
 * Skills are loaded from .cl-plugin/skills/.
 *
 * Environment variables (set by the workflow):
 *   COPILOT_GITHUB_TOKEN - Fine-grained PAT with "Copilot Requests" permission
 *   GITHUB_TOKEN         - Token for GitHub API operations
 *   ISSUE_NUMBER         - The issue number to work on
 *   REPO                 - The repository in "owner/name" format
 *   SKILL                - The skill to run ("architect", "implement", "review", "consolidate", "freeform")
 *   MODEL                - The model to use (e.g., "claude-sonnet-4.6")
 *   PROMPT               - Free-form prompt text (used when SKILL=freeform)
 *   CONTEXT              - "issue" or "pr"
 *   PR_BRANCH            - The branch name (for PR context)
 *   SENDER               - GitHub username of the person who triggered the command
 *
 * NOTE: The @github/copilot-sdk is in technical preview. APIs may change.
 */

import { CopilotClient } from "@github/copilot-sdk";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const SKILL = process.env.SKILL;
const ISSUE_NUMBER = process.env.ISSUE_NUMBER;
const REPO = process.env.REPO;
const MODEL = process.env.MODEL || "claude-sonnet-4.6";
const PROMPT = process.env.PROMPT || "";
const CONTEXT = process.env.CONTEXT || "issue";
const PR_BRANCH = process.env.PR_BRANCH || "";
const SENDER = process.env.SENDER || "";

const PLUGIN_DIR = ".cl-plugin";

if (!SKILL || !ISSUE_NUMBER || !REPO) {
  console.error(
    "Missing required environment variables. Need: SKILL, ISSUE_NUMBER, REPO"
  );
  process.exit(1);
}

console.log(
  `Starting cloud agent: skill=${SKILL}, issue=#${ISSUE_NUMBER}, repo=${REPO}, model=${MODEL}, context=${CONTEXT}`
);
if (PROMPT) console.log(`Prompt: ${PROMPT}`);

// ---------------------------------------------------------------------------
// MCP server loading — reads from plugin .mcp.json
// ---------------------------------------------------------------------------

function loadMCPServers() {
  try {
    const raw = readFileSync(`${PLUGIN_DIR}/.mcp.json`, "utf8");
    const config = JSON.parse(raw);
    const servers = {};

    for (const [name, server] of Object.entries(config.mcpServers)) {
      // Resolve ${VAR} references in the config using process.env
      const resolved = JSON.parse(
        JSON.stringify(server).replace(
          /\$\{(\w+)\}/g,
          (_, key) => process.env[key] || ""
        )
      );

      if (resolved.command) {
        // stdio server (e.g., context7)
        servers[name] = {
          type: "local",
          command: resolved.command,
          args: resolved.args || [],
          tools: ["*"],
        };
      } else if (resolved.url) {
        // HTTP server (e.g., github, figma)
        servers[name] = {
          ...resolved,
          tools: ["*"],
        };
      }
    }

    console.log(`Loaded MCP servers from ${PLUGIN_DIR}/.mcp.json:`, Object.keys(servers).join(", "));
    return servers;
  } catch (err) {
    console.error(`Failed to load MCP config from ${PLUGIN_DIR}/.mcp.json:`, err.message);
    console.error("Falling back to no MCP servers.");
    return {};
  }
}

// ---------------------------------------------------------------------------
// Cloud context injection — skill-specific behavioral overrides
// ---------------------------------------------------------------------------

// Agent session timeout: 60 minutes (Copilot SDK default is 60s)
const SESSION_TIMEOUT_MS = 3_600_000;

const CLOUD_CONTEXT = {
  architect: [
    "CLOUD CONTEXT: You are running as a cloud agent triggered by @codelantern.",
    "- Follow EVERY step in the /architect skill precisely, using cloud mode at each step.",
    "- Do NOT skip any steps — complete all of them in order.",
    "- Do NOT implement code — only create the plan.",
    "- When posting approval comments, clearly separate plan approval from implementation. Approval does NOT trigger /implement — the user must run /implement as a separate deliberate action.",
    "- Do NOT post a summary or completion comment on the issue — the workflow handles reporting results. Only post skill-specific comments (e.g., the plan-ready-for-review comment on the PR).",
    "- Do NOT write to .codelantern/.agent-output — the workflow uses a canned message for architect.",
  ].join("\n"),

  implement: [
    "CLOUD CONTEXT: You are running as a cloud agent triggered by @codelantern.",
    "- You are on an existing branch — do NOT create a new branch.",
    "- Follow EVERY step in the /implement skill precisely, using cloud mode at each step.",
    "- Do NOT skip any steps — complete all of them in order.",
    "- Do NOT skip Step 7 (Consolidation) — update the KB and generate branch documentation.",
    "- Do NOT skip Step 8 (Finalization) — update the PR body from pr-body-template.md and mark the PR ready for review.",
    "- Do NOT post a summary or completion comment on the issue — the workflow handles reporting results.",
    "- Write your final summary to .codelantern/.agent-output when done — this is how the workflow reports results.",
  ].join("\n"),

  review: [
    "CLOUD CONTEXT: You are running as a cloud agent triggered by @codelantern.",
    "- You are reviewing a pull request.",
    "- Read the PR diff and provide constructive review comments.",
    "- Post inline review comments where appropriate.",
    "- Do NOT modify code — only review and comment.",
    "- Do NOT post a summary comment on the issue — the workflow handles reporting results.",
    "- Write your final summary to .codelantern/.agent-output when done — this is how the workflow reports results.",
  ].join("\n"),

  consolidate: [
    "CLOUD CONTEXT: You are running as a cloud agent triggered by @codelantern.",
    "- Follow EVERY step in the /consolidate skill precisely, using cloud mode.",
    "- Auto-approve extracted learnings (cloud mode) — do not wait for user confirmation.",
    "- Commit KB updates to the current branch and push to remote so the PR is up to date.",
    "- Do NOT post a summary or completion comment on the issue — the workflow handles reporting results.",
    "- Write your final summary to .codelantern/.agent-output when done — this is how the workflow reports results.",
  ].join("\n"),

  freeform: [
    "CLOUD CONTEXT: You are running as a cloud agent triggered by @codelantern.",
    "- Execute the user's request in the context of this issue/PR.",
    "- If your work results in code changes, commit them with clear messages.",
    `- After committing code changes, follow the consolidation checklist at \`${PLUGIN_DIR}/skills/consolidate/references/consolidation-steps.md\` to update the session log and knowledge base. Commit documentation updates separately and push to remote.`,
    "- Do NOT post a summary or completion comment on the issue — the workflow handles reporting results.",
    "- Write your final summary to .codelantern/.agent-output when done — this is how the workflow reports results.",
  ].join("\n"),
};

// ---------------------------------------------------------------------------
// Build the prompt
// ---------------------------------------------------------------------------

function buildPrompt() {
  const cloudContext = CLOUD_CONTEXT[SKILL] || CLOUD_CONTEXT.freeform;

  if (SKILL === "freeform") {
    // Free-form: use PROMPT env var as the agent prompt
    return [
      cloudContext,
      "",
      `Issue: #${ISSUE_NUMBER} in ${REPO}`,
      `Triggered by: @${SENDER}`,
      CONTEXT === "pr" ? `PR branch: ${PR_BRANCH}` : "",
      "",
      PROMPT,
    ]
      .filter(Boolean)
      .join("\n");
  }

  // Skill-based: invoke the skill with optional additional prompt
  const parts = [
    cloudContext,
    "",
    `Run the /${SKILL} skill for issue #${ISSUE_NUMBER} in repository ${REPO}.`,
    `Triggered by: @${SENDER}`,
  ];

  if (CONTEXT === "pr" && PR_BRANCH) {
    parts.push(`PR branch: ${PR_BRANCH}`);
  }

  if (PROMPT) {
    parts.push("", `Additional instructions: ${PROMPT}`);
  }

  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// Write agent output file
// ---------------------------------------------------------------------------

function writeAgentOutput(content) {
  try {
    mkdirSync(".codelantern", { recursive: true });
    writeFileSync(".codelantern/.agent-output", content, "utf8");
    console.log("Wrote agent output to .codelantern/.agent-output");
  } catch (err) {
    console.error("Failed to write agent output:", err.message);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

let client;
let session;

try {
  // 1. Create the Copilot client
  client = new CopilotClient();
  await client.start();
  console.log("Copilot client started.");

  // 2. Resolve skill directories from the plugin
  const skillDirs = [];
  if (SKILL !== "freeform") {
    skillDirs.push(`./${PLUGIN_DIR}/skills/${SKILL}`);
  } else {
    // Freeform: include consolidate skill for post-change documentation
    skillDirs.push(`./${PLUGIN_DIR}/skills/consolidate`);
  }

  // 3. Load MCP servers from plugin config
  const mcpServers = loadMCPServers();

  // Workaround: SDK env-passing bug (#444) — set at process level so child inherits it
  process.env.GITHUB_PERSONAL_ACCESS_TOKEN = process.env.GITHUB_TOKEN;

  // 4. Create a session with skill directories, MCP servers, and streaming
  //    Auto-approve all tool permissions — this runs in CI with no interactive user.
  session = await client.createSession({
    model: MODEL,
    streaming: true,
    skillDirectories: skillDirs,
    onPermissionRequest: async () => ({ kind: "approved" }),
    mcpServers,
  });

  console.log("Session created. Registering event listeners...");

  // 5. Register event listeners for real-time visibility in Actions logs
  let lastContent = "";
  let toolCallCount = 0;
  let messageCount = 0;

  session.on("assistant.message", (event) => {
    messageCount++;
    lastContent = event.data.content || "";
    // Log a truncated preview of each message (Actions buffers line-by-line)
    const preview = lastContent.replace(/\n/g, " ").substring(0, 500);
    console.log(`[message #${messageCount}] ${preview}`);
  });

  session.on("tool.call", (event) => {
    toolCallCount++;
    const args = JSON.stringify(event.data.arguments || {}).substring(0, 300);
    console.log(`[tool.call #${toolCallCount}] ${event.data.toolName}(${args})`);
  });

  session.on("tool.result", (event) => {
    const preview = JSON.stringify(event.data).substring(0, 300);
    console.log(`[tool.result] ${preview}`);
  });

  session.on("session.error", (event) => {
    console.error(`[session.error] ${JSON.stringify(event.data)}`);
  });

  session.on("session.idle", () => {
    console.log(`[session.idle] Done — ${messageCount} messages, ${toolCallCount} tool calls`);
  });

  // 6. Build and send the prompt
  const prompt = buildPrompt();
  console.log("--- Prompt ---");
  console.log(prompt);
  console.log("--- End Prompt ---");

  console.log(`Sending prompt and waiting (timeout: ${SESSION_TIMEOUT_MS / 1000}s)...`);
  const sendStart = Date.now();
  const response = await session.sendAndWait({ prompt }, SESSION_TIMEOUT_MS);
  const elapsed = ((Date.now() - sendStart) / 1000).toFixed(1);
  console.log(`\nsendAndWait completed in ${elapsed}s (${toolCallCount} tool calls)`);

  const finalContent = response?.data?.content || lastContent || "No output captured.";

  console.log("--- Agent Response ---");
  console.log(finalContent);
  console.log("--- End Response ---");

  // 7. Write structured output for the workflow to read
  writeAgentOutput(finalContent);
} catch (error) {
  console.error("Agent execution failed:", error);
  writeAgentOutput(`Agent execution failed: ${error.message || error}`);
  process.exitCode = 1;
} finally {
  // 8. Clean up: destroy session and stop client regardless of outcome
  if (session) {
    try {
      await session.destroy();
      console.log("Session destroyed.");
    } catch (cleanupError) {
      console.error("Error destroying session:", cleanupError);
    }
  }

  if (client) {
    try {
      await client.stop();
      console.log("Client stopped.");
    } catch (cleanupError) {
      console.error("Error stopping client:", cleanupError);
    }
  }
}
