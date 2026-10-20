# Claims Desk for Claude Code

Own the claims diary, evidence chase and administrative file review. A database and plain-language work with Claude Code, Codex, OpenCode or Cursor. MIT licensed. This is an operational desk base for general-insurance claims; insurer decisions and financial systems stay in place.

## Three ways to use it

- **Do it yourself:** install the free code, keep the database private and import your Salesforce claim headers. Hosting and your agent subscription are your costs.
- **We customise it:** Enterprise DNA maps your export, adds your fields and service rules, and builds the interface or different stack your team needs.
- **We run it for you:** Omni by Enterprise DNA installs, connects and operates your version. One setup fee, then a retainer. [Book a call](https://enterprisedna.co/omni/book/?offer=replace-software&utm_campaign=salesforce-insurance-claims&utm_medium=readme).

## Start with fictional data

```bash
npm install
npm test
npm run demo
```

The demo uses a temporary database and removes it afterwards. Use npm run demo -- --keep to keep its private HTML, captured command output and fictional database. For a persistent local demo run npm run migrate then npm run seed. Seeding refuses a named business workspace.

## Start your own desk

```bash
npm run migrate
node scripts/claims.mjs init --name="Your business"
node scripts/claims.mjs import salesforce imports/claims.csv --dry-run --actor="Your name"
node scripts/claims.mjs import salesforce imports/claims.csv --actor="Your name"
```

[The import guide](docs/replace-salesforce-insurance-claims.md) states the exact fields and exclusions. Claims begin open for reconciliation even if the source says closed. Keep private files in imports/, exports/ and drafts/, which are ignored by git. DATABASE_URL selects private Postgres; otherwise DATA_DIR chooses local PGlite. OUTPUT_DIR chooses where private output is written. One trusted operator and one business per database; this is not an authenticated multi-user service.

## The weekly claims rituals

Read /attention and /diary each morning. Use /evidence-chase to see who has not supplied records. /acknowledge and /log-update record communications already made; they never send them. /review-queue and /record-review manage an independent administrative file check. /weekly-review drafts the week from three live reads. /compliance flags stored-record gaps against the cited [service rules](docs/compliance.md).

There are 23 CLI operations and 27 slash recipes. [All command syntax](docs/cli.md). Mutations require an actor label, write append-only history and invalidate previous reviews when the file changes. A closed file cannot be changed through the CLI. Closure requires a current review, complete requested evidence and an external resolution reference. No insurance decision or payment is made here.

## Paperwork and read-only views

Set brand.json to your business name, local logo and colours. npm run docs renders a claim file pack, evidence-request draft and service history per claim. npm run view renders the week, evidence chase and service checks. Text is escaped, wide records scroll on small screens, and outputs remain private. [Why there is no front end](docs/why-no-front-end.md).

## Ten questions answered from your records

/insights answers these today. They are implemented joins across your records, not assertions about what Salesforce cannot configure.

1. Which handlers have overdue evidence?
2. Which claims are missing a handler?
3. Which claims need Code scope confirmation?
4. Which claims have all requested evidence and need review?
5. Which records changed after an administrative review?
6. Which third parties are holding up evidence?
7. Which claims have overdue progress updates?
8. Which acknowledgements were recorded late?
9. Which claim types have the oldest open records?
10. Which reviewed claims are ready for a closure check?

## Your first hour: ten things to ask for

1. Show the claims needing attention today.
2. Find the evidence overdue from assessors.
3. Tell me which claims have no handler.
4. Record the acknowledgement we already sent.
5. Set the next agreed progress update date.
6. Draft a claimant update from the evidence history.
7. Find files changed since the last review.
8. Put our name on an evidence-request draft.
9. Add a read-only view grouped by claim type.
10. Add our catastrophe-event reference through /customise.

## Verification and limits

npm test checks every CLI operation, atomic and repeat imports, custom mapping, stale-review rejection, independent reviewers, closed-file controls, append-only history, invalid dates, archives, drafts, escaped HTML and process exit codes. Linux and Windows run through the included workflow. [Build evidence](docs/verification.md).

Service dates are confirmed by the handler using the correct business-day calendar and applicability; the base does not calculate legal deadlines. Actor names are labels, not authenticated identities. Missing dates and unknown scope are surfaced. No portal, signatures, coverage rules, policy administration, reserves, payments or automated compliance certificate is included. Back up the database and test restoration; the JSON archive has no automatic restore command.
