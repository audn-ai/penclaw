---
name: openclaude
description: "Invoke OpenClaude (Claude Code) as a peer agent via A2A (Agent-to-Agent) protocol. Use when: (1) delegating complex coding tasks to OpenClaude as an autonomous coding agent, (2) running long-running development tasks (feature builds, refactors, migrations) that need OpenClaude full tool access, (3) asking OpenClaude to analyze, review, or generate code in the workspace, (4) executing multi-step shell operations or git workflows, (5) pentesting, security scans, or any task that benefits from autonomous agent execution. NOT for: simple file reads (use read tool), quick one-liner edits (just edit directly), or tasks that need real-time interactive terminal (use coding-agent with pty). OpenClaude communicates via A2A protocol and returns structured results with session continuity."
metadata: { "openclaw": { "emoji": "🤖", "requires": { "bins": ["node"] }, "always": true } }
---

# OpenClaude (A2A Agent)

Communicate with **OpenClaude** (Claude Code CLI) as a peer agent using the A2A protocol. OpenClaude is a fully autonomous coding agent that can read, write, refactor code, run commands, and manage git.

## How to Use

The A2A client lives at `/workspace/.openclaude-a2a/client.js`. The A2A server runs on the host at `172.17.0.1:18950`.

### One-shot task (blocking — waits for result)

```bash
node /workspace/.openclaude-a2a/client.js "your prompt here"
```

Examples:

```bash
# Ask OpenClaude to do something
node /workspace/.openclaude-a2a/client.js "explain the auth module in src/auth.ts"

# With a specific working directory
node /workspace/.openclaude-a2a/client.js --workdir /workspace "add error handling to all API endpoints"

# Pentesting / security — save output to /workspace/temporary/
node /workspace/.openclaude-a2a/client.js "run nmap -T4 -A against audn.ai, analyze results, and write a report to /workspace/temporary/pentest-report.md"
```

### Async task (fire-and-forget for long-running work)

```bash
# Submit — returns immediately with a task ID
node /workspace/.openclaude-a2a/client.js --async "implement full OAuth2 authentication"

# Poll for result
node /workspace/.openclaude-a2a/client.js --task <task-id>

# List all tasks
node /workspace/.openclaude-a2a/client.js --list

# Cancel a running task
node /workspace/.openclaude-a2a/client.js --cancel <task-id>
```

### Streaming (real-time output)

```bash
node /workspace/.openclaude-a2a/client.js --stream "refactor the database layer to use connection pooling"
```

### Health check

```bash
node /workspace/.openclaude-a2a/client.js --health
```

### Agent card (capabilities)

```bash
node /workspace/.openclaude-a2a/client.js --card
```

## Direct CLI Fallback

If the A2A server is unreachable, use openclaude directly:

```bash
openclaude -p "your prompt here" --output-format json
```

## File Output Convention

**CRITICAL:** When asking OpenClaude to save files (reports, scripts, output), always tell it to write to `/workspace/temporary/` — this is the shared temp directory visible both to OpenClaude on the host and to you inside the sandbox container.

- `/workspace/temporary/` — use for all temporary output files (reports, scans, generated scripts, logs)
- `/workspace/` — use for project files that should persist in the workspace
- **NEVER use `/tmp/`** — files written to `/tmp/` by OpenClaude end up on the host and are NOT visible inside the container

Examples of correct file paths in prompts:

```
"write the report to /workspace/temporary/pentest-report.md"
"save the script to /workspace/temporary/scanner.py"
"output results to /workspace/temporary/nmap-results.txt"
```

## A2A Protocol (Advanced)

### JSON-RPC endpoint

```bash
curl -X POST http://172.17.0.1:18950/a2a/rpc \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "SendMessage",
    "params": {
      "message": {
        "messageId": "test-1",
        "role": "ROLE_USER",
        "parts": [{"text": "your prompt"}]
      }
    }
  }'
```

### REST endpoint

```bash
curl -X POST 'http://172.17.0.1:18950/a2a/message:send' \
  -H 'Content-Type: application/json' \
  -d '{"message": {"messageId": "test-1", "role": "ROLE_USER", "parts": [{"text": "your prompt"}]}}'
```

### Task management

```bash
curl http://172.17.0.1:18950/a2a/tasks/<task-id>
curl http://172.17.0.1:18950/a2a/tasks
curl -X POST http://172.17.0.1:18950/a2a/tasks/<task-id>:cancel
```

## Task States

```
SUBMITTED → WORKING → COMPLETED / FAILED / CANCELED
```

## Rules

1. **Always use `/workspace/.openclaude-a2a/client.js`** — this is the correct path inside the sandbox
2. **Use --async for long tasks** — anything that may take >30 seconds
3. **Check health first** — run `--health` before delegating if unsure
4. **Working directory** — use `--workdir /workspace` for project-specific tasks
5. **Report back** — always show the user the result from OpenClaude
6. **File output** — ALWAYS tell OpenClaude to save files to `/workspace/temporary/` (NOT `/tmp/`). Files in `/tmp/` are invisible to the user. Files in `/workspace/temporary/` are accessible at the same path inside the container.
