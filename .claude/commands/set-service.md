---
description: "Confirm service dates and Code scope"
---

# Confirm service dates and Code scope

Read CLAUDE.md and docs/cli.md. Confirm the workspace identity and read the relevant claim before changes.

```bash
node scripts/claims.mjs set-service "<claim>" --scope=applies --reason="<basis and calendar checked>" --ack-due=YYYY-MM-DD --update-due=YYYY-MM-DD --decision-due=YYYY-MM-DD --actor="<operator>"
```

Read docs/compliance.md. The operator confirms applicability, business-day calendar and any agreed interval. Omitted date options clear the corresponding stored date. Show current dates first and preserve any date that should remain. Use scope outside or unknown when appropriate; record the reason. This operation never calculates statutory dates.

Use --json for structured output. Never invent records or command results.
