# Agent Mode Detection

> Detect whether you are running locally (human in the loop) or in the cloud (autonomous). Adapt behavior accordingly.

## Detection Protocol

Run this check **once** at the start of any skill and cache the result:

```bash
if [ -n "$CLAUDE_CODE_REMOTE" ] || [ -n "$GITHUB_ACTIONS" ] || [ -n "$CI" ] || [ ! -t 0 ]; then
  echo "cloud"
else
  echo "local"
fi
```

## Signal Reference

| Signal | Indicates | Check |
|--------|-----------|-------|
| `CLAUDE_CODE_REMOTE=true` | Claude Code on the web | `[ -n "$CLAUDE_CODE_REMOTE" ]` |
| `GITHUB_ACTIONS=true` | GitHub Actions (Copilot coding agent) | `[ -n "$GITHUB_ACTIONS" ]` |
| `CI=true` | Generic CI environment | `[ -n "$CI" ]` |
| No TTY on stdin | Non-interactive session | `[ ! -t 0 ]` |

Any **one** signal is sufficient to select cloud mode.

## User Override

Skills should respect an explicit override if set:

- `AGENT_MODE=local` — force local mode (useful for testing cloud skills locally)
- `AGENT_MODE=cloud` — force cloud mode (useful for testing autonomous behavior)

Check the override **before** the detection signals:

```bash
if [ "$AGENT_MODE" = "local" ]; then echo "local"
elif [ "$AGENT_MODE" = "cloud" ]; then echo "cloud"
elif [ -n "$CLAUDE_CODE_REMOTE" ] || [ -n "$GITHUB_ACTIONS" ] || [ -n "$CI" ] || [ ! -t 0 ]; then echo "cloud"
else echo "local"
fi
```

## Mode Definitions

### Local Mode (Human in the Loop)

**When:** Running in a terminal with a human present.

### Cloud Mode (Autonomous)

**When:** Running without a human present (CI, GitHub Actions, Claude Code on the web) OR in a scenario where user input is not as frequent.

## Usage Pattern in Skills

When a skill step has mode-dependent behavior, use inline markers:

```
**Local mode:** Use `AskUserQuestion` to ask the user which approach to take.

**Cloud mode:** Auto-select the most conservative approach. Log the decision as a PR comment.
```

Skills should read this file in their prerequisites and cache the detected mode for the entire workflow.
