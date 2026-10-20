# Service record checks

Checked 20 October 2026. These checks help a handler inspect records. They do not decide cover, issue a policy, calculate reserves, initiate payments, or certify regulatory compliance.

The [ICNZ Fair Insurance Code 2020](https://www.icnz.org.nz/wp-content/uploads/2023/01/Fair_Insurance_Code_2020.pdf), pages 2 and 10, applies to member insurers, general insurance rather than health/life, and individuals or entities with 19 or fewer employees. The [current Code page](https://www.icnz.org.nz/individuals/about-the-code/) identifies this version. Lloyd's coverholder scope and other details require checking the Code itself. The user records applies, outside or unknown with a reason; unknown is always a finding on an open claim.

Paragraph 17 specifies acknowledgement within five business days and an acceptance decision within ten business days after all required information is available. Paragraph 18 requires an explanation and expected decision timing when that cannot be met, with progress at least every twenty business days or an agreed interval. Paragraphs 21 and 22 address catastrophes. Paragraphs 9 to 14 concern privacy and storage. These are Code obligations, not a universal statutory deadline for every insurer.

The operator supplies ack_due, update_due and, when applicable, decision_due after checking the applicable business-day calendar, holidays, complete-information date, catastrophe context and agreed interval. The tool does not derive dates from calendar days. Missing acknowledgement or progress dates for an applicable open claim are findings, not evidence of compliance. A decision follow-up date is not proof all required information was available. Store that basis in the scope reason and history before relying on it.

| Check | What it actually tests | Basis |
|---|---|---|
| scope_unknown, scope_reason_missing | Applicability has not been confirmed with a reason | Code scope, page 2 |
| ack_deadline_missing, ack_overdue, late_ack | Recorded acknowledgement and confirmed deadline | Paragraph 17 |
| update_deadline_missing, update_overdue | Confirmed next update date has passed or is missing | Paragraph 18 or operator-agreed interval |
| decision_followup_overdue | A handler-set follow-up date has passed | Paragraphs 17 and 18; obtain a decision or explanation |
| owner_missing | No assigned handler | Internal operational control, not a quoted legal rule |

Evidence receipt, different-handler review, stale-review rejection and external-resolution references are internal file controls. The desk does not determine whether evidence is sufficient under a policy. A clean finding list means only that these stored-record checks found nothing. Complaints, Australian codes, privacy requests, retention schedules and other duties need their own approved process.

Keep evidence in approved private storage and store references here. Configure access, backups, retention and agent data-sharing policy before business use. This local trusted-operator base has no customer portal, authentication service or tenant access layer. Never expose its owner connection publicly.
