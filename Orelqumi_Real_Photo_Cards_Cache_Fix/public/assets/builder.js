// Orelqumi website estimator. Illustrative starting prices only, not a binding quote.
(() => {
'use strict';
const PRICES = {
  'Landing Page / Promotional Website':6500,
  'Personal Portfolio Website':8000,
  'Blog / Magazine / News Website':12000,
  'Business / Company Website':13000,
  'Construction / Home Services Website':13000,
  'School / Education Website':13000,
  'Church / Religious Organisation Website':13000,
  'Professional Services Website':15000,
  'Restaurant / Food Business Website':15000,
  'NGO / Charity / Organisation Website':16000,
  'Healthcare / Clinic Website':18000,
  'Hotel / Tourism / Travel Website':22000,
  'Real Estate / Property Website':22000,
  'Events / Booking Website':25000,
  'Online Store / E-commerce Website':30000,
  'Custom Web App / Online Platform':50000
};
const CARE = {none:0,basic:1500,plus:3000};
const fmt = n => 'KSh ' + n.toLocaleString('en-KE');
const parseNumber = (val,min,max,otherwise) => {
  const n = Number(val);
  return Number.isInteger(n) && n>=min && n<=max ? n : otherwise;
};
const getPlan = obj => {
  const category = Object.prototype.hasOwnProperty.call(PRICES,obj.category) ? obj.category : 'Business / Company Website';
  const pages = parseNumber(obj.pages,1,20,5);
  const booking = obj.booking===true || obj.booking==='1';
  const gallery = obj.gallery===true || obj.gallery==='1';
  const maintenance = Object.prototype.hasOwnProperty.call(CARE,obj.maintenance) ? obj.maintenance : 'none';
  const base = PRICES[category];
  const extraPages = Math.max(0,pages-5)*1500;
  const addons = (booking?5000:0)+(gallery?2000:0);
  return {category,pages,booking,gallery,maintenance,base,extraPages,addons,total:base+extraPages+addons,monthly:CARE[maintenance]};
};
const paramsFromPlan = plan => new URLSearchParams({source:'builder',category:plan.category,pages:String(plan.pages),booking:plan.booking?'1':'0',gallery:plan.gallery?'1':'0',maintenance:plan.maintenance});
const form = document.getElementById('website-builder-form');
if(form){
  const fields={category:document.getElementById('builder-category'),pages:document.getElementById('builder-pages'),booking:document.getElementById('builder-booking'),gallery:document.getElementById('builder-gallery')};
  const getState=()=>getPlan({category:fields.category.value,pages:fields.pages.value,booking:fields.booking.checked,gallery:fields.gallery.checked,maintenance:form.elements.maintenance.value});
  const refresh=()=>{
    const p=getState();
    document.getElementById('builder-pages-value').textContent=p.pages+' '+(p.pages===1?'page':'pages');
    document.getElementById('builder-total').textContent=fmt(p.total);
    document.getElementById('builder-base').textContent=fmt(p.base);
    document.getElementById('builder-extra-pages').textContent=fmt(p.extraPages);
    document.getElementById('builder-add-ons').textContent=fmt(p.addons);
    document.getElementById('builder-care').textContent=p.monthly?fmt(p.monthly)+'/month':'Not selected';
    document.getElementById('builder-quote-link').href='quote.html?'+paramsFromPlan(p).toString();
  };
  const query=new URLSearchParams(location.search);
  if(query.get('source')==='builder'){
    const p=getPlan({category:query.get('category'),pages:query.get('pages'),booking:query.get('booking'),gallery:query.get('gallery'),maintenance:query.get('maintenance')});
    fields.category.value=p.category;fields.pages.value=p.pages;fields.booking.checked=p.booking;fields.gallery.checked=p.gallery;
    form.querySelector('input[name="maintenance"][value="'+p.maintenance+'"]').checked=true;
  }
  form.addEventListener('input',refresh);form.addEventListener('change',refresh);
  document.getElementById('builder-reset').addEventListener('click',()=>{form.reset();refresh();});
  refresh();
}
const quoteForm=document.querySelector('form[data-enquiry="quote"]');
const summary=document.getElementById('builder-quote-summary');
if(quoteForm&&summary){
  const query=new URLSearchParams(location.search);
  if(query.get('source')==='builder'){
    const p=getPlan({category:query.get('category'),pages:query.get('pages'),booking:query.get('booking'),gallery:query.get('gallery'),maintenance:query.get('maintenance')});
    const categorySelect=document.getElementById('package-select');
    if(categorySelect){categorySelect.value=p.category;categorySelect.dispatchEvent(new Event('change',{bubbles:true}));}
    const service=document.getElementById('website-type-select');
    if(service)service.value='Build a brand-new website';
    const careName=p.maintenance==='basic'?'Basic Care':p.maintenance==='plus'?'Business Care':'No maintenance';
    const features=[p.booking?'Booking / appointment system':'',p.gallery?'Advanced photo gallery':''].filter(Boolean);
    document.getElementById('quote-calculator-description').textContent=p.pages+' '+(p.pages===1?'page':'pages')+' · '+(features.length?features.join(' · '):'No optional add-ons')+' · '+careName;
    document.getElementById('quote-calculator-total').textContent='Estimated development: '+fmt(p.total)+' · Monthly care: '+(p.monthly?fmt(p.monthly)+'/month':'none');
    const put=(id,val)=>{document.getElementById(id).value=String(val);};
    put('quote-calc-pages',p.pages);put('quote-calc-booking',p.booking?'Yes':'No');put('quote-calc-gallery',p.gallery?'Yes':'No');put('quote-calc-maintenance',careName);
    put('quote-calc-development',fmt(p.total));put('quote-calc-monthly',p.monthly?fmt(p.monthly)+'/month':'none');
    document.getElementById('quote-edit-calculator').href='build-your-website.html?'+paramsFromPlan(p).toString();
    summary.hidden=false;
    const priceElement=document.getElementById('price-estimate');
    if(priceElement){priceElement.querySelector('strong').textContent=fmt(p.total);priceElement.querySelector('small').textContent='Your calculator estimate; final project pricing is subject to quotation.';}
    // If the visitor changes website category manually, clear the stale calculated plan.
    if(categorySelect){categorySelect.addEventListener('change',()=>{
      if(categorySelect.value===p.category||summary.hidden)return;
      summary.hidden=true;
      ['quote-calc-pages','quote-calc-booking','quote-calc-gallery','quote-calc-maintenance','quote-calc-development','quote-calc-monthly'].forEach(id=>put(id,''));
    });}
  }
}
})();
