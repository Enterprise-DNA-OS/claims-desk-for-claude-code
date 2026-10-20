---
description: "Bring Salesforce claim headers across"
---

# Bring Salesforce claim headers across

Read CLAUDE.md and docs/cli.md. Confirm the workspace identity and read the relevant claim before changes.

```bash
node scripts/claims.mjs import salesforce "<claims.csv>" --dry-run --actor="<operator>"
```

Read docs/replace-salesforce-insurance-claims.md. Inspect the export and map custom headers with --map=<file>. Run a dry run, explain the rows and scope, then run without --dry-run when the operator has requested import. Re-import replaces mapped claim header fields, including owner, but preserves desk service dates and workflow status. Use the original export again only if these changes are intended.

Use --json for structured output. Never invent records or command results.
