import {json,actor,ready} from './_lib.js';
export async function onRequestGet({request,env}){if(!ready(env))return json({error:'Portal database is not configured yet.',ready:false},503);const u=await actor(request,env);return json({authenticated:!!u,user:u||null})}
