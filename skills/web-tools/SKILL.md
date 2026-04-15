---
name: web-tools
description: "Web search, URL content extraction, and browsing tools. Search the web using SerpAPI, Brave Search, and audn.ai. Fetch and extract content from any URL. Use when you need live web data, current information, or to read the contents of a URL."
metadata:
  {
    "openclaw":
      {
        "emoji": "🔍",
        "requires": { "bins": ["curl"] },
        "install":
          [
            {
              "id": "npm",
              "kind": "npm",
              "package": "audn-web-tools-mcp",
              "bins": ["audn-web-tools-mcp"],
              "label": "Install audn-web-tools-mcp (npm)",
            },
          ],
      },
  }
---

# web-tools — Agent Skill Reference

Search the web and fetch URL content via audn.ai endpoints or MCP tools.

## Available Tools

| Tool           | Description                              | When to Use                                       |
| -------------- | ---------------------------------------- | ------------------------------------------------- |
| `web_search`   | Search via SerpAPI through audn.ai proxy | General web search, current events, fact-checking |
| `brave_search` | Search via Brave Search API              | Alternative search, privacy-focused results       |
| `fetch_url`    | Fetch and extract content from a URL     | Read articles, docs, pages; extract text from URL |

## Usage

### web_search / brave_search

Search the web and return structured results.

```bash
# Via shell script
./scripts/search.sh "latest news on AI regulation"
```

```json
// MCP tool call
{
  "tool": "web_search",
  "arguments": { "query": "latest news on AI regulation" }
}
```

### fetch_url

Fetch a URL and extract readable content. Supports pagination for long pages.

```bash
# Via shell script (page 1)
./scripts/browse.sh "https://example.com/article"

# Page 2
./scripts/browse.sh "https://example.com/article" 2
```

```json
// MCP tool call
{
  "tool": "fetch_url",
  "arguments": { "url": "https://example.com/article", "page": 1 }
}
```

## Shell Scripts

- `scripts/search.sh "<query>"` — search via audn.ai gptssearch endpoint
- `scripts/browse.sh "<url>" [page]` — fetch URL content via audn.ai browsegiant endpoint

## Configuration

| Variable        | Description                  | Required |
| --------------- | ---------------------------- | -------- |
| `SERPAPI_KEY`   | SerpAPI key (for web_search) | For MCP  |
| `BRAVE_API_KEY` | Brave Search key             | For MCP  |

The shell scripts use the public audn.ai endpoints and require no API keys.

## When to Use

- Need current/live information not in training data
- User asks "search for", "look up", "find online"
- Need to read a specific URL or web page
- Fact-checking or verifying claims
- Researching topics that change frequently

## When NOT to Use

- Information is already known with high confidence
- User is asking about local files or code
- The query is about static/historical facts unlikely to have changed
