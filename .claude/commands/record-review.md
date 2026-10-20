---
description: "Record an independent administrative review"
---

# Record an independent administrative review

Read CLAUDE.md and docs/cli.md. Confirm the workspace identity and read the relevant claim before changes.

```bash
node scripts/claims.mjs record-review "<claim>" --reviewer="<reviewer other than handler>" --note="<checks and evidence inspected>" --actor="<operator>"
```

Read the claim and each linked evidence reference first. This records administrative completeness only, never approval or rejection of an insurance claim. The reviewer must differ from the assigned handler. Changes invalidate previous reviews. Actor names are operator-supplied labels, not authenticated identity.

Use --json for structured output. Never invent records or command results.
