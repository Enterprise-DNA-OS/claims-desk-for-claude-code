# Build verification

20 October 2026, Node 22 on Linux.

- npm install: complete, no dependency audit findings.
- npm test: PASS, all 23 CLI operations exercised. Checks cover independent administrative review, stale-review rejection, closure locking, repeat imports, custom mapping, dry-run rollback, failed-file rollback, invalid dates, immutable history, JSON archives, private drafts, HTML escaping and exit codes.
- npm run demo: PASS on a fresh temporary database. Twelve claim documents and three read-only views rendered. Three page examples were captured from these actual runs.
- Browser inspection: claim-file pack at desktop width and evidence-chase view at phone width. No page-width overflow on the phone; wide records scroll inside their section. Rendered record text is escaped.
- Brand lint: no errors or warnings. No author placeholders, em dashes or prohibited voice terms in authored prose.
- Schema exercised through PGlite's Postgres engine. A separate Postgres server has not been exercised.
- A Node 22 Linux and Windows workflow is included. Local execution was Linux only; remote workflow results are recorded after push.

The base is an operational record desk. Service dates are operator-confirmed; tests do not establish insurance compliance. All demo businesses are fictional. Actor and reviewer labels are not authenticated identities. No insurance decision, reserve, payment or message is executed.
