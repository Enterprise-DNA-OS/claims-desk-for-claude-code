import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { getDb, REPO_ROOT } from './lib/db.mjs';
import { parseCsv, pick } from './lib/csv.mjs';

export const commands=['init','claims','show','intake','assign','set-service','acknowledge','log-update','request-evidence','receive-evidence','evidence-chase','review-queue','record-review','close','diary','attention','compliance','insights','history','import','export','draft-update','weekly-review'];
const tables=['workspace','claims','evidence','reviews','claim_events'];
function required(v,label){if(typeof v!=='string'||!v.trim())throw Error(`${label} is required`);return String(v).trim();}
function date(v,label,{optional=false}={}){if(optional&&!v)return null;if(!/^\d{4}-\d{2}-\d{2}$/.test(v||'')||new Date(v+'T00:00:00Z').toISOString().slice(0,10)!==v)throw Error(`${label} must be a real YYYY-MM-DD date`);return v;}
const today=()=>new Date().toISOString().slice(0,10);
function past(v,label){date(v,label);if(v>today())throw Error(`${label} cannot be in the future`);return v;}
function options(args){const pos=[],opts={};for(const a of args){if(a.startsWith('--')){const i=a.indexOf('=');const k=a.slice(2,i<0?undefined:i);if(k in opts)throw Error(`Duplicate option --${k}`);opts[k]=i<0?true:a.slice(i+1);}else pos.push(a);}return {pos,opts};}
export function display(data){
 if(!Array.isArray(data))return JSON.stringify(data,null,2);
 if(!data.length)return 'No records.';
 const keys=Object.keys(data[0]);const cell=(v)=>v===null?'':typeof v==='object'?JSON.stringify(v):String(v);
 return [keys.join(' | '),keys.map(()=> '---').join(' | '),...data.map(r=>keys.map(k=>cell(r[k]).replace(/[\r\n]+/g,' ')).join(' | '))].join('\n');
}
async function resolve(db,ref,table='claims'){
 required(ref,table==='claims'?'Claim':'Evidence');
 const list=table==='claims'?await db.query('select * from claims order by number'):await db.query('select * from evidence order by due_date,id');
 const key=table==='claims'?'number':'description', term=ref.toLowerCase();
 const exact=list.filter(r=>r.id===ref||String(r[key]).toLowerCase()===term);
 const matches=exact.length?exact:list.filter(r=>r.id.toLowerCase().startsWith(term)||String(r[key]).toLowerCase().includes(term)||(table==='claims'&&r.claimant.toLowerCase().includes(term)));
 if(matches.length!==1)throw Error(`${matches.length?'Ambiguous':'No matching'} ${table}: ${ref}\n${display((matches.length?matches:list).map(r=>({id:r.id,[key]:r[key]})))}`);
 return matches[0];
}
async function open(db,ref){const c=await resolve(db,ref);if(c.status!=='open')throw Error(`Claim ${c.number} is closed`);return c;}
async function event(db,c,actor,action,detail){await db.query('insert into claim_events(claim_id,actor,action,detail) values($1,$2,$3,$4)',[c?.id||null,required(actor,'--actor'),action,JSON.stringify(detail)]);}
async function revise(db,id){await db.query('update claims set revision=revision+1 where id=$1',[id]);}
async function transaction(db,fn,dry=false){await db.exec('BEGIN ISOLATION LEVEL SERIALIZABLE');try{const result=await fn();await db.exec(dry?'ROLLBACK':'COMMIT');return result;}catch(e){await db.exec('ROLLBACK');throw e;}}
function writePrivate(dir,name,contents){const dest=path.resolve(process.env.OUTPUT_DIR||REPO_ROOT,dir);fs.mkdirSync(dest,{recursive:true,mode:0o700});const file=path.join(dest,name);fs.writeFileSync(file,contents,{mode:0o600,flag:'wx'});return file;}
function fileStamp(){return `${Date.now()}-${Math.random().toString(16).slice(2,10)}`;}

