---
description: "Close a resolved claim file"
---

# Close a resolved claim file

Read CLAUDE.md and docs/cli.md. Confirm the workspace identity and read the relevant claim before changes.

```bash
node scripts/claims.mjs close "<claim>" --reference="<external insurer resolution>" --actor="<operator>"
```

Use only after an explicit operator instruction to close this claim. Verify the external resolution reference, current independent file review and all requested evidence. The command records closure; it does not make the insurer decision, pay money or send a letter.

Use --json for structured output. Never invent records or command results.
