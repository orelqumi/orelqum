// Intentionally closed: freeform customer-entered invoice amounts are unsafe for live collection.
export async function onRequestPost(){return new Response(JSON.stringify({error:'Invoice payments have moved to the secure customer portal. Sign in at /dashboard-login.html.'}),{status:410,headers:{'content-type':'application/json','cache-control':'no-store'}})}
