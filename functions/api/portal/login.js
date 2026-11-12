import {json,fail,ready,originOK,bodyJSON,clean,passwordHash,equal,createSession} from './_lib.js';
export async function onRequestPost({request,env}){
 if(!originOK(request))return fail('Invalid request origin.',403);
 if(!ready(env))return fail('Database not configured.',503);
 try{
  const b=await bodyJSON(request);const email=clean(b.email,180).toLowerCase();if(!email||typeof b.password!=='string')return fail('Enter your email and password.');
  const now=Date.now(),tries=await env.DB.prepare('SELECT failures,blocked_until FROM login_attempts WHERE email=?').bind(email).first();
  if(tries?.blocked_until>now)return fail('Too many attempts. Try again later.',429);
  const user=await env.DB.prepare('SELECT * FROM users WHERE email=?').bind(email).first();
  const hash=await passwordHash(b.password,user?.password_salt||'unrecognised-login');
  if(!user||!equal(user.password_hash,hash)){
   const count=(tries?.failures||0)+1;await env.DB.prepare('INSERT INTO login_attempts(email,failures,blocked_until) VALUES(?,?,?) ON CONFLICT(email) DO UPDATE SET failures=excluded.failures,blocked_until=excluded.blocked_until').bind(email,count>=5?0:count,count>=5?now+15*60*1000:0).run();
   return fail('Incorrect email or password.',401);
  }
  await env.DB.prepare('DELETE FROM login_attempts WHERE email=?').bind(email).run();
  const cookie=await createSession(env,user.id);
  return new Response(JSON.stringify({ok:true,user:{id:user.id,name:user.name,email:user.email,role:user.role}}),{headers:{'content-type':'application/json','cache-control':'no-store','set-cookie':cookie}});
 }catch{return fail('Unable to sign in. Please retry.',500)}
}
