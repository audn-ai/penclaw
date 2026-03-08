---
name: supermemory
description: Save, search, and recall memories using Supermemory's universal memory API — long-term context, user profiles, and semantic search for AI agents.
homepage: https://supermemory.ai
metadata: { "openclaw": { "emoji": "🧠", "requires": { "bins": ["mcporter"] } } }
---

# Supermemory

Universal memory API for AI agents. Save information, build user context, and retrieve memories with semantic search.

## MCP Server

This skill wraps the **Supermemory** MCP server.
Transport: streamable-http
Endpoint: https://mcp.supermemory.ai/mcp
Auth: OAuth (automatic via PenClaw marketplace)

## When to use

Use this skill when the user asks any of:

- "remember this" / "save this for later"
- "what do you know about me?"
- "search my memories" / "recall what I said about ..."
- "add this to memory"
- "forget this" / "delete this memory"
- "who am I?"

## Tools

### memory

Save or forget information.

```bash
mcporter call supermemory.memory content="Meeting notes: discussed Q3 roadmap" action=save
mcporter call supermemory.memory content="old email address" action=forget
```

Parameters:

- `content` (required) — the memory content to save or forget
- `action` — `save` (default) or `forget`
- `containerTag` — project tag to scope the memory

### recall

Search memories and get user profile.

```bash
mcporter call supermemory.recall query="roadmap discussion"
mcporter call supermemory.recall query="preferences" includeProfile=true
```

Parameters:

- `query` (required) — search query to find relevant memories
- `includeProfile` — include user profile summary (default: true)
- `containerTag` — project tag to scope the search

### whoAmI

Get the current logged-in user's information.

```bash
mcporter call supermemory.whoAmI
```

Returns userId, email, name, client, and sessionId.

## Resources

- `supermemory://profile` — user profile with stable preferences and recent activity
- `supermemory://projects` — list of available memory projects

## Configuration

The MCP server endpoint is pre-configured at `https://mcp.supermemory.ai/mcp`.
Server config is managed in `config/mcporter.json` — do not modify manually.
