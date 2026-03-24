# Knowledge Base

> This is the unified, living documentation for nvanexan/cl-plugin-test.
> It captures architecture, patterns, and learnings that evolve with the codebase.
> The top sections (Product through Project History) are populated by `/codelantern:discover`.
> The bottom sections (Quick Reference through Changelog) are populated by `/codelantern:consolidate`.

---

## Index

| Section | Description |
|---------|-------------|
| [Product](#product) | What the product does, who uses it, goals |
| [Architecture](#architecture) | System overview, components, data flow |
| [Tech Stack](#tech-stack) | Languages, frameworks, infrastructure |
| [Code Style](#code-style) | Actual code patterns discovered from the codebase |
| [Guidelines & Conventions](#guidelines--conventions) | Commit conventions, linter configs, communication style |
| [Project History](#project-history) | Key milestones, contributors, evolution |
| [Quick Reference](#quick-reference-dodont) | DO/DON'T patterns — read first |
| [MCP Servers](#mcp-servers) | Available AI tool servers and when to use them |
| [Common Tasks (Recipes)](#common-tasks-recipes) | Step-by-step guides for frequent operations |
| [Changelog](#changelog) | Document history |

---

## Product

<!-- Populated by /codelantern:discover — describes what the product does, users, goals -->

_Run `/codelantern:discover` to auto-populate this section by analyzing the codebase._

---

## Architecture

<!-- Populated by /codelantern:discover — system overview, component diagram, data flow -->

_Run `/codelantern:discover` to auto-populate this section by analyzing the codebase._

---

## Tech Stack

<!-- Populated by /codelantern:discover — languages, frameworks, infrastructure -->

_Run `/codelantern:discover` to auto-populate this section by analyzing the codebase._

---

## Code Style

<!-- Populated by /codelantern:discover — actual patterns found in the codebase -->
<!-- Covers: formatting, naming conventions, import organization, error handling, test structure -->

_Run `/codelantern:discover` to auto-populate this section by analyzing actual code patterns._

---

## Guidelines & Conventions

<!-- Populated by /codelantern:discover — commit conventions, linter configs, communication style -->

_Run `/codelantern:discover` to auto-populate this section by analyzing the codebase._

---

## Project History

<!-- Populated by /codelantern:discover — key milestones, contributors, evolution -->

_Run `/codelantern:discover` to auto-populate this section by reviewing git history._

---

## Quick Reference (DO/DON'T)

### DO (Patterns to Follow)

<!-- Accumulated from PR consolidation -->

- Read this knowledge base before starting work on any issue
- Use the GitHub MCP for all issue and PR operations
- Use Context7 MCP for library documentation lookups
- Capture learnings in PR descriptions (Learnings section)
- Follow existing patterns — check this KB first
- Keep PRs focused — one issue per PR
- Write clear commit messages that explain "why"

### DON'T (Mistakes to Avoid)

<!-- Accumulated from PR consolidation -->

- Don't hardcode project/repository values — read from `.codelantern/config.json`
- Don't skip the planning phase for non-trivial features
- Don't merge without updating the knowledge base
- Don't introduce new patterns without documenting them here
- Don't leave the Learnings section empty in PRs

---

## MCP Servers

Model Context Protocol (MCP) servers provide AI agents with specialized tools.

| Server | Purpose | When to Use |
|--------|---------|-------------|
| **GitHub** | Repository operations | Create PRs, manage issues, search code, branch operations |
| **Context7** | Library documentation | Need up-to-date docs for any library or framework |

### GitHub MCP

Full GitHub platform integration for repository operations.

**Common operations:**
- `create_pull_request` / `update_pull_request` — PR management
- `search_code` — Find code patterns across repositories
- `create_branch` / `list_branches` — Branch operations
- `search_issues` — Find issues with specific criteria
- `list_issues` / `issue_write` — Issue management

**Best for:** PR workflows, code search, issue management, project operations.

### Context7 MCP

Provides current, version-specific documentation and code examples.

**Usage pattern:**
```
# First resolve the library ID
mcp_context7_resolve-library-id(libraryName: "react", query: "useEffect cleanup")

# Then query documentation
mcp_context7_query-docs(libraryId: "/facebook/react", query: "useEffect cleanup examples")
```

**Best for:** API references, code patterns, configuration guides, troubleshooting.

---

## Common Tasks (Recipes)

### Starting Work on an Issue

1. Run `/codelantern:refresh` to understand current state (if resuming work)
2. If no active work, run `/codelantern:architect` to create a technical plan for the next Ready issue
3. Run `/codelantern:implement` to execute the plan
4. Fill in Learnings section before marking PR ready

### Adding a New Pattern

1. Document it in the relevant section of this KB
2. Add to "DO (Patterns to Follow)" if it's a best practice
3. If replacing an old pattern, update rather than add
4. Link to the source PR in the changelog

### Updating the Knowledge Base

After merging a PR:
1. Run `/codelantern:consolidate` from the feature branch
2. Review extracted learnings
3. Commit the KB updates

---

## Changelog

| Date | PR | Summary |
|------|-----|---------|
| 2026-03-24 | Initial | Project initialized with CodeLantern |
