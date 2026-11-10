// Orelqumi Technologies — static site interactions.
const menu=document.querySelector('.menu-btn'),nav=document.querySelector('.nav-links');
if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}))}
// Static hosting has no server. An email draft is opened instead of claiming a submission was received.
document.querySelectorAll('form[data-enquiry]').forEach(form=>form.addEventListener('submit',e=>{
 e.preventDefault();if(!form.reportValidity())return;
 const data=new FormData(form),kind=form.dataset.enquiry,subject='Orelqumi — '+(kind==='enrol'?'Academy enrolment enquiry':kind==='quote'?'Website project enquiry':'General contact enquiry');
 const rows=[...data.entries()].filter(([k])=>k!=='_gotcha').map(([k,v])=>`${k.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}: ${v}`);
 const recipient=window.ORELQUMI_CONTACT_EMAIL||'';
 const destination=recipient?recipient:'';
 const body=`Hello Orelqumi Technologies,\n\n${rows.join('\n')}\n\nSent from the Orelqumi website.`;
 const href='mailto:'+destination+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
 const msg=form.querySelector('[data-form-status]');if(msg){msg.textContent=recipient?'Your email app should open with the enquiry ready to send. Please press Send in your email app.':'Your email app should open with your enquiry ready. Enter the Orelqumi contact address as recipient, then press Send. The website owner must configure the email destination in assets/config.js.';msg.hidden=false;}
 window.location.href=href;
}));