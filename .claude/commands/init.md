---
description: "Create the business workspace"
---

# Create the business workspace

Read CLAUDE.md and docs/cli.md. Confirm the workspace identity and read the relevant claim before changes.

```bash
node scripts/claims.mjs init --name="Your business"
```

Use only facts supplied by the operator or present in the records. Mutations need an operator label. Read the result back and explain any gaps. No command sends or pays anything.

Use --json for structured output. Never invent records or command results.
