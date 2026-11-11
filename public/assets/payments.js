// One-time invoice payments. Checkout is initialized and verified by Cloudflare Functions.
(() => {'use strict';
const form=document.getElementById('invoice-payment-form');
const msg=document.getElementById('pay-message');
const show=(message,err=false)=>{if(!msg)return;msg.hidden=false;msg.textContent=message;msg.style.color=err?'#ffc0b5':''};
if(form){form.addEventListener('submit',async(event)=>{
  event.preventDefault();if(!form.reportValidity())return;
  const button=document.getElementById('pay-submit');button.disabled=true;button.textContent='Opening secure checkout…';show('Contacting Paystack securely…');
  const payload={name:form.elements.name.value,email:form.elements.email.value,invoice:form.elements.invoice.value,amount:form.elements.amount.value};
  try{
    const response=await fetch('/api/paystack-start',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
    const result=await response.json();
    if(!response.ok)throw new Error(result.error||'Unable to start the payment.');
    const url=new URL(result.authorization_url);
    if(url.protocol!=='https:'||!['checkout.paystack.com','paystack.com'].includes(url.hostname))throw Error('Payment checkout was invalid.');
    window.location.assign(url.href);
  }catch(error){show(error.message||'Payment service unavailable.',true);button.disabled=false;button.textContent='Proceed securely to Paystack →';}
});}
const status=document.getElementById('payment-result');
if(status){const reference=new URLSearchParams(window.location.search).get('reference');
  const ref=document.getElementById('payment-reference');
  if(!reference){status.textContent='No payment reference was provided. If you completed a payment, contact Orelqumi with your Paystack receipt.';return;}
  if(ref)ref.textContent='Paystack reference: '+reference;
  fetch('/api/paystack-verify?reference='+encodeURIComponent(reference),{cache:'no-store'})
  .then(async r=>{const result=await r.json();if(!r.ok)throw new Error(result.error||'Unable to verify payment.');return result;})
  .then(r=>{const amount=new Intl.NumberFormat('en-KE',{style:'currency',currency:'KES'}).format(r.amount_kes);
    status.textContent=r.status==='success'?`Payment verified by Paystack: ${amount} (${r.mode} mode). Orelqumi will still match it with your agreed invoice before confirming your project.`:`Payment status: ${r.status}. Payment is NOT confirmed. If you paid, check again later or contact Orelqumi with your reference.`;
  })
  .catch(error=>{status.textContent=(error.message||'Could not verify payment')+' Keep your receipt and contact Orelqumi; do not pay again until the status is checked.';});
}
})();
