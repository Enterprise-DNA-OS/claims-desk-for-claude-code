create table workspace (id uuid primary key default gen_random_uuid(), name text not null unique check(length(trim(name))>0), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table claims (
 id uuid primary key default gen_random_uuid(), source_id text unique, number text not null unique check(length(trim(number))>0),
 claimant text not null default '', policy_ref text not null default '', loss_date date, received_date date not null default current_date,
 claim_type text not null default '', summary text not null default '', source_status text not null default '',
 owner text not null default '', status text not null default 'open' check(status in ('open','closed')),
 code_scope text not null default 'unknown' check(code_scope in ('unknown','applies','outside')),
 scope_reason text not null default '', ack_due date, ack_date date, update_due date, last_update date, decision_due date,
 resolution_ref text not null default '', closed_date date, revision integer not null default 1,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check(loss_date is null or loss_date<=received_date), check(ack_date is null or ack_date>=received_date),
 check(last_update is null or last_update>=received_date), check((status='closed')=(closed_date is not null))
);
create table evidence (
 id uuid primary key default gen_random_uuid(), claim_id uuid not null references claims(id), description text not null check(length(trim(description))>0),
 requested_from text not null check(length(trim(requested_from))>0), due_date date not null, received_date date, reference text not null default '',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check(received_date is null or length(trim(reference))>0)
);
create table reviews (
 id uuid primary key default gen_random_uuid(), claim_id uuid not null references claims(id), revision integer not null,
 reviewer text not null, note text not null, reviewed_at timestamptz not null default now(),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table claim_events (
 id uuid primary key default gen_random_uuid(), claim_id uuid references claims(id), actor text not null, action text not null, detail jsonb not null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create function touch_updated() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
create trigger touch_claims before update on claims for each row execute function touch_updated();
create trigger touch_evidence before update on evidence for each row execute function touch_updated();
create trigger touch_workspace before update on workspace for each row execute function touch_updated();
create function immutable_history() returns trigger language plpgsql as $$ begin raise exception 'History is append-only'; end $$;
create trigger immutable_events before update or delete on claim_events for each row execute function immutable_history();
create trigger immutable_reviews before update or delete on reviews for each row execute function immutable_history();
create view claim_desk as
 select c.id,c.number,c.claimant,c.owner,c.status,c.code_scope,c.received_date,c.ack_due,c.ack_date,c.update_due,c.last_update,c.decision_due,c.revision,
 (select count(*)::int from evidence e where e.claim_id=c.id and e.received_date is null) as evidence_waiting,
 (select count(*)::int from evidence e where e.claim_id=c.id and e.received_date is null and e.due_date<current_date) as evidence_overdue,
 exists(select 1 from reviews r where r.claim_id=c.id and r.revision=c.revision and lower(trim(r.reviewer))<>lower(trim(c.owner))) as review_current,
 current_date-c.received_date as age_days
 from claims c;
create view evidence_chase as select e.id,c.number,c.claimant,c.owner,e.description,e.requested_from,e.due_date,current_date-e.due_date as days_overdue
 from evidence e join claims c on c.id=e.claim_id where e.received_date is null and c.status='open';
create view service_diary as select id,number,owner,'acknowledgement' as obligation,ack_due as due_date from claims where status='open' and ack_date is null
 union all select id,number,owner,'progress update',update_due from claims where status='open'
 union all select id,number,owner,'decision follow-up',decision_due from claims where status='open' and decision_due is not null;
create view compliance_findings as
 select id,number,'scope_unknown' as rule,'Confirm whether the ICNZ Code applies' as finding from claims where status='open' and code_scope='unknown'
 union all select id,number,'scope_reason_missing','Record the scope decision basis' from claims where status='open' and code_scope<>'unknown' and scope_reason=''
 union all select id,number,'owner_missing','Assign a responsible handler' from claims where status='open' and owner=''
 union all select id,number,'ack_deadline_missing','Confirm the acknowledgement deadline' from claims where status='open' and code_scope='applies' and ack_date is null and ack_due is null
 union all select id,number,'ack_overdue','Acknowledgement evidence is overdue' from claims where status='open' and ack_date is null and ack_due<current_date
 union all select id,number,'late_ack','Recorded acknowledgement was after its deadline' from claims where ack_date>ack_due
 union all select id,number,'update_deadline_missing','Set the next agreed progress-update deadline' from claims where status='open' and code_scope='applies' and update_due is null
 union all select id,number,'update_overdue','Progress-update evidence is overdue' from claims where status='open' and update_due<current_date
 union all select id,number,'decision_followup_overdue','Obtain the insurer decision or its explanation and next date' from claims where status='open' and decision_due<current_date;
alter table workspace enable row level security;
alter table claims enable row level security;
alter table evidence enable row level security;
alter table reviews enable row level security;
alter table claim_events enable row level security;
revoke all on all tables in schema public from public;
