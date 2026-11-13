import {json,fail,actor,ready,mustAuth} from './_lib.js';
export async function onRequestGet({request,env}){
 if(!ready(env))return fail('Database not configured.',503);
 const u=await actor(request,env);const denied=mustAuth(u);if(denied)return denied;
 try{
  let users=[],projects=[],invoices=[],payments=[];
  if(u.role==='admin'){
   [users,projects,invoices,payments]=await Promise.all([
    env.DB.prepare("SELECT id,name,email,created_at FROM users WHERE role='customer' ORDER BY created_at DESC LIMIT 150").all(),
    env.DB.prepare('SELECT p.*,u.name customer_name FROM projects p JOIN users u ON p.customer_id=u.id ORDER BY p.updated_at DESC LIMIT 200').all(),
    env.DB.prepare('SELECT i.*,u.name customer_name FROM invoices i JOIN users u ON i.customer_id=u.id ORDER BY i.created_at DESC LIMIT 200').all(),
    env.DB.prepare('SELECT p.*,i.invoice_number FROM payments p JOIN invoices i ON p.invoice_id=i.id ORDER BY p.created_at DESC LIMIT 200').all()]);
  } else {
   [projects,invoices,payments]=await Promise.all([
    env.DB.prepare('SELECT * FROM projects WHERE customer_id=? ORDER BY updated_at DESC LIMIT 100').bind(u.id).all(),
    env.DB.prepare('SELECT * FROM invoices WHERE customer_id=? ORDER BY created_at DESC LIMIT 100').bind(u.id).all(),
    env.DB.prepare('SELECT p.*,i.invoice_number FROM payments p JOIN invoices i ON p.invoice_id=i.id WHERE i.customer_id=? ORDER BY p.created_at DESC LIMIT 100').bind(u.id).all()]);
  }
  return json({user:u,clients:users.results||[],projects:projects.results||[],invoices:invoices.results||[],payments:payments.results||[]});
 }catch{return fail('Unable to load account data.',500)}
}
