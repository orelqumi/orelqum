import {json,fail,ready,originOK,bodyJSON,emailOK,clean,passwordOK,passwordHash,randomHex,createSession} from './_lib.js';
export async function onRequestPost({request,env}){
 if(!originOK(request))return fail('Invalid request origin.',403);
 if(!ready(env))return fail('Database not configured.',503);
 if(!env.ORELQUMI_SETUP_KEY||env.ORELQUMI_SETUP_KEY.length<24)return fail('Admin setup is not enabled.',503);
 try{
  const count=await env.ORELQUMI_DB.prepare("SELECT count(*) n FROM users WHERE role='admin'").first();
  if(count.n)return fail('Administrator account already exists. Setup is disabled.',409);
  const b=await bodyJSON(request);const email=clean(b.email,180).toLowerCase(),name=clean(b.name,100),password=b.password;
  if(b.setup_key!==env.ORELQUMI_SETUP_KEY)return fail('Invalid setup code.',403);
  if(!emailOK(email)||name.length<2||!passwordOK(password))return fail('Enter a name, valid email and password of at least 12 characters.',400);
  const id=crypto.randomUUID(),salt=randomHex(18),hash=await passwordHash(password,salt);
  await env.ORELQUMI_DB.prepare('INSERT INTO users(id,email,name,role,password_salt,password_hash) VALUES(?,?,?,?,?,?)').bind(id,email,name,'admin',salt,hash).run();
  return new Response(JSON.stringify({ok:true,user:{name,email,role:'admin'}}),{headers:{'content-type':'application/json','cache-control':'no-store','set-cookie':await createSession(env,id)}});
 }catch{return fail('Setup failed. Confirm the database tables exist and retry.',500)}
}
