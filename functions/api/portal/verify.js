import {json,fail,ready,actor,mustAuth,clean} from './_lib.js';
export async function onRequestGet({request,env}){
 if(!ready(env))return fail('Portal database not configured.',503);
 const u=await actor(request,env);const denied=mustAuth(u);if(denied)return denied;
 if(!env.PAYSTACK_SECRET_KEY)return fail('Paystack is not configured.',503);
 const reference=clean(new URL(request.url).searchParams.get('reference'),80);
 if(!/^ORQ[A-Z0-9]{26}$/.test(reference))return fail('Invalid transaction reference.');
 try{
  const db=env.ORELQUMI_DB,p=await db.prepare('SELECT p.*,i.customer_id,i.status invoice_status,i.invoice_number FROM payments p JOIN invoices i ON i.id=p.invoice_id WHERE p.reference=?').bind(reference).first();
  if(!p||(u.role!=='admin'&&p.customer_id!==u.id))return fail('Payment not found.',404);
  if(p.invoice_status==='Cancelled')return fail('This invoice was cancelled; contact Orelqumi before taking further action.',409);
  const result=await fetch('https://api.paystack.co/transaction/verify/'+encodeURIComponent(reference),{headers:{Authorization:'Bearer '+env.PAYSTACK_SECRET_KEY}});
  const verified=await result.json();const t=verified?.data;
  if(!result.ok||verified.status!==true||t?.reference!==reference)return fail('Transaction could not be verified. Please retry.',502);
  const matching=t.currency==='KES'&&t.amount===p.amount_cents&&t.domain===p.mode&&t.status==='success';
  if(t.status==='success'&&!matching)return fail('Transaction properties do not match the invoice. Contact Orelqumi.',409);
  if(matching){
   // Idempotent: mark the known payment, then its exact invoice as Paid.
   await db.batch([
    db.prepare("UPDATE payments SET status='Paid',verified_at=datetime('now') WHERE id=? AND status!='Paid'").bind(p.id),
    db.prepare("UPDATE invoices SET status='Paid' WHERE id=? AND status='Unpaid'").bind(p.invoice_id)
   ]);
  }else if(['failed','abandoned','reversed'].includes(t.status)){
   await db.prepare('UPDATE payments SET status=? WHERE id=? AND status!=\'Paid\'').bind(t.status,p.id).run();
  }
  return json({status:matching?'Paid':t.status,reference,invoice_number:p.invoice_number,amount_kes:p.amount_cents/100,mode:p.mode,confirmed:matching});
 }catch{return fail('Verification is temporarily unavailable.',502)}
}
