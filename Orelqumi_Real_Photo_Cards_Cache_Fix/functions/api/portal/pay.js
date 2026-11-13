import {json,fail,ready,actor,mustAuth,originOK,bodyJSON,clean} from './_lib.js';
export async function onRequestPost({request,env}){
 if(!ready(env))return fail('Portal not activated.',503);
 if(!originOK(request))return fail('Invalid origin.',403);
 const u=await actor(request,env);const denied=mustAuth(u,'customer');if(denied)return denied;
 if(!env.PAYSTACK_SECRET_KEY||!/^sk_(test|live)_/.test(env.PAYSTACK_SECRET_KEY))return fail('Paystack is not configured.',503);
 try{
  const b=await bodyJSON(request),id=clean(b.invoice_id,80),db=env.DB;
  const invoice=await db.prepare("SELECT * FROM invoices WHERE id=? AND customer_id=? AND status='Unpaid'").bind(id,u.id).first();
  if(!invoice)return fail('Unpaid invoice not found.',404);
  const mode=env.PAYSTACK_SECRET_KEY.startsWith('sk_live_')?'live':'test';
  const reference='ORQ'+crypto.randomUUID().replace(/-/g,'').slice(0,26).toUpperCase();
  const payload={email:u.email,amount:invoice.amount_cents,currency:'KES',reference,callback_url:new URL(request.url).origin+'/dashboard.html?payment='+encodeURIComponent(reference),metadata:JSON.stringify({invoice_id:invoice.id,invoice_number:invoice.invoice_number,customer_id:u.id})};
  const reply=await fetch('https://api.paystack.co/transaction/initialize',{method:'POST',headers:{'Authorization':'Bearer '+env.PAYSTACK_SECRET_KEY,'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const result=await reply.json();const url=result?.data?.authorization_url;
  if(!reply.ok||result.status!==true||typeof url!=='string')return fail('Paystack checkout is unavailable. Try again later.',502);
  const parsed=new URL(url);if(parsed.protocol!=='https:'||!['checkout.paystack.com','paystack.com'].includes(parsed.hostname))return fail('Invalid checkout URL.',502);
  await db.prepare('INSERT INTO payments(id,invoice_id,reference,amount_cents,currency,mode,status) VALUES(?,?,?,?,?,?,?)').bind(crypto.randomUUID(),invoice.id,reference,invoice.amount_cents,'KES',mode,'Pending').run();
  return json({checkout_url:parsed.href,reference,invoice_number:invoice.invoice_number,amount_kes:invoice.amount_cents/100,mode});
 }catch{return fail('Unable to start checkout. Please retry.',502)}
}
