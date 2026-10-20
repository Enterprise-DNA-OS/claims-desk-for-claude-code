insert into workspace(id,name) values('10000000-0000-0000-0000-000000000001','Harbour Claims Demo') on conflict do nothing;
insert into claims(id,number,claimant,policy_ref,loss_date,received_date,claim_type,summary,owner,code_scope,scope_reason,ack_due,ack_date,update_due,decision_due) values
('20000000-0000-0000-0000-000000000001','CL-1001','Kauri Books','POL-201',current_date-45,current_date-42,'Commercial property','Water damage to stock','Mere','applies','Fictional member insurer and small-business policyholder; dates manually confirmed',current_date-35,current_date-40,current_date-4,current_date-2),
('20000000-0000-0000-0000-000000000002','CL-1002','Harbour Ceramics','POL-202',current_date-20,current_date-18,'Goods in transit','Pallet damage on delivery','Mere','unknown','',current_date-11,null,current_date-1,null),
('20000000-0000-0000-0000-000000000003','CL-1003','Rimu Stationery','POL-203',current_date-8,current_date-7,'Commercial property','Broken shopfront glass','Alex','applies','Fictional member insurer; calendar checked by handler',current_date,current_date-6,current_date+7,current_date+4),
('20000000-0000-0000-0000-000000000004','CL-1004','Kauri Cycles','POL-204',current_date-12,current_date-11,'Commercial property','Storm damage to signage','','outside','Fictional business above Code employee threshold',current_date-4,current_date-8,current_date+2,null)
on conflict do nothing;
insert into evidence(id,claim_id,description,requested_from,due_date,received_date,reference) values
('30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Stock inventory at loss date','Kauri Books',current_date-7,null,''),
('30000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000001','Assessor site report','Coast Assessing',current_date-3,null,''),
('30000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000002','Carrier delivery record','Harbour Freight Demo',current_date+2,null,''),
('30000000-0000-0000-0000-000000000004','20000000-0000-0000-0000-000000000003','Glazing invoice','Rimu Stationery',current_date-2,current_date-3,'demo://glazing-invoice')
on conflict do nothing;
insert into reviews(id,claim_id,revision,reviewer,note) values('40000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003',1,'Mere','Administrative evidence check complete; insurer decides coverage') on conflict do nothing;
insert into claim_events(id,claim_id,actor,action,detail) values('50000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','Demo','seed','{"note":"All businesses and records are fictional"}') on conflict do nothing;
