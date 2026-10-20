# Claims desk command reference

Use Node 22. Run npm run migrate, then initialise a business with init or use npm run seed for fictional data. All reads accept --json. Dates use YYYY-MM-DD; export CreatedDate timestamps are reduced to their UTC date component. Names match without case, UUID prefixes match, ambiguity lists candidates and exits 1.

## init

Create the business workspace.

```bash
node scripts/claims.mjs init --name="Your business"
```



## claims

Read the claims desk.

```bash
node scripts/claims.mjs claims
```



## show

Read a claim and its evidence.

```bash
node scripts/claims.mjs show "<claim number, name or id prefix>"
```



## intake

Record first notice of loss.

```bash
node scripts/claims.mjs intake --number="<claim number>" --claimant="<claimant>" --summary="<facts received>" --received=YYYY-MM-DD --loss=YYYY-MM-DD --policy="<reference>" --type="<type>" --owner="<handler>" --actor="<operator>"
```



## assign

Allocate the handler.

```bash
node scripts/claims.mjs assign "<claim>" --owner="<handler>" --actor="<operator>"
```



## set-service

Confirm service dates and Code scope.

```bash
node scripts/claims.mjs set-service "<claim>" --scope=applies --reason="<basis and calendar checked>" --ack-due=YYYY-MM-DD --update-due=YYYY-MM-DD --decision-due=YYYY-MM-DD --actor="<operator>"
```

Read docs/compliance.md. The operator confirms applicability, business-day calendar and any agreed interval. Omitted date options clear the corresponding stored date. Show current dates first and preserve any date that should remain. Use scope outside or unknown when appropriate; record the reason. This operation never calculates statutory dates.

## acknowledge

Record acknowledgement already made.

```bash
node scripts/claims.mjs acknowledge "<claim>" --date=YYYY-MM-DD --reference="<communication reference>" --actor="<operator>"
```



## log-update

Record a progress update already made.

```bash
node scripts/claims.mjs log-update "<claim>" --date=YYYY-MM-DD --next=YYYY-MM-DD --reference="<communication reference>" --actor="<operator>"
```



## request-evidence

Record an evidence request.

```bash
node scripts/claims.mjs request-evidence "<claim>" --description="<record needed>" --from="<party>" --due=YYYY-MM-DD --actor="<operator>"
```



## receive-evidence

Record evidence received.

```bash
node scripts/claims.mjs receive-evidence "<evidence id or description>" --date=YYYY-MM-DD --reference="<private document reference>" --actor="<operator>"
```



## evidence-chase

Chase missing evidence.

```bash
node scripts/claims.mjs evidence-chase
```



## review-queue

Review the claim file queue.

```bash
node scripts/claims.mjs review-queue
```



## record-review

Record an independent administrative review.

```bash
node scripts/claims.mjs record-review "<claim>" --reviewer="<reviewer other than handler>" --note="<checks and evidence inspected>" --actor="<operator>"
```

Read the claim and each linked evidence reference first. This records administrative completeness only, never approval or rejection of an insurance claim. The reviewer must differ from the assigned handler. Changes invalidate previous reviews. Actor names are operator-supplied labels, not authenticated identity.

## close

Close a resolved claim file.

```bash
node scripts/claims.mjs close "<claim>" --reference="<external insurer resolution>" --actor="<operator>"
```

Use only after an explicit operator instruction to close this claim. Verify the external resolution reference, current independent file review and all requested evidence. The command records closure; it does not make the insurer decision, pay money or send a letter.

## diary

Read the service diary.

```bash
node scripts/claims.mjs diary
```



## attention

Read overdue and unassigned work.

```bash
node scripts/claims.mjs attention
```



## compliance

Check service records.

```bash
node scripts/claims.mjs compliance
```

Read docs/compliance.md and run diary too. Explain each finding with its cited rule. Missing dates are unknown, not a pass. Distinguish internal controls from Code checks. Never state that these checks certify compliance.

## insights

Answer ten claims questions.

```bash
node scripts/claims.mjs insights
```



## history

Read a claim change history.

```bash
node scripts/claims.mjs history "<claim>"
```



## import

Bring Salesforce claim headers across.

```bash
node scripts/claims.mjs import salesforce "<claims.csv>" --dry-run --actor="<operator>"
```

Read docs/replace-salesforce-insurance-claims.md. Inspect the export and map custom headers with --map=<file>. Run a dry run, explain the rows and scope, then run without --dry-run when the operator has requested import. Re-import replaces mapped claim header fields, including owner, but preserves desk service dates and workflow status. Use the original export again only if these changes are intended.

## export

Archive all desk records.

```bash
node scripts/claims.mjs export
```

Creates a private JSON archive, including history. It is not a database backup or automatic restore file. Back up and test restoration separately. Do not commit private archives.

## draft-update

Prepare an internal progress update draft.

```bash
node scripts/claims.mjs draft-update "<claim>"
```

Read show and evidence-chase first. Prepare the internal draft, inspect it and return the result here. Never promise cover, a settlement or a payment. Nothing is sent.

## weekly-review

Prepare the weekly claims review.

```bash
node scripts/claims.mjs weekly-review
```

This draft combines attention, evidence-chase and review-queue. Read compliance as well, prioritise overdue acknowledgements and third-party delays, and hand the completed draft back in chat. Nothing is sent.

## Operating rules

The database is one business and one trusted operator. PGlite is one process at a time. Mutations use serializable transactions; retry a serialization conflict after rereading current data. Service dates are operator-confirmed calendar dates, not calculated legal deadlines. Claims start open regardless of imported source status. Import changes invalidate reviews. Closed files cannot be edited through the CLI. Actor labels do not provide authentication. History is append-only, but the database owner remains able to alter the database itself.
