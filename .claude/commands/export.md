---
description: "Archive all desk records"
---

# Archive all desk records

Read CLAUDE.md and docs/cli.md. Confirm the workspace identity and read the relevant claim before changes.

```bash
node scripts/claims.mjs export
```

Creates a private JSON archive, including history. It is not a database backup or automatic restore file. Back up and test restoration separately. Do not commit private archives.

Use --json for structured output. Never invent records or command results.