export async function run(db,args){
 const {pos,opts:o}=options(args),[cmd,ref,third]=pos;
 if(!commands.includes(cmd))throw Error(`Commands: ${commands.join(', ')}`);
 const allowed={init:['name'],claims:[],show:[],intake:['number','claimant','policy','loss','received','type','summary','owner','actor'],assign:['owner','actor'],'set-service':['scope','reason','ack-due','update-due','decision-due','actor'],acknowledge:['date','reference','actor'],'log-update':['date','next','reference','actor'],'request-evidence':['description','from','due','actor'],'receive-evidence':['date','reference','actor'],'evidence-chase':[],'review-queue':[],'record-review':['reviewer','note','actor'],close:['reference','actor'],diary:[],attention:[],compliance:[],insights:[],history:[],import:['map','dry-run','actor'],export:[],'draft-update':[],'weekly-review':[]};
 for(const k of Object.keys(o))if(k!=='json'&&!allowed[cmd].includes(k))throw Error(`Unknown option --${k} for ${cmd}`);
 const maxPos=cmd==='import'?3:['show','assign','set-service','acknowledge','log-update','request-evidence','receive-evidence','record-review','close','history','draft-update'].includes(cmd)?2:1;
 if(pos.length>maxPos)throw Error('Unexpected positional arguments');
 for(const [k,v] of Object.entries(o))if(v===true&&!['json','dry-run'].includes(k))throw Error(`--${k} requires a value`);
 const workspace=await db.query('select * from workspace');
 if(cmd==='init'){if(workspace.length)throw Error('Workspace already exists');return db.query('insert into workspace(name) values($1) returning name',[required(o.name,'--name')]);}
 if(!workspace.length)throw Error('Initialise your business with init --name=, or seed a fictional demo');
 if(cmd==='claims')return db.query('select number,claimant,owner,status,evidence_waiting,review_current,age_days from claim_desk order by number');
 if(cmd==='show'){const c=await resolve(db,ref);return {claim:c,evidence:await db.query('select * from evidence where claim_id=$1 order by due_date',[c.id]),reviews:await db.query('select * from reviews where claim_id=$1 order by reviewed_at',[c.id])};}
 if(cmd==='evidence-chase')return db.query('select number,owner,description,requested_from,due_date,days_overdue from evidence_chase order by due_date,number');
 if(cmd==='review-queue')return db.query("select number,owner,evidence_waiting,review_current,age_days from claim_desk where status='open' order by evidence_waiting,age_days desc,number");
 if(cmd==='diary')return db.query('select number,owner,obligation,due_date from service_diary order by due_date nulls first,number,obligation');
 if(cmd==='compliance')return db.query('select number,rule,finding from compliance_findings order by number,rule');
 if(cmd==='attention')return db.query("select number,owner,evidence_overdue,ack_due,update_due,review_current from claim_desk where status='open' and (evidence_overdue>0 or owner='' or (ack_date is null and ack_due<current_date) or update_due<current_date or code_scope='unknown') order by number");
 if(cmd==='history'){const c=await resolve(db,ref);return db.query('select actor,action,detail,created_at from claim_events where claim_id=$1 order by created_at,id',[c.id]);}
 if(cmd==='insights'){
  const queries=[
   ['Which handlers have overdue evidence?',"select owner,count(*) as requests from evidence_chase where due_date<current_date group by owner order by owner"],
   ['Which claims are missing a handler?',"select number,claimant from claims where status='open' and owner='' order by number"],
   ['Which claims need Code scope confirmation?',"select number,claimant from claims where status='open' and code_scope='unknown' order by number"],
   ['Which claims have all requested evidence and need review?',"select number,owner from claim_desk where status='open' and evidence_waiting=0 and not review_current order by number"],
   ['Which records changed after an administrative review?',"select c.number,c.revision from claims c where status='open' and exists(select 1 from reviews r where r.claim_id=c.id) and not exists(select 1 from reviews r where r.claim_id=c.id and r.revision=c.revision) order by number"],
   ['Which third parties are holding up evidence?',"select requested_from,count(*) as overdue_requests from evidence_chase where due_date<current_date group by requested_from order by requested_from"],
   ['Which claims have overdue progress updates?',"select number,owner,update_due from claims where status='open' and update_due<current_date order by update_due,number"],
   ['Which acknowledgements were recorded late?',"select number,ack_due,ack_date from claims where ack_date>ack_due order by number"],
   ['Which claim types have the oldest open records?',"select claim_type,count(*) as open_claims,max(current_date-received_date) as oldest_days from claims where status='open' group by claim_type order by oldest_days desc,claim_type"],
   ['Which reviewed claims are ready for a closure check?',"select number,owner from claim_desk where status='open' and evidence_waiting=0 and review_current order by number"]
  ];const result=[];for(const [question,sql]of queries)result.push({question,rows:await db.query(sql)});return result;
 }
 if(cmd==='export')return transaction(db,async()=>{const archive={format:'claims-desk-v1',exported_at:new Date().toISOString(),records:{}};for(const t of tables)archive.records[t]=await db.query(`select * from ${t} order by id`);return {file:writePrivate('exports',`claims-${fileStamp()}.json`,JSON.stringify(archive,null,2)+'\n'),counts:Object.fromEntries(tables.map(t=>[t,archive.records[t].length]))};});
 if(cmd==='draft-update'||cmd==='weekly-review'){
  let title,body;
  if(cmd==='draft-update'){const c=await resolve(db,ref);title=`Claim ${c.number}: internal update draft`;const ev=await db.query('select description,requested_from,due_date,received_date,reference from evidence where claim_id=$1 order by due_date',[c.id]);body=`Claimant: ${c.claimant}\nHandler: ${c.owner||'Unassigned'}\nSummary: ${c.summary}\nNext progress update: ${c.update_due||'Not set'}\n\n${display(ev)}\n\nHandler: verify these facts and write the customer wording before sending through your approved process. No coverage decision or payment promise is made here.`;}
  else {title='Weekly claims review';body='';for(const c of ['attention','evidence-chase','review-queue'])body+=`\n## ${c}\n\n${display(await run(db,[c]))}\n`;}
  return {file:writePrivate('drafts',`${cmd}-${fileStamp()}.md`,`# ${title}\n\nINTERNAL DRAFT. Not sent. Fictional only when using demo data.\n\n${body}\n`)};
 }
 const actor=required(o.actor,'--actor');
 if(cmd==='import'){
  if(ref!=='salesforce')throw Error('Use import salesforce <claims.csv>');required(third,'CSV path');
  const map=o.map?JSON.parse(fs.readFileSync(o.map,'utf8')):{};
  const fields={source_id:['Id','Claim ID'],number:['Name','Claim Number'],claimant:['AccountId','Account ID','Account Name'],policy_ref:['PolicyNumberId','Insurance Policy ID'],loss_date:['ClaimLossDate','Claim Loss Date'],received_date:['CreatedDate','Created Date'],claim_type:['ClaimType','Claim Type'],summary:['Summary'],source_status:['Status'],owner:['OwnerId','Owner ID','Owner Name']};
  for(const k of Object.keys(map))if(!(k in fields)||typeof map[k]!=='string')throw Error(`Invalid map field ${k}`);
  const rows=parseCsv(fs.readFileSync(third,'utf8'));
  if(!rows.length)throw Error('No data rows in export');const ids=new Set(),numbers=new Set();
  const prepared=rows.map((row,i)=>{const v={};for(const [k,names]of Object.entries(fields))v[k]=pick(row,...(map[k]?[map[k]]:names)).trim();required(v.source_id,`Row ${i+2} Claim ID`);required(v.number,`Row ${i+2} Claim Number`);if(ids.has(v.source_id)||numbers.has(v.number))throw Error('Duplicate source ID or claim number in file');ids.add(v.source_id);numbers.add(v.number);v.received_date=date(v.received_date.slice(0,10),'Created Date');v.loss_date=date(v.loss_date.slice(0,10),'Claim Loss Date',{optional:true});if(v.received_date>today()||(v.loss_date&&v.loss_date>v.received_date))throw Error('Invalid chronology in export');return v;});
  return transaction(db,async()=>{let added=0,changed=0,unchanged=0;for(const v of prepared){const existing=(await db.query('select * from claims where source_id=$1',[v.source_id]))[0];const keys=Object.keys(fields);if(existing){if(keys.every(k=>(existing[k]??'')===(v[k]??''))){unchanged++;continue;}if(existing.status==='closed')throw Error(`Cannot change closed claim ${existing.number}`);await db.query(`update claims set ${keys.map((k,i)=>`${k}=$${i+1}`).join(',')},revision=revision+1 where id=$${keys.length+1}`,[...keys.map(k=>v[k]),existing.id]);changed++;await event(db,existing,actor,'import-update',v);}else{const [c]=await db.query(`insert into claims(${keys.join(',')}) values(${keys.map((_,i)=>'$'+(i+1)).join(',')}) returning id`,keys.map(k=>v[k]));added++;await event(db,c,actor,'import-add',v);}}return {dry_run:Boolean(o['dry-run']),added,changed,unchanged,rows:prepared.length,scope:'Claim headers only; imported status retained as source_status. Local claims start open and need scope and service dates.'};},Boolean(o['dry-run']));
 }
 return transaction(db,async()=>{
  let c,result;
  if(cmd==='intake'){
   const received=past(o.received||today(),'--received'),loss=date(o.loss,'--loss',{optional:true});
   [c]=await db.query('insert into claims(number,claimant,policy_ref,loss_date,received_date,claim_type,summary,owner) values($1,$2,$3,$4,$5,$6,$7,$8) returning *',[required(o.number,'--number'),required(o.claimant,'--claimant'),o.policy||'',loss,received,o.type||'',required(o.summary,'--summary'),o.owner||'']);result={number:c.number,id:c.id};
  }else if(cmd==='receive-evidence'){
   const e=await resolve(db,ref,'evidence');c=await open(db,e.claim_id);if(e.received_date)throw Error('Evidence already received; add a new request for a correction');
   const d=past(o.date||today(),'--date');if(d<c.received_date)throw Error('Receipt precedes claim intake');await db.query('update evidence set received_date=$1,reference=$2 where id=$3',[d,required(o.reference,'--reference'),e.id]);await revise(db,c.id);result={number:c.number,evidence:e.description,received:d};
  }else{
   c=await open(db,ref);
   if(cmd==='assign'){await db.query('update claims set owner=$1,revision=revision+1 where id=$2',[required(o.owner,'--owner'),c.id]);result={number:c.number,owner:o.owner};}
   if(cmd==='set-service'){
    if(!['applies','outside','unknown'].includes(o.scope))throw Error('--scope must be applies, outside or unknown');
    const reason=required(o.reason,'--reason');const ack=date(o['ack-due'],'--ack-due',{optional:true}),update=date(o['update-due'],'--update-due',{optional:true}),decision=date(o['decision-due'],'--decision-due',{optional:true});
    if([ack,update,decision].some(d=>d&&d<c.received_date))throw Error('Service date precedes claim intake');
    await db.query('update claims set code_scope=$1,scope_reason=$2,ack_due=$3,update_due=$4,decision_due=$5,revision=revision+1 where id=$6',[o.scope,reason,ack,update,decision,c.id]);result={number:c.number,scope:o.scope,ack_due:ack,update_due:update,decision_due:decision};
   }
   if(cmd==='acknowledge'){
    if(c.ack_date)throw Error('Acknowledgement already recorded');const d=past(o.date||today(),'--date');required(o.reference,'--reference');await db.query('update claims set ack_date=$1,revision=revision+1 where id=$2',[d,c.id]);result={number:c.number,acknowledged:d,reference:o.reference};
   }
   if(cmd==='log-update'){
    const d=past(o.date||today(),'--date'),next=date(o.next,'--next');if(next<=d)throw Error('Next update must be after this update');if(c.last_update&&d<c.last_update)throw Error('Update predates the last recorded update');required(o.reference,'--reference');await db.query('update claims set last_update=$1,update_due=$2,revision=revision+1 where id=$3',[d,next,c.id]);result={number:c.number,updated:d,next,reference:o.reference};
   }
   if(cmd==='request-evidence'){
    const [e]=await db.query('insert into evidence(claim_id,description,requested_from,due_date) values($1,$2,$3,$4) returning id',[c.id,required(o.description,'--description'),required(o.from,'--from'),date(o.due,'--due')]);await revise(db,c.id);result={number:c.number,evidence_id:e.id};
   }
   if(cmd==='record-review'){
    const reviewer=required(o.reviewer,'--reviewer');if(!c.owner||reviewer.toLowerCase()===c.owner.trim().toLowerCase())throw Error('Review needs an assigned handler and a different reviewer');
    const pending=await db.query('select id from evidence where claim_id=$1 and received_date is null',[c.id]);if(pending.length)throw Error('Receive outstanding evidence before review');
    if(c.code_scope==='unknown')throw Error('Confirm Code scope before review');
    await db.query('insert into reviews(claim_id,revision,reviewer,note) values($1,$2,$3,$4)',[c.id,c.revision,reviewer,required(o.note,'--note')]);result={number:c.number,revision:c.revision,reviewer,meaning:'Administrative file review only, no coverage or payment decision'};
   }
   if(cmd==='close'){
    const [state]=await db.query('select * from claim_desk where id=$1',[c.id]);if(!state.review_current||state.evidence_waiting)throw Error('Closure requires all requested evidence and a current independent review');
    const reference=required(o.reference,'--reference');await db.query("update claims set status='closed',closed_date=current_date,resolution_ref=$1 where id=$2",[reference,c.id]);result={number:c.number,status:'closed',resolution_ref:reference};
   }
  }
  if(!result)throw Error('Unsupported operation');await event(db,c,actor,cmd,{...result,inputs:o});return result;
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){let db;try{db=await getDb();const result=await run(db,process.argv.slice(2));console.log(process.argv.includes('--json')?JSON.stringify(result,null,2):display(result));}catch(e){console.error(e.message);process.exitCode=1;}finally{await db?.close();}}
