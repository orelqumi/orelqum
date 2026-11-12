import {json,originOK,fail,clearSession} from './_lib.js';
export async function onRequestPost({request,env}){if(!originOK(request))return fail('Invalid request origin.',403);const cookie=await clearSession(request,env);return new Response(JSON.stringify({ok:true}),{headers:{'content-type':'application/json','cache-control':'no-store','set-cookie':cookie}})}
