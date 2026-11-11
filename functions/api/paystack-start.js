// Cloudflare Pages Function. Never expose PAYSTACK_SECRET_KEY to browser code.
function reply(status, body) {
  return new Response(JSON.stringify(body), {status, headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
}
export async function onRequestPost({request,env}) {
  const origin = new URL(request.url).origin;
  if(request.headers.get('origin') !== origin) return reply(403,{error:'Payment requests must originate from this website.'});
  if(!/^application\/json(?:;|$)/i.test(request.headers.get('content-type')||'')) return reply(415,{error:'JSON request required.'});
  if(!env.PAYSTACK_SECRET_KEY || !/^sk_(test|live)_/.test(env.PAYSTACK_SECRET_KEY)) return reply(503,{error:'Payments are not yet activated. Please contact Orelqumi.'});
  const text = await request.text();
  if(text.length>4096) return reply(413,{error:'Request is too large.'});
  let data; try {data=JSON.parse(text)} catch{return reply(400,{error:'Invalid payment details.'})}
  const email=String(data.email||'').trim().toLowerCase();
  const name=String(data.name||'').trim();
  const invoice=String(data.invoice||'').trim().toUpperCase();
  const amountText=String(data.amount||'').trim();
  const amount=Number(amountText);
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>200 || !/^[\p{L}\p{M} .'-]{2,120}$/u.test(name) || !/^[A-Z0-9][A-Z0-9._-]{2,59}$/.test(invoice) || !/^\d{1,7}(?:\.\d{1,2})?$/.test(amountText) || !Number.isFinite(amount) || amount<3 || amount>1000000) {
    return reply(400,{error:'Please enter a valid name, email, invoice reference and amount.'});
  }
  // Amount is supplied by the payer and is NOT authoritative invoice validation.
  // Every payment must be matched manually with the agreed invoice before fulfilment.
  const amountSubunit=Math.round(amount*100);
  const reference='ORQ'+crypto.randomUUID().replace(/-/g,'').slice(0,26).toUpperCase();
  const body={email,amount:amountSubunit,currency:'KES',reference,
    callback_url:origin+'/payment-status.html',
    metadata:JSON.stringify({invoice_reference:invoice,customer_name:name,kind:'agreed_invoice_payment',manual_reconciliation_required:true})};
  try {
    const res=await fetch('https://api.paystack.co/transaction/initialize',{method:'POST',headers:{Authorization:'Bearer '+env.PAYSTACK_SECRET_KEY,'Content-Type':'application/json'},body:JSON.stringify(body)});
    const result=await res.json();
    const url=result?.data?.authorization_url;
    if(!res.ok || result.status!==true || typeof url!=='string')return reply(502,{error:'Paystack could not initialize payment. Please try again or contact Orelqumi.'});
    const destination=new URL(url);
    if(destination.protocol!=='https:' || !['checkout.paystack.com','paystack.com'].includes(destination.hostname)) return reply(502,{error:'Paystack returned an invalid checkout URL.'});
    return reply(200,{authorization_url:destination.href,reference});
  } catch{return reply(502,{error:'Unable to reach Paystack. Please try again later.'});}
}
