import {json,fail,actor,ready,mustAuth,originOK,bodyJSON,clean,emailOK,passwordOK,passwordHash,randomHex} from './_lib.js';
export async function onRequestPost({request,env}){
 if(!ready(env))return fail('Database not configured.',503);
 if(!originOK(request))return fail('Invalid origin.',403);
 const u=await actor(request,env);const denied=mustAuth(u,'admin');if(denied)return denied;
 try{
  const b=await bodyJSON(request),action=clean(b.action,30),db=env.ORELQUMI_DB;
  if(action==='customer'){
   const name=clean(b.name,100),email=clean(b.email,180).toLowerCase(),password=b.password;
   if(name.length<2||!emailOK(email)||!passwordOK(password))return fail('Provide name, email and a temporary password of at least 12 characters.');
   const salt=randomHex(18),hash=await passwordHash(password,salt),id=crypto.randomUUID();
   await db.prepare("INSERT INTO users(id,email,name,role,password_salt,password_hash) VALUES(?,?,?,'customer',?,?)").bind(id,email,name,salt,hash).run();
   return json({ok:true,id});
  }
  if(action==='project'){
   const customerId=clean(b.customer_id,50),title=clean(b.title,130),category=clean(b.category,70),description=clean(b.description,1600);
   const match=await db.prepare("SELECT id FROM users WHERE id=? AND role='customer'").bind(customerId).first();
   if(!match||title.length<3||!category)return fail('Select a customer and enter the project title and category.');
   const id=crypto.randomUUID();await db.prepare('INSERT INTO projects(id,customer_id,title,category,description) VALUES(?,?,?,?,?)').bind(id,customerId,title,category,description).run();
   return json({ok:true,id});
  }
  if(action==='project_update'){
   const id=clean(b.project_id,50),status=clean(b.status,30),progress=Number(b.progress),description=clean(b.description,1600);
   if(!['Planning','Design','Development','Review','Completed','On hold'].includes(status)||!Number.isInteger(progress)||progress<0||progress>100)return fail('Invalid project status or progress.');
   const result=await db.prepare("UPDATE projects SET status=?,progress=?,description=?,updated_at=datetime('now') WHERE id=?").bind(status,progress,description,id).run();
   return result.meta.changes?json({ok:true}):fail('Project not found.',404);
  }
  if(action==='invoice'){
   const customerId=clean(b.customer_id,50),projectId=clean(b.project_id,50)||null,description=clean(b.description,200),invoiceNumber=clean(b.invoice_number,50).toUpperCase(),amount=Number(b.amount_kes),dueDate=clean(b.due_date,10)||null;
   if(!/^ORQ-[A-Z0-9-]{4,40}$/.test(invoiceNumber)||!Number.isFinite(amount)||!Number.isInteger(Math.round(amount*100))||amount<3||amount>1000000||!description)return fail('Use an ORQ- invoice number, description and a valid KES amount.');
   const client=await db.prepare("SELECT id FROM users WHERE id=? AND role='customer'").bind(customerId).first();if(!client)return fail('Customer does not exist.');
   if(projectId){const p=await db.prepare('SELECT id FROM projects WHERE id=? AND customer_id=?').bind(projectId,customerId).first();if(!p)return fail('Project does not belong to the selected customer.');}
   if(dueDate&&!/^\d{4}-\d{2}-\d{2}$/.test(dueDate))return fail('Invalid due date.');
   const id=crypto.randomUUID();await db.prepare('INSERT INTO invoices(id,customer_id,project_id,invoice_number,description,amount_cents,due_date) VALUES(?,?,?,?,?,?,?)').bind(id,customerId,projectId,invoiceNumber,description,Math.round(amount*100),dueDate).run();
   return json({ok:true,id});
  }
  if(action==='cancel_invoice'){
   const id=clean(b.invoice_id,50);const result=await db.prepare("UPDATE invoices SET status='Cancelled' WHERE id=? AND status='Unpaid'").bind(id).run();return result.meta.changes?json({ok:true}):fail('Only unpaid invoices can be cancelled.',400);
  }
  return fail('Unsupported operation.');
 }catch(e){if(/UNIQUE constraint failed/.test(String(e)))return fail('This email or invoice number already exists.',409);return fail('Could not save this record.',500)}
}
