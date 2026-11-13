// Server-side verification: never treat a return URL as proof of payment.
function reply(status,body){return new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}})}
export async function onRequestGet({request,env}){
  if(!env.PAYSTACK_SECRET_KEY) return reply(503,{error:'Payments are not yet activated.'});
  const reference=new URL(request.url).searchParams.get('reference')||'';
  if(!/^ORQ[A-Z0-9]{26}$/.test(reference)) return reply(400,{error:'Invalid payment reference.'});
  try{
    const res=await fetch('https://api.paystack.co/transaction/verify/'+encodeURIComponent(reference),{headers:{Authorization:'Bearer '+env.PAYSTACK_SECRET_KEY}});
    const result=await res.json();
    if(!res.ok||result.status!==true||result.data?.reference!==reference)return reply(404,{error:'No matching payment was found.'});
    const p=result.data;
    if(p.currency!=='KES' || !Number.isInteger(p.amount) || p.amount<300)return reply(422,{error:'Unexpected payment properties. Contact Orelqumi.'});
    return reply(200,{status:p.status==='success'?'success':p.status,reference,amount_kes:p.amount/100,currency:p.currency,mode:p.domain==='live'?'live':'test',note:'Orelqumi must reconcile this transaction against your agreed invoice.'});
  }catch{return reply(502,{error:'Verification is temporarily unavailable. Try again later.'});}
}
