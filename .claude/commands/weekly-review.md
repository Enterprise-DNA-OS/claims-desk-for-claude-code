---
description: "Prepare the weekly claims review"
---

# Prepare the weekly claims review

Read CLAUDE.md and docs/cli.md. Confirm the workspace identity and read the relevant claim before changes.

```bash
node scripts/claims.mjs weekly-review
```

This draft combines attention, evidence-chase and review-queue. Read compliance as well, prioritise overdue acknowledgements and third-party delays, and hand the completed draft back in chat. Nothing is sent.

Use --json for structured output. Never invent records or command results.
