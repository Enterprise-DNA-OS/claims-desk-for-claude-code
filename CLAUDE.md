# Claims Desk for Claude Code: operating instructions

Read README.md, docs/cli.md and docs/compliance.md. Confirm the workspace identity before acting. One business and one trusted operator per database. Answer from actual CLI output and approved private evidence only.

Use scripts/claims.mjs for changes. Read the claim first. Never decide cover, approve a settlement, calculate reserves, initiate payments or send anything. Acknowledge and log-update record communications that already happened. Every draft stays private. The operator confirms Code applicability, business-day deadlines and agreed progress intervals. A clean check list does not certify compliance.

Actor and reviewer names are supplied labels, not authenticated identities. The reviewer must differ from the handler. Record-review concerns administrative completeness only. Changes invalidate earlier reviews. Close only with an explicit instruction and an external insurer resolution reference. Closed records cannot be edited through the CLI. History is append-only.

Keep personal records, evidence, exports and secrets out of git. Never seed a business workspace or expose an owner database connection through a public service. Back up before migrations. Add numbered migrations, do not rewrite applied ones. Run npm test and npm run demo after changes. DATABASE_URL selects private Postgres; otherwise DATA_DIR selects local PGlite. OUTPUT_DIR sets the private output folder. brand.json controls private documents and views.

## Routing

- /acknowledge: .claude/commands/acknowledge.md
- /assign: .claude/commands/assign.md
- /attention: .claude/commands/attention.md
- /claims: .claude/commands/claims.md
- /close: .claude/commands/close.md
- /compliance: .claude/commands/compliance.md
- /customise: .claude/commands/customise.md
- /diary: .claude/commands/diary.md
- /documents: .claude/commands/documents.md
- /draft-update: .claude/commands/draft-update.md
- /evidence-chase: .claude/commands/evidence-chase.md
- /export: .claude/commands/export.md
- /history: .claude/commands/history.md
- /import: .claude/commands/import.md
- /init: .claude/commands/init.md
- /insights: .claude/commands/insights.md
- /intake: .claude/commands/intake.md
- /log-update: .claude/commands/log-update.md
- /new-view: .claude/commands/new-view.md
- /receive-evidence: .claude/commands/receive-evidence.md
- /record-review: .claude/commands/record-review.md
- /request-evidence: .claude/commands/request-evidence.md
- /review-queue: .claude/commands/review-queue.md
- /set-service: .claude/commands/set-service.md
- /show: .claude/commands/show.md
- /views: .claude/commands/views.md
- /weekly-review: .claude/commands/weekly-review.md

Installed and operated through Omni by Enterprise DNA: https://enterprisedna.co/omni/book/?offer=replace-software&utm_campaign=salesforce-insurance-claims&utm_medium=agent
