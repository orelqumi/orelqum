import {json,fail,actor,ready,mustAuth,originOK,bodyJSON,clean,emailOK} from './_lib.js';
const allowed=['New','Contacted','Quoted','Interested','Won','Cancelled','Lost'];
const sources=['Website enquiry','WhatsApp','Phone call','Facebook','Instagram','TikTok','Referral','Other'];
export async function onRequestGet({request,env}){
 if(!ready(env))return fail('Database not configured.',503);
 const u=await actor(request,env);const denied=mustAuth(u,'admin');if(denied)return denied;
 try{const r=await env.DB.prepare('SELECT id,full_name,phone,email,website_type,source,budget_kes,status,cancellation_reason,notes,last_contacted_at,created_at,updated_at FROM leads ORDER BY updated_at DESC LIMIT 1000').all();return json({leads:r.results||[]});}
 catch{return fail('CRM table unavailable. Run crm-migration.sql in Cloudflare D1.',503)}
}
export async function onRequestPost({request,env}){
 if(!ready(env))return fail('Database not configured.',503);
 if(!originOK(request))return fail('Invalid origin.',403);
 const u=await actor(request,env);const denied=mustAuth(u,'admin');if(denied)return denied;
 try{
  const b=await bodyJSON(request),act=clean(b.action,24),db=env.DB;
  if(act==='create'){
   const name=clean(b.full_name,120),phone=clean(b.phone,32),email=clean(b.email,180).toLowerCase(),type=clean(b.website_type,120),source=clean(b.source,30),notes=clean(b.notes,1500),budget=b.budget_kes?Number(b.budget_kes):null;
   if(name.length<2||!type||(email&&!emailOK(email))||(!phone&&!email)||(!sources.includes(source)))return fail('Add a name, website type, and a valid phone or email.');
   if(budget!==null&&(!Number.isInteger(budget)||budget<0||budget>50000000))return fail('Invalid budget.');
   const id=crypto.randomUUID();await db.prepare('INSERT INTO leads(id,full_name,phone,email,website_type,source,budget_kes,notes) VALUES(?,?,?,?,?,?,?,?)').bind(id,name,phone,email,type,source,budget,notes).run();return json({ok:true,id});
  }
  if(act==='update'){
   const id=clean(b.id,50),status=clean(b.status,30),reason=clean(b.cancellation_reason,500),notes=clean(b.notes,1500),lastContacted=!!b.mark_contacted;
   if(!allowed.includes(status))return fail('Invalid customer status.');
   if(status==='Cancelled'&&!reason)return fail('Please record why the customer cancelled.');
   const r=await db.prepare("UPDATE leads SET status=?,cancellation_reason=?,notes=?,last_contacted_at=CASE WHEN ? THEN datetime('now') ELSE last_contacted_at END,updated_at=datetime('now') WHERE id=?").bind(status,reason,notes,lastContacted?1:0,id).run();return r.meta.changes?json({ok:true}):fail('Lead not found.',404);
  }
  return fail('Unsupported operation.');
 }catch(e){return fail('Unable to save the enquiry. Check D1 database setup.',500)}
}
