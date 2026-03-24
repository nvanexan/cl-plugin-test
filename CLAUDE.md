# Project Context

This project uses CodeLantern for agentic development workflows.

## Configuration

- **Repository:** `nvanexan/cl-plugin-test`
- **Config file:** `.codelantern/config.json`
- **Knowledge base:** `.codelantern/knowledge-base.md`

**IMPORTANT:** Always read the knowledge base before starting work. It contains project-specific patterns and conventions.

## Available Skills

Skills are provided by the CodeLantern plugin and invoked with `/codelantern:skillname`.

| Skill | Description |
|-------|-------------|
| `/codelantern:spec` | Create a detailed specification as a GitHub Issue |
| `/codelantern:size` | Assess issue complexity and set the Size field |
| `/codelantern:backlog` | Review and prioritize backlog issues |
| `/codelantern:architect` | Create a technical implementation plan |
| `/codelantern:implement` | Implement code changes from an approved plan |
| `/codelantern:review` | Perform systematic code review on a PR |
| `/codelantern:consolidate` | Update knowledge base with learnings |
| `/codelantern:finalize` | Finalize a PR: consolidate, update body, mark ready |
| `/codelantern:handoff` | Delegate a skill to the cloud agent |
| `/codelantern:refresh` | Get up to speed on current work in progress |
| `/codelantern:discover` | Populate the knowledge base by analyzing the codebase |

## Workflow Overview

```
/codelantern:spec → Create detailed spec (GitHub Issue)
    ↓
/codelantern:backlog → Prioritize & move to Ready
    ↓
Choose path:
  Small/medium → /codelantern:resolve (plan + implement + consolidate + finalize in one pass)
  Larger       → /codelantern:architect → /codelantern:implement (consolidation + finalization built in)
    ↓
/codelantern:review → Code review
    ↓
Merge PR

After further changes → /codelantern:consolidate → /codelantern:finalize (re-submit PR)
```

### Hard Gates

**Each gate is a FULL STOP. Never auto-advance to the next gate. The user must explicitly invoke the next skill.**

| Skill | Prerequisite |
|-------|--------------|
| `/codelantern:architect` | Requires a spec'd issue with `cl-spec-complete` label |
| `/codelantern:implement` | Requires a technical plan file at `.codelantern/plans/issue-{n}.md` |
| `/codelantern:review` | Requires an open pull request |
| `/codelantern:consolidate` | Branch with open PR |
| `/codelantern:finalize` | Branch with open PR |

## MCP Servers

MCP servers are configured by the CodeLantern plugin:

### GitHub MCP

Use for all GitHub operations: issues, PRs, code search, project board operations.

### Context7 MCP

Use for library documentation: API references, code examples, configuration guides.

## Key Files

| File | Purpose |
|------|---------|
| `.codelantern/config.json` | Project configuration (read this for repo/project info) |
| `.codelantern/knowledge-base.md` | Patterns, conventions, and learnings (single source of truth) |
