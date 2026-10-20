# Bring Salesforce claim headers across

Export a tabular Claim report using Details Only, CSV and UTF-8, with Export Reports permission. Salesforce documents the [report export path](https://help.salesforce.com/s/articleView?id=sf.reports_export.htm&language=en_US&type=5) and the [Claim fields](https://developer.salesforce.com/docs/platform/field-reference/references/field-reference/salesforce-field-reference-claim.html). Your administrator must expose the fields through a suitable report type. Export stable Claim ID and Claim Number values. The sample is synthetic and demonstrates these documented fields, not a captured customer export.

```bash
npm install
npm run migrate
node scripts/claims.mjs init --name="Your business"
node scripts/claims.mjs import salesforce imports/claims.csv --dry-run --actor="Your name"
node scripts/claims.mjs import salesforce imports/claims.csv --actor="Your name"
```

| Desk field | API header or report label |
|---|---|
| source_id | Id / Claim ID |
| number | Name / Claim Number |
| claimant | AccountId / Account ID / Account Name |
| policy_ref | PolicyNumberId / Insurance Policy ID |
| loss_date | ClaimLossDate / Claim Loss Date |
| received_date | CreatedDate / Created Date |
| claim_type | ClaimType / Claim Type |
| summary | Summary |
| source_status | Status |
| owner | OwnerId / Owner ID / Owner Name |

IDs are retained as text when the export has no names. CreatedDate is intake date in this mapping; use a custom map if the business records actual receipt elsewhere. Export dates as ISO dates or ISO timestamps and verify the timezone before mapping. For custom or translated labels, provide a mapping from the left-hand field to the exact export header with --map=examples/column-map.json. Include every field you want retained. Missing optional source columns become empty on re-import.

The complete file is validated before writes. Import is atomic, and --dry-run rolls back all changes and events. Repeat imports match source IDs. Changed headers, including the handler, replace the previous mapped values and invalidate any administrative review. Unchanged rows do nothing. An altered row for a closed local claim fails the whole file. Duplicate IDs, claim numbers, invalid dates and conflicts fail without partial changes.

Only claim headers move in this command. Policy wordings, coverage calculations, attachments, evidence requests, activity histories, relationships, reserves, payments, users, permissions and workflow rules do not move. Source status remains visible, while each imported claim starts locally open for reconciliation. Confirm counts and samples, assign owners, record scope and service dates, and reconcile closed source claims before using the desk. Keep the insurer's existing decision and financial systems in place. There is no claim decision or payment migration here.

A representative export imports in one command after setup. Full operational migration needs reconciliation and approved scope; there is no promise that an entire insurance platform can be replaced in a day. JSON export is a portable archive of this desk, not an automatic restore command. Maintain tested database backups.
