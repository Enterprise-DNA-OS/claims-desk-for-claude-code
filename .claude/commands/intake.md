---
description: "Record first notice of loss"
---

# Record first notice of loss

Read CLAUDE.md and docs/cli.md. Confirm the workspace identity and read the relevant claim before changes.

```bash
node scripts/claims.mjs intake --number="<claim number>" --claimant="<claimant>" --summary="<facts received>" --received=YYYY-MM-DD --loss=YYYY-MM-DD --policy="<reference>" --type="<type>" --owner="<handler>" --actor="<operator>"
```

Use only facts supplied by the operator or present in the records. Mutations need an operator label. Read the result back and explain any gaps. No command sends or pays anything.

Use --json for structured output. Never invent records or command results.
