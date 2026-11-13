import {json,fail,actor,ready,originOK,bodyJSON,passwordOK,passwordHash,equal,randomHex,clearSession} from './_lib.js';
export async function onRequestPost({request,env}){
 if(!ready(env)||!originOK(request))return fail('Invalid request.',403);
 const u=await actor(request,env);if(!u)return fail('Sign in first.',401);
 try{const b=await bodyJSON(request);if(!passwordOK(b.new_password))return fail('New password must have at least 12 characters.');const old=await env.DB.prepare('SELECT password_salt,password_hash FROM users WHERE id=?').bind(u.id).first();if(!equal(await passwordHash(b.current_password||'',old.password_salt),old.password_hash))return fail('Current password is incorrect.',403);
 const salt=randomHex(18),hash=await passwordHash(b.new_password,salt);await env.DB.prepare('UPDATE users SET password_salt=?,password_hash=? WHERE id=?').bind(salt,hash,u.id).run();await env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(u.id).run();return new Response(JSON.stringify({ok:true}),{headers:{'content-type':'application/json','set-cookie':await clearSession(request,env)}});
 }catch{return fail('Password change failed.',500)}
}
