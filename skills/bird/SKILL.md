---
name: bird
description: Use the bird CLI to tweet, reply, read threads, search, and check mentions on X/Twitter. Cookie auth — uses existing browser session.
homepage: https://bird.fast
metadata:
  {
    "openclaw":
      {
        "emoji": "🐦",
        "requires": { "bins": ["bird"] },
        "install":
          [
            {
              "id": "node",
              "kind": "node",
              "package": "@steipete/bird",
              "bins": ["bird"],
              "label": "Install bird (node)",
            },
          ],
      },
  }
---

# bird

Fast X/Twitter CLI. Cookie auth. Zero fuss.

Quick start

- `bird whoami` — check auth / show current user
- `bird tweet "hello from bird"` — post a tweet
- `bird reply <tweet-id> "nice thread"` — reply to a tweet
- `bird read <tweet-id>` — read a tweet and its thread
- `bird search "query"` — search tweets
- `bird mentions` — check recent mentions
- `bird thread "first tweet" "second tweet" "third tweet"` — post a thread

Output modes

- Default: human-readable output
- `--json` — JSON output for scripting
- `--plain` — plain text, no formatting

Notes

- Auth: cookie-based — reads from your existing browser session (Safari/Chrome/Firefox).
- Uses X/Twitter's private GraphQL endpoints with auto-refreshing query IDs.
- Package: `npm install -g @steipete/bird`
- Requires Node.js >= 20.
