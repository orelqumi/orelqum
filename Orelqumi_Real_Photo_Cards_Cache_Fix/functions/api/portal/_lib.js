// Portal utilities - Cloudflare Pages Functions, D1 database. No private data in browser bundles.
const enc = new TextEncoder();
export function json(body,status=200){return new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}})}
export function fail(message,status=400){return json({error:message},status)}
export function ready(env){return !!env.DB}
export function originOK(request){const origin=request.headers.get('origin');return origin===new URL(request.url).origin}
export async function bodyJSON(request){if(!/^application\/json(?:;|$)/i.test(request.headers.get('content-type')||''))throw Error('JSON request required');const raw=await request.text();if(raw.length>12000)throw Error('Request too large');return JSON.parse(raw)}
const hex=(buf)=>Array.from(new Uint8Array(buf),x=>x.toString(16).padStart(2,'0')).join('');
export function bytesHex(bytes){return Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('')}
export async function sha(s){return hex(await crypto.subtle.digest('SHA-256',enc.encode(s)))}
export function randomHex(n=32){const b=new Uint8Array(n);crypto.getRandomValues(b);return bytesHex(b)}
export async function passwordHash(password,salt){const key=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);return hex(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:enc.encode(salt),iterations:140000},key,256))}
export function equal(a,b){if(!a||!b||a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0}
export function emailOK(value){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)&&value.length<=180}
export function passwordOK(v){return typeof v==='string'&&v.length>=12&&v.length<=128}
export function clean(s,max=160){return typeof s==='string'?s.trim().slice(0,max):''}
export async function actor(request,env){if(!ready(env))return null;const raw=request.headers.get('cookie')||'';const tok=raw.match(/(?:^|;\s*)orq_session=([a-f0-9]{64})(?:;|$)/)?.[1];if(!tok)return null;const tokenHash=await sha(tok);const row=await env.DB.prepare('SELECT u.id,u.name,u.email,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?').bind(tokenHash,Date.now()).first();return row||null}
export function sessionCookie(token,maxAge){const secure='Secure; HttpOnly; SameSite=Strict; Path=/';return token?`orq_session=${token}; ${secure}; Max-Age=${maxAge}`:`orq_session=; ${secure}; Max-Age=0`}
export async function createSession(env,userId){const token=randomHex(32);await env.DB.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').bind(await sha(token),userId,Date.now()+7*24*60*60*1000).run();return sessionCookie(token,7*24*60*60)}
export async function clearSession(request,env){const tok=(request.headers.get('cookie')||'').match(/(?:^|;\s*)orq_session=([a-f0-9]{64})(?:;|$)/)?.[1];if(tok&&ready(env))await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha(tok)).run();return sessionCookie('',0)}
export function mustAuth(user,role){if(!user)return fail('Sign in to continue.',401);if(role&&user.role!==role)return fail('You do not have access to this action.',403);return null}
export function safeError(e){return fail('Request could not be completed. Please retry or contact Orelqumi.',500)}
